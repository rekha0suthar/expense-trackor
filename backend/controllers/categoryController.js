import Category from '../models/Category.js';
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCategory = async (req, res) => {
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
};

export { getCategories, addCategory };
