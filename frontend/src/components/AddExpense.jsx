import React, { useContext, useEffect, useState, useCallback } from 'react';
import { TransactionContext } from '../context/transactionContext';
import { fetchBalance, fetchExpense } from '../utils';
import '../css/add-expense.css';
import '../css/common.css';
import { debounce } from 'lodash';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { useApi } from '../hooks/useApi';
import { addCategory, addExpense, getCategories } from '../apis';

const API_URL = process.env.REACT_APP_API_URL;

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
  const { fetchData } = useApi();

  // Fetch categories only once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [setCategories]);

  // Debounced transaction handler
  const debouncedHandleTransaction = useCallback(
    debounce(async (e) => {
      e.preventDefault();
      if (!amount || !use || !expenseDate || isSubmitting) {
        alert('Please fill all fields');
        return;
      }

      setIsSubmitting(true);
      try {
        const newExpense = {
          purpose: use,
          amount: parseFloat(amount),
          expenseDate: new Date(expenseDate).toISOString(),
        };

        const addedExpense = await addExpense(newExpense);

        setTransaction((prev) => [...prev, addedExpense]);

        // Reset form
        setAmount(0);
        setUse('');
        setExpenseDate('');

        // Update data
        await Promise.all([
          fetchExpense(setLoading, setExpense),
          fetchBalance(setSelectedCurrency, setIncome),
        ]);
      } catch (error) {
        console.error('Error adding expense:', error);
        alert('Failed to add expense. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1000),
    [amount, use, expenseDate, isSubmitting, fetchData]
  );

  const handleAddCategory = useCallback(
    async (e) => {
      e.preventDefault();
      setIsEditing(!isEditing);
      if (isEditing && category) {
        try {
          await addCategory({ title: category });
          setCategory('');

          setCategories((prev) => [...prev, { title: category }]);
        } catch (error) {
          console.error('Error adding category:', error);
        }
      }
    },
    [isEditing, category, setCategories, setCategory, setIsEditing]
  );

  return (
    <div className="card expense-card">
      <div className="expense-header">
        <h2>Add Expense</h2>
        <button
          className={`btn ${isEditing ? 'btn-danger' : 'btn-primary'}`}
          onClick={handleAddCategory}
        >
          {isEditing ? <FaTimes /> : <FaPlus />}
          {isEditing ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {isEditing && (
        <div className="category-form">
          <div className="input-group">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category name"
              className="category-input"
            />
          </div>
          <button
            className="btn btn-success"
            onClick={handleAddCategory}
            disabled={!category}
          >
            <FaPlus /> Save Category
          </button>
        </div>
      )}

      <form className="expense-form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <label>Purpose</label>
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
        </div>

        <div className="input-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            min="0"
            step="0.01"
          />
        </div>

        <div className="input-group">
          <label>Expense Date</label>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary submit-btn"
          onClick={debouncedHandleTransaction}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
