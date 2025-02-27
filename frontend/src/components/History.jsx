import React, { useContext, useEffect, useCallback, useState } from 'react';
import { TransactionContext } from '../context/transactionContext';
import { formatCurrency } from '../utils';
import { useApiCache } from '../hooks/useApiCache';
import '../css/history.css';
import { debounce } from 'lodash';
import { FaTimes, FaChevronDown, FaChevronRight } from 'react-icons/fa';

const API_URL = 'https://expense-trackor-backend.vercel.app/api';

const History = ({ handleDeleteTransaction }) => {
  const { transaction, setTransaction, selectedCurrency, exchangeRate } =
    useContext(TransactionContext);

  const { fetchData, invalidateCache, loading } = useApiCache();
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Array of month names
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Set the latest month as expanded by default
  useEffect(() => {
    if (transaction && transaction.length > 0) {
      const latestMonth = `${transaction[0].year}-${transaction[0].month}`;
      setExpandedMonth(latestMonth);
    }
  }, [transaction]);

  const toggleMonth = (monthKey) => {
    setExpandedMonth(expandedMonth === monthKey ? null : monthKey);
  };

  // Memoize fetchExpense function
  const fetchExpense = useCallback(async () => {
    try {
      const data = await fetchData(`${API_URL}/expenses`);
      setTransaction(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }, [fetchData, setTransaction]);

  // Debounce delete operation
  const debouncedDeleteExpense = useCallback(
    debounce(async (expenseDate) => {
      if (isDeleting) return;

      try {
        setIsDeleting(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/expenses/${expenseDate}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete expense');
        }

        // Invalidate the expenses cache
        invalidateCache(`${process.env.REACT_APP_API_URL}/expenses`);
        await fetchExpense();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }, 500),
    [fetchExpense, isDeleting, invalidateCache]
  );

  // Fetch expenses only once on mount and set up polling
  useEffect(() => {
    fetchExpense();

    // Poll for updates every minute
    const pollInterval = setInterval(fetchExpense, 60000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [fetchExpense]);

  return (
    <div className="card history-card">
      <h2 className="history-title">Monthly Expenses</h2>
      {loading ? (
        <div className="expense-loading">Loading expenses...</div>
      ) : transaction.length > 0 ? (
        <div className="month-list">
          {transaction?.map((item, index) => {
            const monthKey = `${item.year}-${item.month}`;
            const isExpanded = expandedMonth === monthKey;

            return (
              <div
                key={monthKey}
                className={`month-section ${isExpanded ? 'expanded' : ''}`}
              >
                <button
                  className="month-header"
                  onClick={() => toggleMonth(monthKey)}
                >
                  <div className="month-header-content">
                    <span className="month-icon">
                      {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                    <h3 className="month-title">
                      {monthNames[item.month - 1]}, {item.year}
                    </h3>
                  </div>
                  <span className="month-total">
                    {formatCurrency(selectedCurrency, exchangeRate, item.total)}
                  </span>
                </button>

                {isExpanded && (
                  <ul className="expense-list">
                    {item.expenses?.map((exp, index) => (
                      <li key={index} className="expense-item">
                        <div className="expense-details">
                          <p className="expense-purpose">{exp.purpose}</p>
                          <p className="expense-amount">
                            {formatCurrency(
                              selectedCurrency,
                              exchangeRate,
                              exp.amount
                            )}
                          </p>
                          <span className="expense-date">
                            {new Date(exp.expenseDate).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          className="btn btn-danger delete-btn"
                          onClick={() =>
                            debouncedDeleteExpense(exp.expenseDate)
                          }
                          disabled={isDeleting}
                          title="Delete expense"
                        >
                          <FaTimes />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="empty-state">No expenses added yet</p>
      )}
    </div>
  );
};

export default History;
