import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User'; // Changed import style and removed .js

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define a basic User interface
interface IUser {
  _id: string;
  username: string; // Kept from your provided version. Remove if not in User model.
  email: string;
  firstName?: string; // Added - ensure this is in your User model
  lastName?: string;  // Added - ensure this is in your User model
  avatar?: string;    // Added - ensure this is in your User model
  role?: string;
}

interface DecodedToken extends JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const userDoc = await User.findById(decoded.userId).select('-password');

    if (!userDoc) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Ensure that the userDoc actually contains firstName, lastName, avatar if you expect them
    req.user = userDoc.toObject ? userDoc.toObject() as IUser : userDoc as unknown as IUser;
    next();
  } catch (_error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};