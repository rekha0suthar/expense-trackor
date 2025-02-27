import Balance from '../models/Balance.js';

const getBalance = async (req, res) => {
  try {
    const balance = await Balance.find();
    res.json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addBalance = async (req, res) => {
  const balance = new Balance({
    currency: req.body.currency,
    balanceAmount: req.body.balanceAmount,
  });
  try {
    const newBalance = await balance.save();
    res.status(201).json(newBalance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getBalance, addBalance };
