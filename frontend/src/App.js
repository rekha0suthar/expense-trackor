import { useContext } from 'react';
import './App.css';
import AddExpense from './components/AddExpense';
import { TransactionContext } from './context/transactionContext';
import History from './components/History';
import Balance from './components/Balance';
import Spinner from './assets/loading.gif';

function App() {
  const {
    setIncome,
    setExpense,
    setBalance,
    amount,
    setAmount,
    use,
    setUse,
    transaction,
    setTransaction,
    loading,
  } = useContext(TransactionContext);

  const handleTransaction = () => {
    const parsedAmount = parseFloat(amount);

    // Add the new transaction
    setTransaction([
      ...transaction,
      { id: Date.now(), use, amount: parsedAmount },
    ]);

    // Update income, expense, and balance
    if (parsedAmount >= 0) {
      setIncome((prevIncome) => prevIncome + parsedAmount);
    } else {
      setExpense((prevExpense) => prevExpense + parsedAmount);
    }

    // Calculate the balance
    setBalance((prevBalance) => prevBalance + parsedAmount);
    setUse('');
    setAmount(0);
  };

  const handleDeleteTransaction = (itemId) => {
    const newTransaction = transaction.filter((item) => item.id !== itemId);
    setTransaction(newTransaction);
  };

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      {loading ? (
        <div className="spinner">
          {' '}
          <img src={Spinner} alt="loading" />
        </div>
      ) : (
        <div className="container">
          <div className="first">
            <Balance />
            <AddExpense handleTransaction={handleTransaction} />
          </div>
          <div className="second">
            {' '}
            <History handleDeleteTransaction={handleDeleteTransaction} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
