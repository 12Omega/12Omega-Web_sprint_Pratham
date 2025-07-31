import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   GET /api/dashboard
 * @desc    Get dashboard statistics and data
 * @access  Private
 */
router.get('/', authenticate, getDashboardStats);

export default router;