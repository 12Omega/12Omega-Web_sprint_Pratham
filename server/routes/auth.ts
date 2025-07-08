import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User'; // Assuming IUser is the correct interface for the user object

interface AuthenticatedRequest extends Request {
  user?: IUser; // Stricter typing for req.user
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    // IMPORTANT: Fallback JWT secret is a security risk for production. 
    // Ensure JWT_SECRET is properly set in your environment variables.
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_fallback_for_dev_only';

    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      return res.status(403).json({ message: 'Invalid token payload' });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err: any) { // Explicitly type caught error
    console.error('Authentication error:', err.message); // Optional: log error
    return res.status(403).json({ message: 'Invalid or expired token' }); // More generic message for client
  }
};
