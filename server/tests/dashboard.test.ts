import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../index';
import User from '../models/User';
import Booking from '../models/Booking';
import ParkingSpot from '../models/ParkingSpot';

// Mock data
const mockUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedpassword',
  role: 'user'
};

const mockAdminUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'hashedpassword',
  role: 'admin'
};

// Mock JWT token generation
const generateToken = (user: any) => {
  return jwt.sign(
    { 
      user: {
        id: user._id,
        role: user.role
      }
    },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '1h' }
  );
};

describe('Dashboard API', () => {
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/parkease_test';
    
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    await mongoose.connect(mongoUri);

    // Clear test database
    await User.deleteMany({});
    await Booking.deleteMany({});
    await ParkingSpot.deleteMany({});

    // Create test users
    await User.create(mockUser);
    await User.create(mockAdminUser);

    // Generate tokens
    userToken = generateToken(mockUser);
    adminToken = generateToken(mockAdminUser);

    // Create test data
    // Parking spots
    await ParkingSpot.create([
      { 
        spotNumber: 'A1', 
        status: 'available', 
        type: 'standard', 
        hourlyRate: 5,
        location: 'Downtown Parking',
        address: '123 Main St',
        coordinates: { latitude: 27.7172, longitude: 85.3240 }
      },
      { 
        spotNumber: 'A2', 
        status: 'occupied', 
        type: 'standard', 
        hourlyRate: 5,
        location: 'Downtown Parking',
        address: '123 Main St',
        coordinates: { latitude: 27.7173, longitude: 85.3241 }
      },
      { 
        spotNumber: 'A3', 
        status: 'maintenance', 
        type: 'standard', 
        hourlyRate: 7.5,
        location: 'Downtown Parking',
        address: '123 Main St',
        coordinates: { latitude: 27.7174, longitude: 85.3242 }
      },
      { 
        spotNumber: 'A4', 
        status: 'available', 
        type: 'compact', 
        hourlyRate: 4,
        location: 'Downtown Parking',
        address: '123 Main St',
        coordinates: { latitude: 27.7175, longitude: 85.3243 }
      }
    ]);

    // Bookings
    const now = new Date();
    const activeStart = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago
    const activeEnd = new Date(now.getTime() + 90 * 60 * 1000); // 90 minutes from now
    
    const completedStart = new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago
    const completedEnd = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago

    await Booking.create([
      {
        user: mockUser._id,
        parkingSpot: new mongoose.Types.ObjectId(),
        startTime: activeStart,
        endTime: activeEnd,
        duration: 2,
        status: 'active',
        totalCost: 15,
        vehicleInfo: { licensePlate: 'ABC123' }
      },
      {
        user: mockAdminUser._id,
        parkingSpot: new mongoose.Types.ObjectId(),
        startTime: completedStart,
        endTime: completedEnd,
        duration: 2,
        status: 'completed',
        totalCost: 10,
        vehicleInfo: { licensePlate: 'XYZ789' }
      }
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/dashboard', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/api/dashboard');
      expect(response.status).toBe(401);
    });

    it('should return dashboard data for regular user', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('activeSessionsToday');
      expect(response.body).toHaveProperty('parkingSpots');
      expect(response.body.parkingSpots).toHaveProperty('available');
      expect(response.body.parkingSpots).toHaveProperty('occupied');
      
      // Regular users should not see admin-only data
      expect(response.body.totalUsers).toBe(0);
    });

    it('should return full dashboard data for admin user', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body).toHaveProperty('activeSessionsToday');
      expect(response.body).toHaveProperty('recentUsersChange');
      expect(response.body).toHaveProperty('sessionActivity');
      expect(response.body).toHaveProperty('userGrowth');
      expect(response.body).toHaveProperty('parkingSpots');
      expect(response.body).toHaveProperty('recentBookings');
      expect(response.body).toHaveProperty('earningsData');
      
      // Admin should see all users
      expect(response.body.totalUsers).toBe(2);
    });
  });
});