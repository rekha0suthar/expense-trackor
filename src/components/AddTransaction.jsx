import React, { useContext } from 'react';
import { TransactionContext } from '../context/transactionContext';

const AddTransaction = ({ handleTransaction }) => {
  const { amount, setAmount, use, setUse } = useContext(TransactionContext);
  return (
    <div>
      <h2>Add New Transactions</h2>
      <label>Purpose</label>
      <br />
      <input
        type="text"
        value={use}
        onChange={(e) => setUse(e.target.value)}
        placeholder="Enter transaction purpuse"
      />
      <br />
      <label>Amount</label>
      <br />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
      />
      <br />
      <button className="add-btn" onClick={handleTransaction}>
        Add Transaction
      </button>
    </div>
  );
};

export default AddTransaction;
