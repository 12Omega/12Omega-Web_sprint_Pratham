/**
 * ParkEase Web - Smart Parking Application
 * Main server entry point
 * @author ParkEase Team
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import spotRoutes from './routes/spotRoutes';
import bookingRoutes from './routes/bookingRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import paymentRoutes from './routes/paymentRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parkease');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/spots', spotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'ParkEase API is running',
    timestamp: new Date().toISOString(),
    links: [
      { rel: 'auth', href: '/api/auth' },
      { rel: 'spots', href: '/api/spots' },
      { rel: 'bookings', href: '/api/bookings' },
      { rel: 'dashboard', href: '/api/dashboard' },
      { rel: 'payments', href: '/api/payments' }
    ]
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    links: [
      { rel: 'api-docs', href: '/api/health' }
    ]
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚗 ParkEase Server running on port ${PORT}`);
    console.log(`📍 API Health: http://localhost:${PORT}/api/health`);
  });
};

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  startServer();
}

export default app;