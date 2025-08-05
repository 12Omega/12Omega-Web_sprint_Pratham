const mongoose = require('mongoose');
const ParkingSpot = require('./models/ParkingSpot.js');
const User = require('./models/User.js');
require('dotenv').config();

const sampleSpots = [
  {
    spotNumber: 'A1',
    location: 'Level 1, Section A',
    address: '123 Main St, Downtown',
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    type: 'standard',
    status: 'available',
    hourlyRate: 7.5,
    features: ['covered', 'security'],
    description: 'Convenient spot near elevator'
  },
  {
    spotNumber: 'A2',
    location: 'Level 1, Section A',
    address: '123 Main St, Downtown',
    coordinates: { latitude: 40.7129, longitude: -74.0061 },
    type: 'compact',
    status: 'available',
    hourlyRate: 6.0,
    features: ['covered'],
    description: 'Compact car spot'
  },
  {
    spotNumber: 'B1',
    location: 'Level 2, Section B',
    address: '123 Main St, Downtown',
    coordinates: { latitude: 40.7130, longitude: -74.0062 },
    type: 'standard',
    status: 'occupied',
    hourlyRate: 8.0,
    features: ['covered', 'security', 'electric'],
    description: 'Premium spot with EV charging'
  },
  {
    spotNumber: 'H1',
    location: 'Level 1, Section H',
    address: '123 Main St, Downtown',
    coordinates: { latitude: 40.7131, longitude: -74.0063 },
    type: 'handicap',
    status: 'available',
    hourlyRate: 5.0,
    features: ['handicap-accessible', 'covered'],
    description: 'Handicap accessible spot'
  },
  {
    spotNumber: 'C3',
    location: 'Level 3, Section C',
    address: '123 Main St, Downtown',
    coordinates: { latitude: 40.7132, longitude: -74.0064 },
    type: 'standard',
    status: 'available',
    hourlyRate: 7.0,
    features: ['covered'],
    description: 'Standard parking spot'
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@parkease.com',
    password: 'password123',
    role: 'admin',
    phone: '+1234567890'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1234567891'
  },
  {
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1234567892'
  },
  {
    name: 'Michael Johnson',
    email: 'michael@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1234567893'
  },
  {
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1234567894'
  },
  {
    name: 'David Wilson',
    email: 'david@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1234567895'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parkease');
    console.log('Connected to MongoDB');

    // Clear existing data
    await ParkingSpot.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample spots
    await ParkingSpot.insertMany(sampleSpots);
    console.log('Inserted sample parking spots');

    // Insert sample users
    await User.insertMany(sampleUsers);
    console.log('Inserted sample users');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };