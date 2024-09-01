import React, { useContext } from 'react';
import { TransactionContext } from '../context/transactionContext';

const Balance = () => {
  const { balance, income, expense } = useContext(TransactionContext);
  return (
    <div>
      <div className="header">
        {' '}
        <h2>Your Balance:</h2>
        <h2> ${balance}</h2>
      </div>
      <div className="wrapper">
        <div>
          Income <strong>${income}</strong>
        </div>
        <div>
          Expense<strong>${Math.abs(expense)}</strong>
        </div>
      </div>
    </div>
  );
};

export default Balance;
