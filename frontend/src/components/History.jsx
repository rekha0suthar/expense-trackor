import React, { useContext, useEffect } from 'react';
import { TransactionContext } from '../context/transactionContext';

const History = ({ handleDeleteTransaction }) => {
  const { transaction, setTransaction } = useContext(TransactionContext);
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

  // function to get all expenses
  const fetchExpense = async () => {
    const response = await fetch('http://localhost:5000/api/expenses'); // Updated URL to match your aggregation endpoint
    const data = await response.json();
    setTransaction(data);
  };

  // function to delete expense
  const deleteExpense = async (expenseDate) => {
    try {
      await fetch(`http://localhost:5000/api/expenses/${expenseDate}`, {
        method: 'DELETE',
      });
      fetchExpense();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchExpense = async () => {
      const response = await fetch('http://localhost:5000/api/expenses'); // Updated URL to match your aggregation endpoint
      const data = await response.json();
      setTransaction(data);
    };
    fetchExpense();
  }, [setTransaction]);

  return (
    <div>
      <h2>History</h2>
      {transaction.length > 0 ? (
        transaction?.map((item, index) => (
          <div key={index}>
            <div className="month-header">
              <h3>
                {monthNames[item.month - 1]}, {item.year}
              </h3>
              <strong>{`Total:  ₹${item.total}`}</strong>{' '}
            </div>
            <ul>
              {item.expenses?.map((exp) => (
                <li key={exp.id}>
                  <span>
                    <p>
                      <strong>Purpose:</strong> {exp.purpose}
                    </p>
                    <p>
                      <strong>Amount:</strong>{' '}
                      <strong>
                        ₹{Math.abs(exp.amount)}{' '}
                        {/* Display absolute value for expenses */}
                      </strong>
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
        <p className="dummy">No Transaction added</p>
      )}
    </div>
  );
};

export default History;
