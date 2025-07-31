/**
 * Booking Routes - CRUD operations for parking spot bookings
 */

import express from 'express';
import { bookingController } from '../controllers/bookingController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validateBooking, validatePagination, validateObjectId } from '../middlewares/validation';

const router = express.Router();

/**
 * @route   GET /api/bookings
 * @desc    Get user's bookings or all bookings (admin)
 * @access  Private
 */
router.get('/', authenticate, validatePagination, bookingController.getBookings);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking by ID
 * @access  Private
 */
router.get('/:id', authenticate, validateObjectId('id'), bookingController.getBookingById);

/**
 * @route   POST /api/bookings
 * @desc    Create new booking
 * @access  Private
 */
router.post('/', authenticate, validateBooking, bookingController.createBooking);

/**
 * @route   PUT /api/bookings/:id
 * @desc    Update booking
 * @access  Private
 */
router.put('/:id', authenticate, validateObjectId('id'), bookingController.updateBooking);

/**
 * @route   PATCH /api/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private
 */
router.patch('/:id/cancel', authenticate, validateObjectId('id'), bookingController.cancelBooking);

/**
 * @route   PATCH /api/bookings/:id/complete
 * @desc    Complete booking
 * @access  Private
 */
router.patch('/:id/complete', authenticate, validateObjectId('id'), bookingController.completeBooking);

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Delete booking (admin only)
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, validateObjectId('id'), bookingController.deleteBooking);

/**
 * @route   GET /api/bookings/spot/:spotId
 * @desc    Get bookings for a specific spot
 * @access  Private (Admin only)
 */
router.get('/spot/:spotId', authenticate, requireAdmin, validateObjectId('spotId'), bookingController.getSpotBookings);

export default router;