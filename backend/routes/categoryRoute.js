const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

// get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add new category
router.post('/', async (req, res) => {
  const category = new Category({
    title: req.body.title,
  });
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
