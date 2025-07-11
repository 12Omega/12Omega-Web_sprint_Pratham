#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Smart Parking API Server Startup Script');
console.log('==========================================\n');

// Check if we're in the right directory
const currentDir = process.cwd();
console.log(`📁 Current directory: ${currentDir}`);

// Check for package.json
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found');
  console.error('💡 Please run this script from the project root directory');
  process.exit(1);
}

// Check for server directory
if (!fs.existsSync('server')) {
  console.error('❌ Error: server directory not found');
  console.error('💡 Please ensure the server directory exists');
  process.exit(1);
}

// Check for server/.env
const envPath = path.join('server', '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: server/.env file not found');
  console.error('💡 Please create server/.env with MongoDB connection string');
  console.error('📝 Example content:');
  console.error('   MONGO_URI=mongodb://localhost:27017/omega-db');
  console.error('   JWT_SECRET=your-secret-key');
  console.error('   PORT=5000');
  process.exit(1);
}

// Read and validate .env
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasMongoUri = envContent.includes('MONGO_URI=');
  const hasJwtSecret = envContent.includes('JWT_SECRET=');
  
  if (!hasMongoUri) {
    console.error('❌ Error: MONGO_URI not found in .env file');
    console.error('💡 Add: MONGO_URI=mongodb://localhost:27017/omega-db');
    process.exit(1);
  }
  
  if (!hasJwtSecret) {
    console.error('❌ Error: JWT_SECRET not found in .env file');
    console.error('💡 Add: JWT_SECRET=your-secret-key');
    process.exit(1);
  }
  
  console.log('✅ Environment file validated');
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  process.exit(1);
}

// Check for node_modules
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  const installProcess = spawn('npm', ['install'], { stdio: 'inherit' });
  
  installProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencies installed successfully');
      startServer();
    } else {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  console.log('✅ Dependencies already installed');
  startServer();
}

function startServer() {
  console.log('\n🚀 Starting the server...\n');
  
  const serverProcess = spawn('npm', ['run', 'server'], { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  serverProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Server stopped gracefully');
    } else {
      console.error(`\n❌ Server exited with code ${code}`);
    }
  });
  
  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    console.error('💡 Make sure npm and node are installed');
  });
  
  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    serverProcess.kill('SIGINT');
  });
}

// Display helpful information
setTimeout(() => {
  console.log('\n🌐 Once the server starts, you can test these endpoints:');
  console.log('📊 Health Check: http://localhost:5000/health');
  console.log('🔐 Auth: http://localhost:5000/api/auth');
  console.log('📖 See POSTMAN_TEST_GUIDE.md for complete testing examples');
  console.log('\n💡 Press Ctrl+C to stop the server');
}, 2000);