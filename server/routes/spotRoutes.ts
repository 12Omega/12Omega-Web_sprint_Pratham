/**
 * Parking Spot Routes - CRUD operations for parking spots
 */

import express from 'express';
import { spotController } from '../controllers/spotController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validateParkingSpot, validatePagination, validateSpotFilters, validateObjectId } from '../middlewares/validation';

const router = express.Router();

/**
 * @route   GET /api/spots
 * @desc    Get all parking spots with filtering, sorting, and pagination
 * @access  Public
 */
router.get('/', validatePagination, validateSpotFilters, spotController.getAllSpots);

/**
 * @route   GET /api/spots/:id
 * @desc    Get single parking spot by ID
 * @access  Public
 */
router.get('/:id', validateObjectId('id'), spotController.getSpotById);

/**
 * @route   POST /api/spots
 * @desc    Create new parking spot
 * @access  Private (Admin only)
 */
router.post('/', authenticate, requireAdmin, validateParkingSpot, spotController.createSpot);

/**
 * @route   PUT /api/spots/:id
 * @desc    Update parking spot
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, requireAdmin, validateObjectId('id'), validateParkingSpot, spotController.updateSpot);

/**
 * @route   PATCH /api/spots/:id/status
 * @desc    Update parking spot status
 * @access  Private (Admin only)
 */
router.patch('/:id/status', authenticate, requireAdmin, validateObjectId('id'), spotController.updateSpotStatus);

/**
 * @route   DELETE /api/spots/:id
 * @desc    Delete parking spot
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, validateObjectId('id'), spotController.deleteSpot);

/**
 * @route   GET /api/spots/nearby/:lat/:lng
 * @desc    Get nearby parking spots
 * @access  Public
 */
router.get('/nearby/:lat/:lng', spotController.getNearbySpots);

export default router;