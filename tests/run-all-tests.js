#!/usr/bin/env node

/**
 * ParkEase Test Runner
 * Runs all test suites in organized manner
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 ParkEase Test Suite Runner');
console.log('================================\n');

// Test directories
const testDirs = {
  api: 'tests/api',
  frontend: 'tests/frontend', 
  integration: 'tests/integration'
};

// Colors for console output
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

function runTestsInDirectory(dirName, dirPath) {
  log(`\n📁 Running ${dirName.toUpperCase()} Tests`, 'blue');
  log('─'.repeat(40), 'blue');
  
  if (!fs.existsSync(dirPath)) {
    log(`❌ Directory ${dirPath} not found`, 'red');
    return false;
  }
  
  const testFiles = fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.js'))
    .sort();
  
  if (testFiles.length === 0) {
    log(`⚠️  No test files found in ${dirPath}`, 'yellow');
    return true;
  }
  
  let allPassed = true;
  
  testFiles.forEach(file => {
    const filePath = path.join(dirPath, file);
    log(`\n🧪 Running: ${file}`, 'yellow');
    
    try {
      execSync(`node ${filePath}`, { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      log(`✅ ${file} - PASSED`, 'green');
    } catch (error) {
      log(`❌ ${file} - FAILED`, 'red');
      allPassed = false;
    }
  });
  
  return allPassed;
}

function runAllTests() {
  const startTime = Date.now();
  let overallSuccess = true;
  
  // Run tests in each directory
  for (const [dirName, dirPath] of Object.entries(testDirs)) {
    const success = runTestsInDirectory(dirName, dirPath);
    if (!success) {
      overallSuccess = false;
    }
  }
  
  // Summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  log('\n' + '='.repeat(50), 'blue');
  log('📊 TEST SUMMARY', 'blue');
  log('='.repeat(50), 'blue');
  
  if (overallSuccess) {
    log(`🎉 All tests completed successfully!`, 'green');
  } else {
    log(`💥 Some tests failed. Check output above.`, 'red');
  }
  
  log(`⏱️  Total execution time: ${duration}s`, 'yellow');
  log(`📁 Test directories: ${Object.keys(testDirs).length}`, 'yellow');
  
  // Count total test files
  let totalFiles = 0;
  Object.values(testDirs).forEach(dirPath => {
    if (fs.existsSync(dirPath)) {
      totalFiles += fs.readdirSync(dirPath).filter(f => f.endsWith('.js')).length;
    }
  });
  log(`📄 Total test files: ${totalFiles}`, 'yellow');
  
  return overallSuccess;
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  // Run all tests
  const success = runAllTests();
  process.exit(success ? 0 : 1);
} else if (args[0] === '--help' || args[0] === '-h') {
  console.log(`
Usage: node run-all-tests.js [options]

Options:
  --help, -h     Show this help message
  --api          Run only API tests
  --frontend     Run only frontend tests  
  --integration  Run only integration tests
  --list         List all available test files

Examples:
  node run-all-tests.js              # Run all tests
  node run-all-tests.js --api        # Run only API tests
  node run-all-tests.js --frontend   # Run only frontend tests
  `);
} else if (args[0] === '--list') {
  log('📋 Available Test Files:', 'blue');
  Object.entries(testDirs).forEach(([dirName, dirPath]) => {
    log(`\n${dirName.toUpperCase()}:`, 'yellow');
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.js'));
      files.forEach(file => log(`  • ${file}`, 'green'));
    } else {
      log(`  Directory not found: ${dirPath}`, 'red');
    }
  });
} else if (testDirs[args[0].replace('--', '')]) {
  // Run specific test directory
  const dirName = args[0].replace('--', '');
  const success = runTestsInDirectory(dirName, testDirs[dirName]);
  process.exit(success ? 0 : 1);
} else {
  log(`❌ Unknown option: ${args[0]}`, 'red');
  log('Use --help for usage information', 'yellow');
  process.exit(1);
}