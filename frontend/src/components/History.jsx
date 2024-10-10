import React, { useContext, useEffect } from 'react';
import { TransactionContext } from '../context/transactionContext';
import { formatCurrency } from '../utils';
import '../css/history.css';
const History = ({ handleDeleteTransaction }) => {
  const {
    transaction,
    setTransaction,
    loading,
    setLoading,
    selectedCurrency,
    exchangeRate,
  } = useContext(TransactionContext);
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

  // Fetch all expenses
  const fetchExpense = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/expenses`); // Update with your deployed URL in production
      const data = await response.json();
      setTransaction(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  // function to delete expense
  const deleteExpense = async (expenseDate) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/expenses/${expenseDate}`, {
        method: 'DELETE',
      });
      fetchExpense();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch all expenses
    const fetchExpense = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/expenses`
        ); // Update with your deployed URL in production
        const data = await response.json();
        setTransaction(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [setTransaction, setLoading]);

  return (
    <div>
      <h2>Monthly Expenses</h2>
      {transaction.length > 0 && !loading ? (
        transaction?.map((item, index) => (
          <div key={index}>
            <div className="month-header">
              <h3>
                {monthNames[item.month - 1]}, {item.year}
              </h3>
              <strong>{`Total:  ${formatCurrency(
                selectedCurrency,
                exchangeRate,
                item.total
              )}`}</strong>{' '}
            </div>
            <ul>
              {item.expenses?.map((exp, index) => (
                <li key={index}>
                  <span>
                    <p>
                      <strong>Purpose:</strong> {exp.purpose}
                    </p>
                    <p>
                      <strong>Amount:</strong>{' '}
                      {formatCurrency(
                        selectedCurrency,
                        exchangeRate,
                        exp.amount
                      )}{' '}
                      {/* Display absolute value for expenses */}
                    </p>
                  </span>
                  <button
                    className="del-btn"
                    onClick={() => deleteExpense(exp.expenseDate)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
            {/* Display total for the month */}
          </div>
        ))
      ) : (
        <p className="dummy">No Expenses added</p>
      )}
    </div>
  );
};

export default History;
