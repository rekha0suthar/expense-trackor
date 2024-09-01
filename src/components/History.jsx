import React, { useContext } from 'react';
import { TransactionContext } from '../context/transactionContext';

const History = ({ handleDeleteTransaction }) => {
  const { transaction } = useContext(TransactionContext);
  return (
    <div>
      <h2>History</h2>
      {transaction.length > 0 ? (
        <ul>
          {transaction.map((item) => (
            <li
              key={item.id}
              style={
                item.amount >= 0
                  ? { borderRight: '5px solid green' }
                  : { borderRight: '5px solid red' }
              }
            >
              <span>
                <p>
                  <strong>Purpose:</strong> {item.use}
                </p>

                <p>
                  <strong>Amount:</strong>{' '}
                  <strong
                    style={
                      item.amount >= 0 ? { color: 'green' } : { color: 'red' }
                    }
                  >
                    {' '}
                    ${Math.abs(item.amount)}
                  </strong>
                </p>
              </span>
              <button
                className="del-btn"
                onClick={() => handleDeleteTransaction(item.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="dummy">No Transaction added</p>
      )}
    </div>
  );
};

export default History;
