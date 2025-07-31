/**
 * Database Direct Seeder Script
 * Populates the MongoDB database with dummy data using direct MongoDB operations
 * This bypasses Mongoose validation for seeding historical data
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parkease');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearDatabase = async (db: mongoose.Connection) => {
  if (process.env.NODE_ENV === 'production') {
    console.error('Cannot run seed script in production environment');
    process.exit(1);
  }
  
  try {
    await db.collection('users').deleteMany({});
    console.log('Users collection cleared');
    
    await db.collection('parkingspots').deleteMany({});
    console.log('ParkingSpots collection cleared');
    
    await db.collection('bookings').deleteMany({});
    console.log('Bookings collection cleared');
    
    await db.collection('payments').deleteMany({});
    console.log('Payments collection cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

// Seed Users
const seedUsers = async (db: mongoose.Connection) => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        name: 'Admin User',
        email: 'admin@parkease.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+9779876543210',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '+9779876543211',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '+9779876543212',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      },
      {
        name: 'Michael Brown',
        email: 'michael@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '+9779876543213',
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      },
      {
        name: 'Emily Davis',
        email: 'emily@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '+9779876543214',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '+9779876543215',
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15')
      }
    ];
    
    const result = await db.collection('users').insertMany(users);
    console.log(`${result.insertedCount} users created`);
    return result.insertedIds;
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Seed Parking Spots
const seedParkingSpots = async (db: mongoose.Connection) => {
  try {
    const parkingSpots = [
      {
        spotNumber: 'A1',
        location: 'Level 1, Section A',
        address: '123 Main Street, Kathmandu',
        coordinates: {
          latitude: 27.7172,
          longitude: 85.3240
        },
        type: 'standard',
        status: 'available',
        hourlyRate: 7.50,
        features: ['covered', 'camera_surveillance'],
        description: 'Standard parking spot near the entrance',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        spotNumber: 'B3',
        location: 'Level 2, Section B',
        address: '123 Main Street, Kathmandu',
        coordinates: {
          latitude: 27.7172,
          longitude: 85.3241
        },
        type: 'compact',
        status: 'occupied',
        hourlyRate: 6.00,
        features: ['covered'],
        description: 'Compact parking spot for small vehicles',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        spotNumber: 'C2',
        location: 'Level 1, Section C',
        address: '123 Main Street, Kathmandu',
        coordinates: {
          latitude: 27.7173,
          longitude: 85.3240
        },
        type: 'handicap',
        status: 'available',
        hourlyRate: 7.50,
        features: ['covered', 'camera_surveillance', 'handicap_accessible'],
        description: 'Handicap accessible parking spot',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        spotNumber: 'A4',
        location: 'Level 1, Section A',
        address: '123 Main Street, Kathmandu',
        coordinates: {
          latitude: 27.7174,
          longitude: 85.3240
        },
        type: 'standard',
        status: 'occupied',
        hourlyRate: 7.50,
        features: ['covered', 'camera_surveillance'],
        description: 'Standard parking spot',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        spotNumber: 'D1',
        location: 'Level 3, Section D',
        address: '123 Main Street, Kathmandu',
        coordinates: {
          latitude: 27.7175,
          longitude: 85.3240
        },
        type: 'electric',
        status: 'maintenance',
        hourlyRate: 9.00,
        features: ['covered', 'camera_surveillance', 'ev_charging'],
        description: 'Electric vehicle charging spot',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];
    
    const result = await db.collection('parkingspots').insertMany(parkingSpots);
    console.log(`${result.insertedCount} parking spots created`);
    return result.insertedIds;
  } catch (error) {
    console.error('Error seeding parking spots:', error);
    process.exit(1);
  }
};

// Seed Bookings
const seedBookings = async (db: mongoose.Connection, userIds: any, spotIds: any) => {
  try {
    const now = new Date();
    const bookings = [
      {
        user: new mongoose.Types.ObjectId(userIds[1]),
        parkingSpot: new mongoose.Types.ObjectId(spotIds[0]),
        startTime: new Date(now.getTime() - 3600000), // 1 hour ago
        endTime: new Date(now.getTime() + 3600000), // 1 hour from now
        duration: 2,
        totalCost: 15.00,
        status: 'active',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        vehicleInfo: {
          licensePlate: 'ABC123',
          make: 'Toyota',
          model: 'Camry',
          color: 'Blue'
        },
        createdAt: new Date(now.getTime() - 7200000), // 2 hours ago
        updatedAt: new Date(now.getTime() - 7200000)
      },
      {
        user: new mongoose.Types.ObjectId(userIds[2]),
        parkingSpot: new mongoose.Types.ObjectId(spotIds[1]),
        startTime: new Date(now.getTime() - 7200000), // 2 hours ago
        endTime: new Date(now.getTime() + 1800000), // 30 minutes from now
        duration: 2.5,
        totalCost: 18.75,
        status: 'active',
        paymentStatus: 'paid',
        paymentMethod: 'khalti',
        vehicleInfo: {
          licensePlate: 'XYZ789',
          make: 'Honda',
          model: 'Civic',
          color: 'Red'
        },
        createdAt: new Date(now.getTime() - 10800000), // 3 hours ago
        updatedAt: new Date(now.getTime() - 10800000)
      },
      {
        user: new mongoose.Types.ObjectId(userIds[3]),
        parkingSpot: new mongoose.Types.ObjectId(spotIds[2]),
        startTime: new Date(now.getTime() + 86400000), // 1 day from now
        endTime: new Date(now.getTime() + 93600000), // 1 day + 2 hours from now
        duration: 2,
        totalCost: 15.00,
        status: 'active',
        paymentStatus: 'pending',
        paymentMethod: 'khalti',
        vehicleInfo: {
          licensePlate: 'DEF456',
          make: 'Ford',
          model: 'Focus',
          color: 'White'
        },
        createdAt: new Date(now.getTime() - 86400000), // 1 day ago
        updatedAt: new Date(now.getTime() - 86400000)
      },
      {
        user: new mongoose.Types.ObjectId(userIds[4]),
        parkingSpot: new mongoose.Types.ObjectId(spotIds[3]),
        startTime: new Date(now.getTime() - 10800000), // 3 hours ago
        endTime: new Date(now.getTime() - 3600000), // 1 hour ago
        duration: 2,
        totalCost: 15.00,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        vehicleInfo: {
          licensePlate: 'GHI789',
          make: 'Nissan',
          model: 'Altima',
          color: 'Black'
        },
        createdAt: new Date(now.getTime() - 172800000), // 2 days ago
        updatedAt: new Date(now.getTime() - 172800000)
      },
      {
        user: new mongoose.Types.ObjectId(userIds[5]),
        parkingSpot: new mongoose.Types.ObjectId(spotIds[4]),
        startTime: new Date(now.getTime() + 172800000), // 2 days from now
        endTime: new Date(now.getTime() + 180000000), // 2 days + 2 hours from now
        duration: 2,
        totalCost: 15.00,
        status: 'active',
        paymentStatus: 'pending',
        paymentMethod: 'khalti',
        vehicleInfo: {
          licensePlate: 'JKL123',
          make: 'Hyundai',
          model: 'Elantra',
          color: 'Silver'
        },
        createdAt: new Date(now.getTime() - 43200000), // 12 hours ago
        updatedAt: new Date(now.getTime() - 43200000)
      }
    ];
    
    // Add more historical bookings for dashboard data
    for (let i = 1; i <= 30; i++) {
      const randomUserIndex = Math.floor(Math.random() * 6) + 1;
      const randomSpotIndex = Math.floor(Math.random() * 5);
      const daysAgo = i * 2; // Every 2 days
      
      // Create dates for historical bookings
      const createdAt = new Date(now.getTime() - (daysAgo * 86400000) - 10800000);
      const startTime = new Date(createdAt.getTime() + 86400000); // 1 day after creation
      const endTime = new Date(startTime.getTime() + 7200000); // 2 hours after start
      
      bookings.push({
        user: new mongoose.Types.ObjectId(userIds[randomUserIndex]),
        parkingSpot: new mongoose.Types.ObjectId(spotIds[randomSpotIndex]),
        startTime,
        endTime,
        duration: 2,
        totalCost: 15.00,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: i % 3 === 0 ? 'khalti' : i % 3 === 1 ? 'credit_card' : 'cash',
        vehicleInfo: {
          licensePlate: `HIST${i}`,
          make: 'Various',
          model: 'Various',
          color: 'Various'
        },
        createdAt,
        updatedAt: createdAt
      });
    }
    
    const result = await db.collection('bookings').insertMany(bookings);
    console.log(`${result.insertedCount} bookings created`);
    return result.insertedIds;
  } catch (error) {
    console.error('Error seeding bookings:', error);
    process.exit(1);
  }
};

// Seed Payments
const seedPayments = async (db: mongoose.Connection, userIds: any, bookingIds: any) => {
  try {
    const now = new Date();
    const payments = [];
    
    // Get all bookings
    const bookings = await db.collection('bookings').find().toArray();
    
    // Create payments for bookings with paid status
    for (const booking of bookings) {
      if (booking.paymentStatus === 'paid') {
        payments.push({
          user: booking.user,
          booking: booking._id,
          amount: booking.totalCost,
          method: booking.paymentMethod,
          status: 'completed',
          transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`,
          paymentDetails: {
            paymentId: `pid_${Math.random().toString(36).substring(2, 15)}`,
            paymentTime: booking.createdAt
          },
          createdAt: booking.createdAt,
          updatedAt: booking.createdAt
        });
      } else if (booking.paymentStatus === 'pending') {
        payments.push({
          user: booking.user,
          booking: booking._id,
          amount: booking.totalCost,
          method: booking.paymentMethod,
          status: 'pending',
          transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`,
          paymentDetails: {
            paymentId: `pid_${Math.random().toString(36).substring(2, 15)}`,
            paymentTime: booking.createdAt
          },
          createdAt: booking.createdAt,
          updatedAt: booking.createdAt
        });
      }
    }
    
    const result = await db.collection('payments').insertMany(payments);
    console.log(`${result.insertedCount} payments created`);
    return result.insertedIds;
  } catch (error) {
    console.error('Error seeding payments:', error);
    process.exit(1);
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    const conn = await connectDB();
    const db = conn.connection;
    
    console.log('Starting database seeding...');
    await clearDatabase(db);
    
    const userIds = await seedUsers(db);
    const spotIds = await seedParkingSpots(db);
    const bookingIds = await seedBookings(db, userIds, spotIds);
    const paymentIds = await seedPayments(db, userIds, bookingIds);
    
    console.log('Database seeding completed successfully!');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();