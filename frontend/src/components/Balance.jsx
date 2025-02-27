import React, { useContext, useEffect, useState, useCallback } from 'react';
import { TransactionContext } from '../context/transactionContext';
import { formatCurrency } from '../utils';
import { useApiCache } from '../hooks/useApiCache';
import '../css/balance.css';
import '../css/common.css';
import { debounce } from 'lodash';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'https://expense-trackor-backend.vercel.app/api';

const Balance = () => {
  const {
    balance,
    setBalance,
    setIncome,
    expense,
    setExpense,
    selectedCurrency,
    setSelectedCurrency,
    exchangeRate,
    setExchangeRate,
  } = useContext(TransactionContext);

  const { fetchData, invalidateCache } = useApiCache();
  const [newBalance, setNewBalance] = useState(10); // Local state for new balance

  // Currency options
  const currencies = ['INR', 'USD', 'EUR', 'GBP'];

  // Memoized fetch functions
  const fetchInitialData = useCallback(async () => {
    try {
      const [balanceData, expenseData] = await Promise.all([
        fetchData(`${API_URL}/balance`),
        fetchData(`${API_URL}/expenses`),
      ]);

      if (balanceData.length > 0) {
        const latestBalance = balanceData[balanceData.length - 1];
        setSelectedCurrency(latestBalance.currency);
        setNewBalance(latestBalance.balanceAmount);
        setIncome(latestBalance.balanceAmount);
        await fetchExchangeRate(latestBalance.currency);
      }

      const totalExpenses = expenseData.reduce(
        (acc, curr) => acc + curr.total,
        0
      );
      setExpense(totalExpenses);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  }, [fetchData, setSelectedCurrency, setIncome, setExpense]);

  // Debounced balance update
  const debouncedUpdateBalance = useCallback(
    debounce(async (balanceData) => {
      try {
        await fetchData(`${API_URL}/balance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(balanceData),
        });
        // Invalidate balance cache after update
        invalidateCache(`${API_URL}/balance`);
      } catch (error) {
        console.error('Error updating balance:', error);
      }
    }, 1000),
    [fetchData, invalidateCache]
  );

  // Memoized exchange rate fetch
  const fetchExchangeRate = useCallback(
    async (currency) => {
      if (currency === 'INR') {
        setExchangeRate(1);
        return;
      }
      try {
        const data = await axios(
          `https://api.exchangerate-api.com/v4/latest/INR`
        );
        setExchangeRate(data.rates[currency]);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    },
    [setExchangeRate]
  );

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Update addBalance to use debounced version
  const addBalance = async (e) => {
    e.preventDefault();
    debouncedUpdateBalance({
      currency: selectedCurrency,
      balanceAmount: newBalance,
    });
  };

  // Handle currency change and update balance based on the new exchange rate
  const handleCurrencyChange = async (e) => {
    const newCurrency = e.target.value;
    const currentBalanceInINR = balance / exchangeRate; // Use balance instead of newBalance

    await fetchExchangeRate(newCurrency);
    setSelectedCurrency(newCurrency);

    // Convert INR balance to new currency
    const convertedBalance = currentBalanceInINR * exchangeRate;
    setNewBalance(convertedBalance);
    setIncome(convertedBalance);
  };

  // Update input handling to properly handle currency conversion
  const handleBalanceInput = (e) => {
    const inputValue = parseFloat(e.target.value);
    setNewBalance(inputValue / exchangeRate); // Store base value
  };

  // Update balance whenever newBalance or expense changes
  useEffect(() => {
    setBalance(newBalance - expense); // Calculate balance as income - expense
  }, [newBalance, expense, setBalance]);

  return (
    <div className="card balance-card">
      <div className="balance-header">
        <h2>Total Balance</h2>
        <div className="currency-controls">
          <select
            className="currency-selector"
            value={selectedCurrency}
            onChange={handleCurrencyChange}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <div className="balance-input-group">
            <input
              type="number"
              value={(newBalance * exchangeRate).toFixed(2)}
              onChange={handleBalanceInput}
              min="0"
              step="0.01"
              className="balance-input"
            />
            <button className="btn btn-primary" onClick={addBalance}>
              <FaPlus />
            </button>
          </div>
        </div>
      </div>

      <div className="balance-stats">
        <div className="stat-card">
          <span className="stat-label">Available Balance</span>
          <span className="stat-value positive">
            {formatCurrency(selectedCurrency, exchangeRate, balance)}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Expenses</span>
          <span className="stat-value negative">
            {formatCurrency(selectedCurrency, exchangeRate, expense)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Balance;
