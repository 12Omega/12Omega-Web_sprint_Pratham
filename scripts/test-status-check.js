#!/usr/bin/env node

/**
 * Comprehensive Test Status Checker
 * Provides complete overview of test environment and recommendations
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkService(url, name, timeout = 5000) {
  try {
    const response = await axios.get(url, { timeout });
    return { status: 'running', response: response.data };
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return { status: 'not_running', error: 'Connection refused' };
    } else if (error.code === 'ETIMEDOUT') {
      return { status: 'timeout', error: 'Request timeout' };
    } else {
      return { status: 'error', error: error.message };
    }
  }
}

function countTestFiles() {
  const testDirs = ['tests/api', 'tests/frontend', 'tests/integration'];
  let counts = { total: 0, api: 0, frontend: 0, integration: 0 };
  
  testDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.js'));
      const dirName = dir.split('/')[1];
      counts[dirName] = files.length;
      counts.total += files.length;
    }
  });
  
  return counts;
}

function checkDatabaseSeeding() {
  // Check if seed script exists
  const seedScript = path.join(process.cwd(), 'server/scripts/seedDatabase.ts');
  return fs.existsSync(seedScript);
}

async function main() {
  log('🔍 ParkEase Test Environment Status Check', 'cyan');
  log('=' .repeat(50), 'cyan');
  
  // 1. Check Backend Server
  log('\n📡 Backend Server Status', 'blue');
  log('-'.repeat(25), 'blue');
  const backend = await checkService('http://localhost:5002/api/health', 'Backend');
  
  if (backend.status === 'running') {
    log('✅ Backend server is running on port 5002', 'green');
    log(`   Message: ${backend.response.message}`, 'green');
    if (backend.response.links) {
      log(`   Available endpoints: ${backend.response.links.length}`, 'green');
    }
  } else {
    log('❌ Backend server is not running', 'red');
    log(`   Error: ${backend.error}`, 'red');
  }
  
  // 2. Check Frontend Server
  log('\n🌐 Frontend Server Status', 'blue');
  log('-'.repeat(25), 'blue');
  const frontend = await checkService('http://localhost:3000', 'Frontend');
  
  if (frontend.status === 'running') {
    log('✅ Frontend server is running on port 3000', 'green');
  } else {
    log('❌ Frontend server is not running', 'red');
    log(`   Error: ${frontend.error}`, 'red');
  }
  
  // 3. Check Database Connection (via spots endpoint)
  log('\n🗄️  Database Status', 'blue');
  log('-'.repeat(18), 'blue');
  if (backend.status === 'running') {
    const spots = await checkService('http://localhost:5002/api/spots', 'Database');
    if (spots.status === 'running') {
      const spotsCount = spots.response.data?.spots?.length || 0;
      log(`✅ Database connected with ${spotsCount} spots`, 'green');
    } else {
      log('❌ Database connection issue', 'red');
      log(`   Error: ${spots.error}`, 'red');
    }
  } else {
    log('⚠️ Cannot check database (backend not running)', 'yellow');
  }
  
  // 4. Check Test Files
  log('\n📁 Test Files Overview', 'blue');
  log('-'.repeat(20), 'blue');
  const testCounts = countTestFiles();
  log(`📊 Total test files: ${testCounts.total}`, 'cyan');
  log(`   • API tests: ${testCounts.api}`, 'cyan');
  log(`   • Frontend tests: ${testCounts.frontend}`, 'cyan');
  log(`   • Integration tests: ${testCounts.integration}`, 'cyan');
  
  // 5. Check Seeding Capability
  log('\n🌱 Database Seeding', 'blue');
  log('-'.repeat(17), 'blue');
  const canSeed = checkDatabaseSeeding();
  if (canSeed) {
    log('✅ Seed script available', 'green');
    log('   Run: npm run seed', 'green');
  } else {
    log('⚠️ Seed script not found', 'yellow');
  }
  
  // 6. Recommendations
  log('\n💡 Recommendations', 'yellow');
  log('-'.repeat(16), 'yellow');
  
  if (backend.status !== 'running') {
    log('🔧 Start backend server:', 'yellow');
    log('   npm run server', 'yellow');
  }
  
  if (frontend.status !== 'running') {
    log('🔧 Start frontend server:', 'yellow');
    log('   npm run client', 'yellow');
    log('   or start both: npm run dev', 'yellow');
  }
  
  if (backend.status === 'running' && frontend.status === 'running') {
    log('🎯 Ready for full testing:', 'green');
    log('   npm run test:all', 'green');
  } else if (backend.status === 'running') {
    log('🎯 Ready for API testing:', 'green');
    log('   npm run test:api', 'green');
  }
  
  // 7. Quick Test Commands
  log('\n🚀 Quick Test Commands', 'cyan');
  log('-'.repeat(20), 'cyan');
  log('• Validate setup: npm run test:validate', 'cyan');
  log('• Fix test issues: npm run test:fix', 'cyan');
  log('• API tests only: npm run test:api', 'cyan');
  log('• Frontend tests: npm run test:frontend', 'cyan');
  log('• All tests: npm run test:all', 'cyan');
  
  // 8. Status Summary
  log('\n📊 Status Summary', 'blue');
  log('-'.repeat(15), 'blue');
  const backendIcon = backend.status === 'running' ? '✅' : '❌';
  const frontendIcon = frontend.status === 'running' ? '✅' : '❌';
  const readiness = backend.status === 'running' && frontend.status === 'running' ? 
    '🎉 FULLY READY' : backend.status === 'running' ? '⚠️ PARTIALLY READY' : '❌ NOT READY';
  
  log(`${backendIcon} Backend Server`, backend.status === 'running' ? 'green' : 'red');
  log(`${frontendIcon} Frontend Server`, frontend.status === 'running' ? 'green' : 'red');
  log(`${readiness}`, readiness.includes('🎉') ? 'green' : readiness.includes('⚠️') ? 'yellow' : 'red');
}

main().catch(error => {
  log(`💥 Status check failed: ${error.message}`, 'red');
  process.exit(1);
});