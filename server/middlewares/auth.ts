/**
 * Authentication Middleware - JWT token verification and user authorization
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Verify JWT token and authenticate user
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided or invalid format',
        links: [
          { rel: 'login', href: '/api/auth/login' },
          { rel: 'register', href: '/api/auth/register' }
        ]
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    
    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'User not found',
        links: [
          { rel: 'register', href: '/api/auth/register' }
        ]
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token verification failed',
        links: [
          { rel: 'login', href: '/api/auth/login' }
        ]
      });
    }
    
    return res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error during authentication'
    });
  }
};

/**
 * Check if user has admin role
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please authenticate first'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access forbidden',
      message: 'Admin privileges required',
      links: [
        { rel: 'profile', href: '/api/auth/profile' }
      ]
    });
  }

  next();
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.id);
    
    if (user) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};