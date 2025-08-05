#!/usr/bin/env node

/**
 * Setup validation script
 * Checks if the project is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking project setup...\n');

const checks = [
  {
    name: 'Node.js version',
    check: () => {
      const version = process.version;
      const major = parseInt(version.slice(1).split('.')[0]);
      return major >= 18;
    },
    fix: 'Please install Node.js v18 or higher from https://nodejs.org/'
  },
  {
    name: '.env file exists',
    check: () => fs.existsSync('.env'),
    fix: 'Run: cp .env.example .env'
  },
  {
    name: 'node_modules exists',
    check: () => fs.existsSync('node_modules'),
    fix: 'Run: npm install'
  },
  {
    name: 'MongoDB URI configured',
    check: () => {
      if (!fs.existsSync('.env')) return false;
      const env = fs.readFileSync('.env', 'utf8');
      return env.includes('MONGODB_URI=');
    },
    fix: 'Add MONGODB_URI=mongodb://localhost:27017/parkease to your .env file'
  }
];

let allPassed = true;

checks.forEach(({ name, check, fix }) => {
  const passed = check();
  console.log(`${passed ? '✅' : '❌'} ${name}`);
  
  if (!passed) {
    console.log(`   💡 ${fix}\n`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\n🎉 All checks passed! You can now run:');
  console.log('   npm run seed  - Populate database');
  console.log('   npm run dev   - Start the application');
} else {
  console.log('\n⚠️  Please fix the issues above before continuing.');
}

console.log('\n📚 For detailed setup instructions, see INSTALLATION.md');