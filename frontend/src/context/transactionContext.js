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
  expenseDate: null,
  setExpenseDate: () => {},
  isEditing: false,
  setIsEditing: () => {},
  category: '',
  setCategory: () => {},
  categories: [],
  setCategories: () => {},
});

const TransactionProvider = ({ children }) => {
  const [income, setIncome] = useState(100000);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transaction, setTransaction] = useState([]);
  const [use, setUse] = useState('');
  const [amount, setAmount] = useState(0);
  const [expenseDate, setExpenseDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

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
        expenseDate,
        setExpenseDate,
        isEditing,
        setIsEditing,
        category,
        setCategory,
        categories,
        setCategories,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionContext, TransactionProvider };
