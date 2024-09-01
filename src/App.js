import { useContext } from 'react';
import './App.css';
import AddTransaction from './components/AddTransaction';
import { TransactionContext } from './context/transactionContext';
import History from './components/History';
import Balance from './components/Balance';

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
      <div className="container">
        <div className="first">
          <Balance />
          <History handleDeleteTransaction={handleDeleteTransaction} />
        </div>
        <div className="second">
          {' '}
          <AddTransaction handleTransaction={handleTransaction} />
        </div>
      </div>
    </div>
  );
}

export default App;
