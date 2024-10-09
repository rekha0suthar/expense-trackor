const express = require('express');
const Balance = require('../models/Balance');
const router = express.Router();

// get all categories
router.get('/', async (req, res) => {
  try {
    const balance = await Balance.find();
    res.json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add new category
router.post('/', async (req, res) => {
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
});

module.exports = router;
