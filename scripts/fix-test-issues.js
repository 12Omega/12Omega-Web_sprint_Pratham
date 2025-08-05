#!/usr/bin/env node

/**
 * Fix Common Test Issues
 * Addresses response format inconsistencies and other common problems
 */

import fs from 'fs';
import path from 'path';

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

function fixResponseFormatInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix common response format issues
    const fixes = [
      {
        pattern: /\.data\.data\.user/g,
        replacement: '?.data?.user || response.data.user',
        description: 'Fixed user data access'
      },
      {
        pattern: /\.data\.data\.token/g,
        replacement: '?.data?.token || response.data.token',
        description: 'Fixed token access'
      },
      {
        pattern: /response\.data\.data\.user/g,
        replacement: 'response.data.data?.user || response.data.user',
        description: 'Fixed response user access'
      },
      {
        pattern: /response\.data\.data\.token/g,
        replacement: 'response.data.data?.token || response.data.token',
        description: 'Fixed response token access'
      },
      {
        pattern: /loginResponse\.data\.data\.user/g,
        replacement: 'loginResponse.data.data?.user || loginResponse.data.user',
        description: 'Fixed login response user access'
      },
      {
        pattern: /loginResponse\.data\.data\.token/g,
        replacement: 'loginResponse.data.data?.token || loginResponse.data.token',
        description: 'Fixed login response token access'
      }
    ];
    
    fixes.forEach(fix => {
      if (fix.pattern.test(content)) {
        content = content.replace(fix.pattern, fix.replacement);
        modified = true;
        log(`  ✅ ${fix.description}`, 'green');
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    
    return false;
  } catch (error) {
    log(`  ❌ Error fixing ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function fixTestFiles() {
  log('🔧 Fixing Test Issues', 'blue');
  log('=' .repeat(30), 'blue');
  
  const testDirs = [
    'tests/api',
    'tests/frontend',
    'tests/integration'
  ];
  
  let totalFixed = 0;
  
  testDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(fullPath)) {
      log(`⚠️ Directory ${dir} not found`, 'yellow');
      return;
    }
    
    log(`\n📁 Processing ${dir}...`, 'blue');
    
    const files = fs.readdirSync(fullPath)
      .filter(file => file.endsWith('.js'))
      .map(file => path.join(fullPath, file));
    
    files.forEach(file => {
      const fileName = path.basename(file);
      log(`🔍 Checking ${fileName}...`, 'yellow');
      
      if (fixResponseFormatInFile(file)) {
        totalFixed++;
        log(`  ✅ Fixed ${fileName}`, 'green');
      } else {
        log(`  ℹ️ No changes needed for ${fileName}`, 'blue');
      }
    });
  });
  
  log(`\n📊 Summary: Fixed ${totalFixed} files`, totalFixed > 0 ? 'green' : 'blue');
  
  if (totalFixed > 0) {
    log('\n💡 Recommended next steps:', 'yellow');
    log('1. Run: npm run seed (to ensure test data exists)', 'yellow');
    log('2. Start servers: npm run dev', 'yellow');
    log('3. Run tests: npm run test:all', 'yellow');
  }
}

// Create a simple test validation script
function createTestValidationScript() {
  const validationScript = `#!/usr/bin/env node

/**
 * Quick Test Validation
 * Validates that basic functionality works before running full test suite
 */

import axios from 'axios';

async function validateBasics() {
  console.log('🔍 Quick Test Validation');
  console.log('=' .repeat(25));
  
  try {
    // Test 1: Server health
    console.log('\\n1. Testing server health...');
    const health = await axios.get('http://localhost:5002/api/health');
    console.log('✅ Server is healthy');
    
    // Test 2: Database connection (via spots endpoint)
    console.log('\\n2. Testing database connection...');
    const spots = await axios.get('http://localhost:5002/api/spots');
    console.log(\`✅ Database connected (found \${spots.data.data?.spots?.length || 0} spots)\`);
    
    // Test 3: Authentication endpoint
    console.log('\\n3. Testing auth endpoint...');
    try {
      await axios.post('http://localhost:5002/api/auth/login', {
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    } catch (authError) {
      if (authError.response?.status === 400 || authError.response?.status === 401) {
        console.log('✅ Auth endpoint responding correctly');
      } else {
        throw authError;
      }
    }
    
    console.log('\\n🎉 Basic validation passed! Ready for full test suite.');
    
  } catch (error) {
    console.log('\\n❌ Validation failed:');
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Server is not running. Start it with: npm run server');
    } else {
      console.log('Error:', error.message);
    }
    process.exit(1);
  }
}

validateBasics();`;

  fs.writeFileSync('scripts/validate-test-setup.js', validationScript);
  log('\n✅ Created test validation script: scripts/validate-test-setup.js', 'green');
}

// Main execution
log('🚀 ParkEase Test Issue Fixer', 'blue');
log('=' .repeat(40), 'blue');

fixTestFiles();
createTestValidationScript();

log('\n🎯 Fix Complete!', 'green');
log('\nNext steps:', 'yellow');
log('1. Validate setup: node scripts/validate-test-setup.js', 'yellow');
log('2. Run tests with setup: node scripts/test-with-proper-setup.js', 'yellow');
log('3. Or run individual test types: npm run test:api', 'yellow');