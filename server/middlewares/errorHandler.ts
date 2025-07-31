import { Request, Response, NextFunction } from 'express';

/**
 * Async handler to wrap async route handlers
 * Eliminates need for try-catch blocks in route handlers
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Create a custom error with status code
 */
export const createError = (message: string, statusCode: number = 400) => {
  const error = new Error(message);
  (error as any).statusCode = statusCode;
  return error;
};

/**
 * Global error handling middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: messages.join(', ')
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate Key Error',
      message: 'A record with that value already exists'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'Authentication failed'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'Authentication token has expired'
    });
  }
  
  // Default server error
  res.status(err.statusCode || 500).json({
    error: err.name || 'Server Error',
    message: err.message || 'Something went wrong on the server'
  });
};