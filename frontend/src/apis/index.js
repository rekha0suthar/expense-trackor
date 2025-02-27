import axios from 'axios';

const API = axios.create({
  baseURL: 'https://expense-trackor-backend.vercel.app/api',
});

export const addExpense = async (data) => {
  const response = await API.post('/expenses', data);
  return response.data;
};

export const getExpenses = async () => {
  const response = await API.get('/expenses');
  return response.data;
};

export const deleteExpenses = async () => {
  const response = await API.delete('/expenses');
  return response.data;
};

export const addCategory = async (data) => {
  const response = await API.post('/category', data);
  return response.data;
};

export const getCategories = async () => {
  const response = await API.get('/category');
  return response.data;
};

export const addBalance = async (data) => {
  const response = await API.post('/balance', data);
  return response.data;
};

export const getBalance = async () => {
  const response = await API.get('/balance');
  return response.data;
};
