import { Router } from 'express';
import Expense, { aggregate, findOneAndDelete } from '../models/Expense.js';
import {
  addExpense,
  deleteExpense,
  getExpenses,
} from '../controllers/expenseController.js';

const router = Router();

// Get all expenses
router.get('/', getExpenses);

// Add new expense
router.post('/', addExpense);

// Delete expense
router.delete('/:expenseDate', deleteExpense);

export default router;
