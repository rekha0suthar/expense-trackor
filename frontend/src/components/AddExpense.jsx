import React, { useContext, useEffect, useState, useCallback } from 'react';
import { TransactionContext } from '../context/transactionContext';
import { fetchBalance, fetchExpense } from '../utils';
import '../css/add-expense.css';
import debounce from 'lodash.debounce'; // Use lodash debounce for better control

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories only once when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/category');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [setCategories, setLoading]);

  // Using useCallback to memoize the function
  const handleTransaction = debounce(async () => {
    if (!amount || !use || !expenseDate || isSubmitting) {
      alert(
        'Please fill all fields and wait for the current request to finish!'
      );
      return;
    }

    setIsSubmitting(true);

    const newExpense = {
      purpose: use,
      amount,
      expenseDate: new Date(expenseDate),
    };

    try {
      const response = await fetch('http://localhost:5001/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        const addedExpense = await response.json();
        setTransaction((prev) => [...prev, addedExpense]);

        // Reset fields
        setAmount(0);
        setUse('');
        setExpenseDate(null);

        // Update expenses and balance
        fetchExpense(setLoading, setExpense);
        fetchBalance(setSelectedCurrency, setIncome);
      } else {
        console.error('Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, 500); // Debounce for 500ms

  const handleAddCategory = useCallback(
    async (e) => {
      e.preventDefault();
      setIsEditing(!isEditing);
      if (isEditing && category) {
        try {
          const response = await fetch('http://localhost:5001/api/category', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: category }),
          });

          if (!response.ok) {
            const data = await response.json();
            alert(data.message);
            setCategory('');
          } else {
            setCategories((prev) => [...prev, { title: category }]);
            setCategory('');
          }
        } catch (error) {
          console.error('Error adding category:', error);
        }
      }
    },
    [isEditing, category, setCategories, setCategory, setIsEditing]
  );

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
        onChange={(e) => setUse(e.target.value)}
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
      <button
        className="add-btn"
        onClick={handleTransaction}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Transaction'}
      </button>
    </div>
  );
};

export default AddExpense;
