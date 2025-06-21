import express from 'express';
import jwt from 'jsonwebtoken';
// Changed User import to default import
import User from '../models/User'; 
// Removed .js from auth import, assuming auth.ts is the source
import { authenticateToken, AuthRequest } from '../middleware/auth'; 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Assuming User model has comparePassword and lastLogin (and other fields like firstName etc.)
    // You might need to ensure your User model schema in User.js includes these
    // and that User type from import User from '../models/User' correctly infers them.
    // If not, you might need to explicitly type `user` e.g. user: any or a more specific Mongoose type.
    const isMatch = await (user as any).comparePassword(password); 
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    (user as any).lastLogin = new Date();
    await (user as any).save();

    const token = jwt.sign(
      { userId: (user as any)._id, email: (user as any).email, role: (user as any).role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: (user as any)._id,
        firstName: (user as any).firstName,
        lastName: (user as any).lastName,
        email: (user as any).email,
        role: (user as any).role,
        avatar: (user as any).avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role = 'user' } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role
      // avatar will be undefined here unless provided in req.body or set by default in schema
    });

    await (user as any).save();

    const token = jwt.sign(
      { userId: (user as any)._id, email: (user as any).email, role: (user as any).role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: (user as any)._id,
        firstName: (user as any).firstName,
        lastName: (user as any).lastName,
        email: (user as any).email,
        role: (user as any).role,
        avatar: (user as any).avatar // This might be undefined if not set during registration
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Add a check for req.user to satisfy TypeScript
    if (!req.user) {
      // This case should ideally be handled by authenticateToken if token is invalid or user not found
      return res.status(401).json({ message: 'Authentication failed, user not found.' });
    }

    // Now TypeScript knows req.user is defined here
    res.json({
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;