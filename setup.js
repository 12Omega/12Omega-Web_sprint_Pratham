#!/usr/bin/env node

/**
 * Setup script for ParkEase Smart Parking System
 * This script helps new users set up the project quickly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up ParkEase Smart Parking System...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from .env.example...');
  try {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ .env file created successfully!\n');
  } catch (error) {
    console.log('❌ Error creating .env file:', error.message);
    console.log('Please manually copy .env.example to .env\n');
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Check if MongoDB is running
console.log('🔍 Checking MongoDB connection...');
try {
  const mongoose = require('mongoose');
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/parkease';
  
  mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log('✅ MongoDB connection successful!\n');
      mongoose.connection.close();
      
      // Seed the database
      console.log('🌱 Seeding database with sample data...');
      try {
        execSync('npm run seed', { stdio: 'inherit' });
        console.log('✅ Database seeded successfully!\n');
      } catch (error) {
        console.log('⚠️  Database seeding failed. You can run "npm run seed" manually later.\n');
      }
      
      console.log('🎉 Setup complete! You can now run:');
      console.log('   npm run dev    - Start the development server');
      console.log('   npm run client - Start only the frontend');
      console.log('   npm run server - Start only the backend\n');
      
      console.log('📧 Default login credentials:');
      console.log('   Admin: admin@parkease.com / password123');
      console.log('   User:  john@example.com / password123\n');
      
    })
    .catch((error) => {
      console.log('❌ MongoDB connection failed:', error.message);
      console.log('Please make sure MongoDB is running on your system.\n');
      
      console.log('💡 To start MongoDB:');
      console.log('   Windows: net start MongoDB');
      console.log('   macOS/Linux: sudo systemctl start mongod\n');
      
      console.log('After starting MongoDB, run: npm run seed\n');
    });
    
} catch (error) {
  console.log('⚠️  Could not check MongoDB connection. Make sure to:');
  console.log('1. Install and start MongoDB');
  console.log('2. Run: npm run seed');
  console.log('3. Run: npm run dev\n');
}