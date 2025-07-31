import express from 'express';
import { verifyKhaltiPayment, getPaymentHistory, getPaymentById, getPaymentReceipt, getPaymentAnalytics } from '../controllers/paymentController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   POST /api/payments/verify-khalti
 * @desc    Verify Khalti payment
 * @access  Private
 */
router.post('/verify-khalti', authenticate, verifyKhaltiPayment);

/**
 * @route   GET /api/payments
 * @desc    Get payment history
 * @access  Private
 */
router.get('/', authenticate, getPaymentHistory);

/**
 * @route   GET /api/payments/analytics
 * @desc    Get payment analytics
 * @access  Private (Admin)
 */
router.get('/analytics', authenticate, getPaymentAnalytics);

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment by ID
 * @access  Private
 */
router.get('/:id', authenticate, getPaymentById);

/**
 * @route   GET /api/payments/:id/receipt
 * @desc    Get payment receipt
 * @access  Private
 */
router.get('/:id/receipt', authenticate, getPaymentReceipt);

export default router;