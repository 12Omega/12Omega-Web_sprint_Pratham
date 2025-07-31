/**
 * Input Validation Middleware using express-validator
 */

import { body, query, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? (error as any).path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? (error as any).value : undefined
    }));

    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input data',
      details: errorMessages,
      links: [
        { rel: 'api-docs', href: '/api/health' }
      ]
    });
  }
  
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid phone number'),
  
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Parking spot validation rules
export const validateParkingSpot = [
  body('spotNumber')
    .trim()
    .notEmpty()
    .withMessage('Spot number is required')
    .isLength({ min: 1, max: 20 })
    .withMessage('Spot number must be between 1 and 20 characters'),
  
  body('location')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Location must be between 3 and 100 characters'),
  
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  
  body('coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  body('type')
    .isIn(['standard', 'compact', 'handicap', 'electric'])
    .withMessage('Type must be one of: standard, compact, handicap, electric'),
  
  body('hourlyRate')
    .isFloat({ min: 0 })
    .withMessage('Hourly rate must be a positive number'),
  
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  handleValidationErrors
];

// Booking validation rules
export const validateBooking = [
  body('parkingSpot')
    .isMongoId()
    .withMessage('Invalid parking spot ID'),
  
  body('startTime')
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date')
    .custom((value) => {
      const startTime = new Date(value);
      const now = new Date();
      if (startTime <= now) {
        throw new Error('Start time must be in the future');
      }
      return true;
    }),
  
  body('endTime')
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      const endTime = new Date(value);
      const startTime = new Date(req.body.startTime);
      if (endTime <= startTime) {
        throw new Error('End time must be after start time');
      }
      
      const diffHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      if (diffHours < 0.5) {
        throw new Error('Minimum booking duration is 30 minutes');
      }
      if (diffHours > 24) {
        throw new Error('Maximum booking duration is 24 hours');
      }
      
      return true;
    }),
  
  body('vehicleInfo.licensePlate')
    .trim()
    .notEmpty()
    .withMessage('License plate is required')
    .isLength({ min: 2, max: 15 })
    .withMessage('License plate must be between 2 and 15 characters'),
  
  body('vehicleInfo.make')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Vehicle make cannot exceed 50 characters'),
  
  body('vehicleInfo.model')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Vehicle model cannot exceed 50 characters'),
  
  body('vehicleInfo.color')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Vehicle color cannot exceed 30 characters'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  
  handleValidationErrors
];

// Query parameter validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

export const validateSpotFilters = [
  query('type')
    .optional()
    .isIn(['standard', 'compact', 'handicap', 'electric'])
    .withMessage('Type must be one of: standard, compact, handicap, electric'),
  
  query('status')
    .optional()
    .isIn(['available', 'occupied', 'reserved', 'maintenance'])
    .withMessage('Status must be one of: available, occupied, reserved, maintenance'),
  
  query('minRate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum rate must be a positive number'),
  
  query('maxRate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum rate must be a positive number'),
  
  query('location')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Location filter cannot be empty'),
  
  handleValidationErrors
];

// MongoDB ObjectId validation
export const validateObjectId = (paramName: string) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} ID`),
  
  handleValidationErrors
];