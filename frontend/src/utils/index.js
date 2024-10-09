export const formatCurrency = (currency, exchangeRate, amount, show = true) => {
  if (show) {
    return `${currency} ${(amount * exchangeRate).toFixed(0)}`;
  } else {
    return ` ${(amount * exchangeRate).toFixed(0)}`;
  }
};
