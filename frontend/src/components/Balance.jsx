import React, { useContext, useEffect, useState } from 'react';
import { TransactionContext } from '../context/transactionContext';
import { formatCurrency } from '../utils';
import '../css/balance.css';

const Balance = () => {
  const {
    balance,
    setBalance,
    setIncome,
    expense,
    setExpense,
    setLoading,
    selectedCurrency,
    setSelectedCurrency,
    exchangeRate,
    setExchangeRate,
  } = useContext(TransactionContext);

  const [newBalance, setNewBalance] = useState(10); // Local state for new balance

  // Currency options
  const currencies = ['INR', 'USD', 'EUR', 'GBP'];

  // Fetch exchange rate
  const fetchExchangeRate = async (currency) => {
    if (currency === 'INR') {
      setExchangeRate(1); // No conversion for INR
      return;
    }
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/INR`
      );
      const data = await response.json();
      setExchangeRate(data.rates[currency]);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  // Handle currency change and update balance based on the new exchange rate
  const handleCurrencyChange = async (e) => {
    const newCurrency = e.target.value;
    const currentBalanceInINR = newBalance / exchangeRate; // Convert balance back to INR

    await fetchExchangeRate(newCurrency); // Fetch new exchange rate for the selected currency

    setSelectedCurrency(newCurrency);

    // After fetching the exchange rate, convert INR balance to new currency
    const convertedBalance = currentBalanceInINR * exchangeRate;
    setNewBalance(convertedBalance); // Update the displayed balance in new currency
    setIncome(convertedBalance);
  };

  // Add new balance to the backend
  const addBalance = async (e) => {
    e.preventDefault();
    try {
      await fetch('https://expense-trackor-backend.vercel.app/api/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency: selectedCurrency,
          balanceAmount: newBalance,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Update balance whenever newBalance or expense changes
  useEffect(() => {
    setBalance(newBalance - expense); // Calculate balance as income - expense
  }, [newBalance, expense, setBalance]);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://expense-trackor-backend.vercel.app/api/expenses'
        );
        const data = await response.json();
        const totalExpenses = data.reduce((acc, curr) => acc + curr.total, 0);

        setExpense(totalExpenses);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchBalance = async () => {
      try {
        const response = await fetch(
          'https://expense-trackor-backend.vercel.app/api/balance'
        );
        const data = await response.json();
        data.forEach((item) => {
          setSelectedCurrency(item.currency);
          setNewBalance(item.balanceAmount);
          setIncome(item.balanceAmount);
        });
      } catch (err) {
        console.error('Error fetching balance:', err);
      }
    };

    fetchBalance();
    fetchExpense();
  }, [setExpense, setLoading, setSelectedCurrency, setIncome]);

  return (
    <>
      <div className="balance-header">
        <h2>Total Balance:</h2>
        {/* Currency Selector */}
        <div className="currency-selector">
          <select value={selectedCurrency} onChange={handleCurrencyChange}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <h2>
            <input
              type="number"
              value={(newBalance * exchangeRate).toFixed(2)} // Format to 2 decimal places
              onChange={(e) => setNewBalance(parseFloat(e.target.value))} // Parse input to float
            />
          </h2>
          <button onClick={addBalance}>+</button>
        </div>
      </div>
      <div className="wrapper">
        <div>
          Left Balance{' '}
          <strong>
            {formatCurrency(selectedCurrency, exchangeRate, balance)}
          </strong>
        </div>
        <div>
          Total Expenses{' '}
          <strong>
            {formatCurrency(selectedCurrency, exchangeRate, expense)}
          </strong>
        </div>
      </div>
    </>
  );
};

export default Balance;
