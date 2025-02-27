import { useContext } from 'react';
import AddExpense from './components/AddExpense';
import { TransactionContext } from './context/transactionContext';
import History from './components/History';
import Balance from './components/Balance';
import Spinner from './components/Spinner';
import './css/common.css';

function App() {
  const { loading } = useContext(TransactionContext);

  return (
    <div className="app-container">
      <h1 className="app-title">Expense Tracker</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-column">
            <Balance />
            <AddExpense />
          </div>
          <div className="dashboard-column">
            <History />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
