#!/usr/bin/env node

/**
 * Test Runner with Proper Server Setup
 * Ensures servers are running before executing tests
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

async function checkServerHealth(url, name) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    log(`✅ ${name} is running`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${name} is not responding`, 'red');
    return false;
  }
}

async function waitForServer(url, name, maxAttempts = 30) {
  log(`⏳ Waiting for ${name} to start...`, 'yellow');
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(url, { timeout: 2000 });
      log(`✅ ${name} is ready!`, 'green');
      return true;
    } catch (error) {
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  log(`❌ ${name} failed to start within timeout`, 'red');
  return false;
}

async function seedDatabase() {
  try {
    log('🌱 Seeding database...', 'blue');
    await execAsync('npm run seed');
    log('✅ Database seeded successfully', 'green');
    return true;
  } catch (error) {
    log('⚠️ Database seeding failed, continuing with tests...', 'yellow');
    log(`Error: ${error.message}`, 'red');
    return false;
  }
}

async function runTests(testType = 'all') {
  try {
    log(`🧪 Running ${testType} tests...`, 'blue');
    
    const command = testType === 'all' 
      ? 'npm run test:all'
      : `npm run test:${testType}`;
      
    await execAsync(command);
    log('✅ Tests completed successfully', 'green');
    return true;
  } catch (error) {
    log('❌ Some tests failed', 'red');
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const testType = args[0] || 'all';
  
  log('🚀 ParkEase Test Runner with Server Setup', 'blue');
  log('=' .repeat(50), 'blue');
  
  // Step 1: Check if backend server is running
  log('\n📡 Checking server status...', 'blue');
  const backendRunning = await checkServerHealth('http://localhost:5002/api/health', 'Backend Server');
  
  if (!backendRunning) {
    log('\n💡 Backend server is not running. Please start it first:', 'yellow');
    log('   npm run server', 'yellow');
    log('   or', 'yellow');
    log('   npm run dev', 'yellow');
    process.exit(1);
  }
  
  // Step 2: Check if frontend server is running (for frontend tests)
  if (testType === 'frontend' || testType === 'all') {
    const frontendRunning = await checkServerHealth('http://localhost:3000', 'Frontend Server');
    
    if (!frontendRunning) {
      log('\n💡 Frontend server is not running. Frontend tests will be skipped.', 'yellow');
      log('   To run frontend tests, start the frontend server:', 'yellow');
      log('   npm run client', 'yellow');
      log('   or', 'yellow');
      log('   npm run dev', 'yellow');
    }
  }
  
  // Step 3: Seed database
  await seedDatabase();
  
  // Step 4: Run tests
  log('\n🧪 Starting test execution...', 'blue');
  const success = await runTests(testType);
  
  // Step 5: Summary
  log('\n' + '='.repeat(50), 'blue');
  log('📊 TEST EXECUTION SUMMARY', 'blue');
  log('='.repeat(50), 'blue');
  
  if (success) {
    log('🎉 All tests completed!', 'green');
  } else {
    log('💥 Some tests failed. Check output above for details.', 'red');
  }
  
  log('\n💡 Tips for better test results:', 'yellow');
  log('• Make sure both servers are running: npm run dev', 'yellow');
  log('• Seed the database before testing: npm run seed', 'yellow');
  log('• Check server logs for any errors', 'yellow');
  
  process.exit(success ? 0 : 1);
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node test-with-proper-setup.js [test-type]

Test Types:
  all          Run all tests (default)
  api          Run only API tests
  frontend     Run only frontend tests
  integration  Run only integration tests

Examples:
  node test-with-proper-setup.js          # Run all tests
  node test-with-proper-setup.js api      # Run only API tests
  node test-with-proper-setup.js frontend # Run only frontend tests
  `);
  process.exit(0);
}

main().catch(error => {
  log(`💥 Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});