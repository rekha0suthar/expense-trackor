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

  // Memoized exchange rate fetch
  const fetchExchangeRate = useCallback(
    async (currency) => {
      if (currency === 'INR') {
        setExchangeRate(1);
        return;
      }
      try {
        const response = await axios(
          `https://api.exchangerate-api.com/v4/latest/INR`
        );
        const newRate = response.data.rates[currency];
        setExchangeRate(newRate);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    },
    [setExchangeRate]
  );

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
  }, [
    fetchData,
    setSelectedCurrency,
    setIncome,
    setExpense,
    fetchExchangeRate,
  ]);

  // Debounced balance update
  const debouncedUpdateBalance = useCallback(
    (balanceData) => {
      fetchData(`${API_URL}/balance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(balanceData),
      })
        .then(() => invalidateCache(`${API_URL}/balance`))
        .catch((error) => console.error('Error updating balance:', error));
    },
    [fetchData, invalidateCache]
  );

  // Update addBalance to use debounce directly
  const addBalance = useCallback(
    (e) => {
      e.preventDefault();
      debounce(
        (data) => debouncedUpdateBalance(data),
        1000
      )({
        currency: selectedCurrency,
        balanceAmount: newBalance,
      });
    },
    [selectedCurrency, newBalance, debouncedUpdateBalance]
  );

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Handle currency change and update balance based on the new exchange rate
  const handleCurrencyChange = async (e) => {
    const newCurrency = e.target.value;

    // Fetch the new exchange rate
    await fetchExchangeRate(newCurrency);

    // Convert current balance and expenses to the new currency
    const currentBalanceInINR = balance / exchangeRate; // Convert current balance to INR
    const currentExpenseInINR = expense / exchangeRate; // Convert current expenses to INR

    // Update the selected currency
    setSelectedCurrency(newCurrency);

    // Calculate the new balance and expenses in the new currency
    const convertedBalance = currentBalanceInINR * exchangeRate; // Convert to new currency
    const convertedExpense = currentExpenseInINR * exchangeRate; // Convert to new currency

    // Update state with converted values
    setNewBalance(convertedBalance);
    setIncome(convertedBalance);
    setExpense(convertedExpense);
    setBalance(convertedBalance - convertedExpense); // Update balance based on new values
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
        <h2>Total Budget</h2>
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
          <span className="stat-label">Available Budget</span>
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
