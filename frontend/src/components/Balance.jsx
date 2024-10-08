import React, { useContext, useEffect } from 'react';
import { TransactionContext } from '../context/transactionContext';

const Balance = () => {
  const { balance, setBalance, income, expense, setExpense } =
    useContext(TransactionContext);
  useEffect(() => {
    const fetchExpense = async () => {
      const response = await fetch('http://localhost:5000/api/expenses'); // Updated URL to match your aggregation endpoint
      const data = await response.json();
      // Calculate total expenses for each month
      const totalExpenses = data.reduce((acc, curr) => acc + curr.total, 0); // Change 'total' to 'amount'

      setExpense(totalExpenses);
      setBalance(income - totalExpenses);
    };
    fetchExpense();
  }, [setExpense, setBalance, income]);
  return (
    <div>
      <div className="header">
        {' '}
        <h2>Your Balance:</h2>
        <h2> ₹{balance}</h2>
      </div>
      <div className="wrapper">
        <div>
          Income <strong>₹{income}</strong>
        </div>
        <div>
          Expense<strong>₹{Math.abs(expense)}</strong>
        </div>
      </div>
    </div>
  );
};

export default Balance;
