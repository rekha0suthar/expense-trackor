import { Router } from 'express';
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
