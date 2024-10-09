const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new category
router.post('/', async (req, res) => {
  const { title } = req.body;

  // Check if the category already exists
  const existingCategory = await Category.findOne({ title });
  if (existingCategory) {
    return res.status(400).json({ message: 'Category already exists' });
  }

  const category = new Category({
    title,
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
