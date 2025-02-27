import { getBalance, getExpenses } from '../apis';

export const formatCurrency = (currency, exchangeRate, amount, show = true) => {
  if (show) {
    return `${currency} ${(amount * exchangeRate).toFixed(0)}`;
  } else {
    return ` ${(amount * exchangeRate).toFixed(0)}`;
  }
};

export const fetchBalance = async (setSelectedCurrency, setIncome) => {
  try {
    const data = await getBalance();
    data.forEach((item) => {
      setSelectedCurrency(item.currency);
      setIncome(item.balanceAmount);
    });
  } catch (err) {
    console.error('Error fetching balance:', err);
  }
};

export const fetchExpense = async (setLoading, setExpense) => {
  try {
    setLoading(true);
    const data = await getExpenses();
    const totalExpenses = data.reduce((acc, curr) => acc + curr.total, 0);

    setExpense(totalExpenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
  } finally {
    setLoading(false);
  }
};
