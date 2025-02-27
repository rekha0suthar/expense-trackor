import { Router } from 'express';
import Category from '../models/Category.js';
import {
  addCategory,
  getCategories,
} from '../controllers/categoryController.js';

const router = Router();

// Get all categories
router.get('/', getCategories);

// Add new category
router.post('/', addCategory);

export default router;
