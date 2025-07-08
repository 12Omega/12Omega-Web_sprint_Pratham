import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User'; // Assuming IUser is the correct interface for the user object

interface AuthenticatedRequest extends Request {
  user?: IUser | any; // Use IUser if it fits, otherwise any for flexibility
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
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';

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
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
