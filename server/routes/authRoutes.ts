import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs'; // Not directly needed here if using model methods
import { User, IUser } from '../models/User';
import mongoose from 'mongoose';

const router = express.Router();

interface RegisterRequestBody {
  username?: string;
  email?: string;
  password?: string;
}

router.post('/register', async (req: Request<{}, {}, RegisterRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }
    
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const field = existingUser.username === username ? 'username' : 'email';
      return res.status(409).json({ message: `User with this ${field} already exists.` });
    }

    // Password will be hashed by the pre-save hook in User model
    const newUser = new User({ username, email, password });
    await newUser.save();
    
    // Exclude password from the response
    const { password, ...userResponse } = newUser.toObject();

    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    // Log the actual error on the server for debugging
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Error registering user. Please try again later.' });
  }
});

interface LoginRequestBody {
    username?: string;
    password?: string;
}

router.post('/login', async (req: Request<{}, {}, LoginRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.isActive) {
        return res.status(403).json({ message: 'Account is inactive. Please contact support.' });
    }

    // Use the comparePassword method from the User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // IMPORTANT: Fallback JWT secret is a security risk for production. 
    // Ensure JWT_SECRET is properly set in your environment variables.
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_fallback_for_dev_only';
    
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Include role in JWT payload for easier role checks
      secret,
      { expiresIn: '1h' } // Consider making token expiration configurable
    );

    // Update lastLoginAt
    user.lastLoginAt = new Date();
    await user.save({ timestamps: false }); // Avoid updating updatedAt just for lastLoginAt

    // Prepare user object for response, excluding password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({ token, user: userResponse }); // Return more complete user object
  } catch (error: any) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Error logging in. Please try again later.' });
  }
});

// Get current authenticated user
import { authenticateToken } from '../middleware/auth'; // Assuming AuthenticatedRequest is also defined/exported there or define it here
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user?: IUser; // Make sure IUser is imported or defined appropriately
}

router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  // Exclude password from the response
  const { password, ...userWithoutPassword } = req.user.toObject ? req.user.toObject() : { ...req.user };
  res.status(200).json({ user: userWithoutPassword });
});

export default router;
