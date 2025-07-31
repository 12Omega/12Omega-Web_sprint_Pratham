/**
 * Database Seeder Script
 * Populates the MongoDB database with dummy data for development and testing
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import ParkingSpot from '../models/ParkingSpot';
import Booking from '../models/Booking';
import Payment from '../models/Payment';

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
const clearDatabase = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('Cannot run seed script in production environment');
    process.exit(1);
  }
  
  try {
    await User.deleteMany({});
    console.log('Users collection cleared');
    
    await ParkingSpot.deleteMany({});
    console.log('ParkingSpots collection cleared');
    
    await Booking.deleteMany({});
    console.log('Bookings collection cleared');
    
    await Payment.deleteMany({});
    console.log('Payments collection cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

// Seed Users
const seedUsers = async () => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        name: 'Admin User',
        email: 'admin@parkease.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+9779876543210',
        createdAt: new Date('2024-01-01')
      },
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '+9779876543211',
        createdAt: new Date('2024-01-15')
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '+9779876543212',
        createdAt: new Date('2024-02-01')
      },
      {
        name: 'Michael Brown',
        email: 'michael@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '+9779876543213',
        createdAt: new Date('2024-02-15')
      },
      {
        name: 'Emily Davis',
        email: 'emily@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '+9779876543214',
        createdAt: new Date('2024-03-01')
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '+9779876543215',
        createdAt: new Date('2024-03-15')
      }
    ];
    
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Seed Parking Spots
const seedParkingSpots = async () => {
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
        createdAt: new Date('2024-01-01')
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
        createdAt: new Date('2024-01-01')
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
        createdAt: new Date('2024-01-01')
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
        createdAt: new Date('2024-01-01')
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
        createdAt: new Date('2024-01-01')
      }
    ];
    
    const createdSpots = await ParkingSpot.insertMany(parkingSpots);
    console.log(`${createdSpots.length} parking spots created`);
    return createdSpots;
  } catch (error) {
    console.error('Error seeding parking spots:', error);
    process.exit(1);
  }
};

// Temporarily modify the Booking schema to remove the validation
const modifyBookingSchema = () => {
  // Get the schema
  const bookingSchema = Booking.schema;
  
  // Remove the validator from startTime
  const startTimePath = bookingSchema.path('startTime');
  if (startTimePath) {
    // @ts-ignore - Accessing internal properties
    startTimePath.validators = startTimePath.validators.filter(
      (validator: any) => !validator.message || !validator.message.includes('future')
    );
  }
  
  console.log('Modified Booking schema to remove startTime validation');
};

// Seed Bookings
const seedBookings = async (users: any[], parkingSpots: any[]) => {
  try {
    // Modify the schema before seeding
    modifyBookingSchema();
    
    const now = new Date();
    const bookings = [
      {
        user: users[1]._id, // John Smith
        parkingSpot: parkingSpots[0]._id, // Spot A1
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
        createdAt: new Date(now.getTime() - 7200000) // 2 hours ago
      },
      {
        user: users[2]._id, // Sarah Johnson
        parkingSpot: parkingSpots[1]._id, // Spot B3
        startTime: new Date(now.getTime() - 7200000), // 2 hours ago
        endTime: new Date(now.getTime() + 1800000), // 30 minutes from now
        duration: 2.5,
        totalCost: 18.75,
        status: 'active',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        vehicleInfo: {
          licensePlate: 'XYZ789',
          make: 'Honda',
          model: 'Civic',
          color: 'Red'
        },
        createdAt: new Date(now.getTime() - 10800000) // 3 hours ago
      },
      {
        user: users[3]._id, // Michael Brown
        parkingSpot: parkingSpots[2]._id, // Spot C2
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
        createdAt: new Date(now.getTime() - 86400000) // 1 day ago
      },
      {
        user: users[4]._id, // Emily Davis
        parkingSpot: parkingSpots[3]._id, // Spot A4
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
        createdAt: new Date(now.getTime() - 172800000) // 2 days ago
      },
      {
        user: users[5]._id, // David Wilson
        parkingSpot: parkingSpots[4]._id, // Spot D1
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
        createdAt: new Date(now.getTime() - 43200000) // 12 hours ago
      }
    ];
    
    // Add more historical bookings for dashboard data
    for (let i = 1; i <= 30; i++) {
      const randomUserIndex = Math.floor(Math.random() * users.length);
      const randomSpotIndex = Math.floor(Math.random() * parkingSpots.length);
      const daysAgo = i * 2; // Every 2 days
      
      // Create dates for historical bookings
      const createdAt = new Date(now.getTime() - (daysAgo * 86400000) - 10800000);
      const startTime = new Date(createdAt.getTime() + 86400000); // 1 day after creation
      const endTime = new Date(startTime.getTime() + 7200000); // 2 hours after start
      
      bookings.push({
        user: users[randomUserIndex]._id,
        parkingSpot: parkingSpots[randomSpotIndex]._id,
        startTime,
        endTime,
        duration: 2,
        totalCost: 15.00,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: i % 5 === 0 ? 'khalti' : i % 5 === 1 ? 'credit_card' : i % 5 === 2 ? 'debit_card' : i % 5 === 3 ? 'paypal' : 'cash',
        vehicleInfo: {
          licensePlate: `HIST${i}`,
          make: 'Various',
          model: 'Various',
          color: 'Various'
        },
        createdAt
      });
    }
    
    const createdBookings = await Booking.insertMany(bookings);
    console.log(`${createdBookings.length} bookings created`);
    return createdBookings;
  } catch (error) {
    console.error('Error seeding bookings:', error);
    process.exit(1);
  }
};

// Seed Payments
const seedPayments = async (users: any[], bookings: any[]) => {
  try {
    const payments = [];
    
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
          createdAt: booking.createdAt
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
          createdAt: booking.createdAt
        });
      }
    }
    
    const createdPayments = await Payment.insertMany(payments);
    console.log(`${createdPayments.length} payments created`);
    return createdPayments;
  } catch (error) {
    console.error('Error seeding payments:', error);
    process.exit(1);
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    const conn = await connectDB();
    
    console.log('Starting database seeding...');
    await clearDatabase();
    
    const users = await seedUsers();
    const parkingSpots = await seedParkingSpots();
    const bookings = await seedBookings(users, parkingSpots);
    const payments = await seedPayments(users, bookings);
    
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