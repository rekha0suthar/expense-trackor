import { createContext, useState } from 'react';

const TransactionContext = createContext({
  income: 0,
  setIncome: () => {},
  expense: 0,
  setExpense: () => {},
  balance: 0,
  setBalance: () => {},
  amount: 0,
  setAmount: () => {},
  use: '',
  setUse: () => {},
  transaction: [],
  setTransaction: () => {},
});

const TransactionProvider = ({ children }) => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transaction, setTransaction] = useState([]);
  const [use, setUse] = useState('');
  const [amount, setAmount] = useState(0);
  return (
    <TransactionContext.Provider
      value={{
        income,
        setIncome,
        expense,
        setExpense,
        balance,
        setBalance,
        amount,
        setAmount,
        use,
        setUse,
        transaction,
        setTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionContext, TransactionProvider };
