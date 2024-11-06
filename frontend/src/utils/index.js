export const formatCurrency = (currency, exchangeRate, amount, show = true) => {
  if (show) {
    return `${currency} ${(amount * exchangeRate).toFixed(0)}`;
  } else {
    return ` ${(amount * exchangeRate).toFixed(0)}`;
  }
};

export const fetchBalance = async (setSelectedCurrency, setIncome) => {
  try {
    const response = await fetch('http://localhost:5001/api/balance');
    const data = await response.json();
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
    const response = await fetch('http://localhost:5001/api/expenses');
    const data = await response.json();
    const totalExpenses = data.reduce((acc, curr) => acc + curr.total, 0);

    setExpense(totalExpenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
  } finally {
    setLoading(false);
  }
};

export const addExpense = async (newExpense) => {
  // Post the new expense to the server
  await fetch('http://localhost:5001/api/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newExpense),
  });
};
