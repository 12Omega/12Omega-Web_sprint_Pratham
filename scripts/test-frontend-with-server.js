#!/usr/bin/env node

/**
 * Frontend Test Runner with Server Management
 * Handles frontend server startup and testing
 */

import { spawn, exec } from 'child_process';
import axios from 'axios';
import { promisify } from 'util';

const execAsync = promisify(exec);

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkFrontendServer() {
  try {
    const response = await axios.get('http://localhost:3000', { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

async function checkBackendServer() {
  try {
    const response = await axios.get('http://localhost:5002/api/health', { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

async function runFrontendTests() {
  try {
    log('🧪 Running frontend tests...', 'blue');
    await execAsync('npm run test:frontend');
    return true;
  } catch (error) {
    log('❌ Frontend tests failed', 'red');
    return false;
  }
}

async function main() {
  log('🚀 Frontend Test Runner with Server Check', 'blue');
  log('=' .repeat(45), 'blue');
  
  // Check backend server
  log('\n📡 Checking backend server...', 'blue');
  const backendRunning = await checkBackendServer();
  
  if (!backendRunning) {
    log('❌ Backend server is not running on port 5002', 'red');
    log('💡 Please start the backend server first:', 'yellow');
    log('   npm run server', 'yellow');
    log('   or', 'yellow');
    log('   npm run dev (in another terminal)', 'yellow');
    process.exit(1);
  }
  
  log('✅ Backend server is running', 'green');
  
  // Check frontend server
  log('\n🌐 Checking frontend server...', 'blue');
  const frontendRunning = await checkFrontendServer();
  
  if (!frontendRunning) {
    log('❌ Frontend server is not running on port 3000', 'red');
    log('\n💡 Frontend server options:', 'yellow');
    log('1. Start frontend server in another terminal:', 'yellow');
    log('   npm run client', 'yellow');
    log('2. Start both servers together:', 'yellow');
    log('   npm run dev', 'yellow');
    log('3. Run tests without frontend (API only):', 'yellow');
    log('   npm run test:api', 'yellow');
    
    log('\n⏳ Waiting 30 seconds for you to start the frontend server...', 'yellow');
    log('   (Press Ctrl+C to cancel)', 'yellow');
    
    // Wait for frontend server to start
    for (let i = 30; i > 0; i--) {
      process.stdout.write(`\r⏳ Waiting ${i} seconds... `);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (await checkFrontendServer()) {
        log('\n✅ Frontend server detected!', 'green');
        break;
      }
      
      if (i === 1) {
        log('\n❌ Frontend server still not available', 'red');
        log('Running tests anyway (they will show connection errors)', 'yellow');
      }
    }
  } else {
    log('✅ Frontend server is running', 'green');
  }
  
  // Run the tests
  log('\n🧪 Running frontend tests...', 'blue');
  const success = await runFrontendTests();
  
  // Summary
  log('\n' + '='.repeat(45), 'blue');
  log('📊 FRONTEND TEST SUMMARY', 'blue');
  log('='.repeat(45), 'blue');
  
  if (success) {
    log('🎉 Frontend tests completed!', 'green');
  } else {
    log('💥 Some frontend tests failed', 'red');
  }
  
  log('\n💡 Tips for better frontend testing:', 'yellow');
  log('• Keep both servers running: npm run dev', 'yellow');
  log('• Check browser console for frontend errors', 'yellow');
  log('• Verify API proxy configuration in vite.config.js', 'yellow');
  
  process.exit(success ? 0 : 1);
}

main().catch(error => {
  log(`💥 Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});