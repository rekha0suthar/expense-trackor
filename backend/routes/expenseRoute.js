const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$expenseDate' },
            month: { $month: '$expenseDate' },
          },
          expenses: {
            $push: {
              purpose: '$purpose',
              amount: '$amount',
              expenseDate: '$expenseDate',
            },
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          month: '$_id.month',
          year: '$_id.year',
          expenses: 1,
          total: 1,
          _id: 0,
        },
      },
      { $sort: { year: 1, month: 1 } }, // Sort by year and month
    ]);

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new expense
router.post('/', async (req, res) => {
  const expense = new Expense({
    purpose: req.body.purpose,
    amount: req.body.amount,
    expenseDate: req.body.expenseDate,
  });
  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete expense
router.delete('/:expenseDate', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      expenseDate: new Date(req.params.expenseDate),
    });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
