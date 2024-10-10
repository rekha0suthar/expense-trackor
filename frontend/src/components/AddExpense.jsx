import React, { useContext, useEffect } from 'react';
import { TransactionContext } from '../context/transactionContext';
import { addExpense, fetchBalance, fetchExpense } from '../utils';
import '../css/add-expense.css';

const AddExpense = () => {
  const {
    setTransaction,
    amount,
    setAmount,
    use,
    setUse,
    expenseDate,
    setExpenseDate,
    isEditing,
    setIsEditing,
    category,
    setCategory,
    categories,
    setCategories,
    setLoading,
    setExpense,
    setSelectedCurrency,
    setIncome,
  } = useContext(TransactionContext);

  const handleTransaction = async () => {
    const newExpense = {
      purpose: use,
      amount,
      expenseDate: new Date(expenseDate), // Convert to proper Date object
    };

    // Post the new expense to the server
    const response = addExpense(newExpense);
    fetchExpense(setLoading, setExpense);
    fetchBalance(setSelectedCurrency, setIncome);

    if (response.ok) {
      const addedExpense = await response.json();

      // Immediately add it to the state
      setTransaction((prevTransactions) => {
        // Extract month and year from the added expense date
        const expenseMonth = new Date(addedExpense.expenseDate).getMonth() + 1; // Months are zero-indexed
        const expenseYear = new Date(addedExpense.expenseDate).getFullYear();

        // Check if the transaction for the same month and year exists
        const monthGroup = prevTransactions.find(
          (t) => t.month === expenseMonth && t.year === expenseYear
        );

        if (monthGroup) {
          // If the month exists, add the new expense to it
          return prevTransactions.map((t) =>
            t.month === expenseMonth && t.year === expenseYear
              ? {
                  ...t,
                  expenses: [...t.expenses, addedExpense],
                  total: t.total + addedExpense.amount,
                }
              : t
          );
        } else {
          // If it's a new month, add a new group for the month
          return [
            ...prevTransactions,
            {
              month: expenseMonth,
              year: expenseYear,
              expenses: [addedExpense],
              total: addedExpense.amount,
            },
          ];
        }
      });
    } else {
      console.error('Failed to add new expense');
    }
    setAmount(0);
    setUse('');
    setExpenseDate(null);
  };

  const handleAddCategory = async () => {
    setIsEditing(!isEditing);
    if (isEditing && category) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/category`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: category }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          alert(data.message); // Set error message from server
          setCategory('');
        } else {
          setCategories((prev) => [...prev, { title: category }]); // Add new category to state
          setCategory('');
        }
      } catch (error) {
        console.error(error);
      }
    }
    return;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/category`); // Updated URL to match your aggregation endpoint
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, [setCategories]);

  return (
    <div className="add-expense-form">
      <div className="add-header" style={{ display: !isEditing && 'flex' }}>
        <h2>Add Expense</h2>
        <div className="category">
          {isEditing && (
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Add new category"
            />
          )}
          <button onClick={handleAddCategory}>Add Category</button>
        </div>
      </div>
      <label>Purpose</label>
      <br />
      <select
        value={use}
        onChange={(e) => {
          setUse(e.target.value);
        }}
        className="category-selector"
      >
        <option value="">Select a purpose</option>
        {categories.map(({ id, title }) => (
          <option key={id} value={title}>
            {title}
          </option>
        ))}
      </select>
      <br />
      <label>Amount</label>
      <br />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
      />
      <br />
      <label>Expense Date</label>
      <br />
      <input type="date" onChange={(e) => setExpenseDate(e.target.value)} />
      <button className="add-btn" onClick={handleTransaction}>
        Add Transaction
      </button>
    </div>
  );
};

export default AddExpense;
