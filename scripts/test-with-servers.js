#!/usr/bin/env node

/**
 * Test Runner with Server Management
 * Starts servers, runs tests, then stops servers
 */

import { spawn, execSync } from 'child_process';
import { setTimeout } from 'timers/promises';

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

async function waitForServer(url, maxAttempts = 30) {
  const axios = (await import('axios')).default;
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(url, { timeout: 2000 });
      return true;
    } catch (error) {
      await setTimeout(1000);
    }
  }
  return false;
}

async function runTestsWithServers() {
  let serverProcess = null;
  
  try {
    log('🚀 Starting ParkEase Test Suite with Server Management', 'blue');
    log('=' .repeat(60), 'blue');
    
    // Start the development servers
    log('\n📡 Starting development servers...', 'yellow');
    serverProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true
    });
    
    // Wait for servers to be ready
    log('⏳ Waiting for backend server (port 5002)...', 'yellow');
    const backendReady = await waitForServer('http://localhost:5002/api/health');
    
    if (!backendReady) {
      log('❌ Backend server failed to start on port 5002', 'red');
      log('💡 Make sure port 5002 is available and check server logs', 'yellow');
    } else {
      log('✅ Backend server is ready!', 'green');
    }
    
    log('⏳ Waiting for frontend server (port 3000)...', 'yellow');
    const frontendReady = await waitForServer('http://localhost:3000');
    
    if (!frontendReady) {
      log('❌ Frontend server failed to start on port 3000', 'red');
      log('💡 Make sure port 3000 is available', 'yellow');
    } else {
      log('✅ Frontend server is ready!', 'green');
    }
    
    if (!backendReady && !frontendReady) {
      log('\n💥 Both servers failed to start. Exiting...', 'red');
      return false;
    }
    
    // Run the tests
    log('\n🧪 Running test suite...', 'blue');
    log('-'.repeat(40), 'blue');
    
    try {
      execSync('node tests/run-all-tests.js', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      log('\n🎉 Tests completed!', 'green');
      return true;
    } catch (error) {
      log('\n💥 Tests failed!', 'red');
      return false;
    }
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    return false;
  } finally {
    // Clean up: stop the servers
    if (serverProcess) {
      log('\n🛑 Stopping development servers...', 'yellow');
      serverProcess.kill('SIGTERM');
      
      // Give it a moment to clean up
      await setTimeout(2000);
      
      // Force kill if still running
      try {
        serverProcess.kill('SIGKILL');
      } catch (e) {
        // Process already terminated
      }
      
      log('✅ Servers stopped', 'green');
    }
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🧪 ParkEase Test Runner with Server Management

Usage: node scripts/test-with-servers.js [options]

This script will:
1. Start the development servers (backend + frontend)
2. Wait for them to be ready
3. Run the test suite
4. Stop the servers when done

Options:
  --help, -h     Show this help message

Examples:
  node scripts/test-with-servers.js    # Run all tests with servers
  npm run test:with-servers            # If you add this to package.json

Note: Make sure no other processes are using ports 3000 and 5002
  `);
  process.exit(0);
}

// Run the tests
const success = await runTestsWithServers();
process.exit(success ? 0 : 1);