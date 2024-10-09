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
  loading: false,
  setLoading: () => {},
  selectedCurrency: 'INR',
  setSelectedCurrency: () => {},
  exchangeRate: 1,
  setExchangeRate: () => {},
});

const TransactionProvider = ({ children }) => {
  const [income, setIncome] = useState(100000);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(100000);
  const [transaction, setTransaction] = useState([]);
  const [use, setUse] = useState('');
  const [amount, setAmount] = useState(0);
  const [expenseDate, setExpenseDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR'); // Default to INR
  const [exchangeRate, setExchangeRate] = useState(1);
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
        loading,
        setLoading,
        selectedCurrency,
        setSelectedCurrency,
        exchangeRate,
        setExchangeRate,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionContext, TransactionProvider };
