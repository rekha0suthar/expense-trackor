import Expense from '../models/Expense.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      {
        $sort: { expenseDate: -1 }, // Sort all expenses by date descending first
      },
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
          latestDate: { $first: '$expenseDate' }, // Add this to sort months
        },
      },
      {
        $project: {
          month: '$_id.month',
          year: '$_id.year',
          expenses: 1,
          total: 1,
          latestDate: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          year: -1,
          month: -1,
          latestDate: -1,
        },
      },
    ]);

    // Sort expenses within each month by date in descending order
    expenses.forEach((month) => {
      month.expenses.sort(
        (a, b) => new Date(b.expenseDate) - new Date(a.expenseDate)
      );
      delete month.latestDate; // Remove the helper field before sending response
    });

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const addExpense = async (req, res) => {
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
};

export const deleteExpense = async (req, res) => {
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
};
