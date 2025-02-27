import { Router } from 'express';
import Balance from '../models/Balance.js';
import { addBalance, getBalance } from '../controllers/balanceController.js';

const router = Router();

// get balance
router.get('/', getBalance);

// add balance
router.post('/', addBalance);

export default router;
