#!/usr/bin/env node

/**
 * TypeScript Configuration Fix Script
 * Ensures all TypeScript configuration files are properly set up
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 TypeScript Configuration Fix Script');
console.log('=====================================\n');

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

function checkAndCopyConfig(configFile) {
  const rootPath = path.join(path.dirname(__dirname), configFile);
  const configPath = path.join(path.dirname(__dirname), 'config', configFile);
  
  if (!fs.existsSync(rootPath) && fs.existsSync(configPath)) {
    try {
      fs.copyFileSync(configPath, rootPath);
      log(`✅ Copied ${configFile} from config/ to root`, 'green');
      return true;
    } catch (error) {
      log(`❌ Failed to copy ${configFile}: ${error.message}`, 'red');
      return false;
    }
  } else if (fs.existsSync(rootPath)) {
    log(`✅ ${configFile} already exists in root`, 'blue');
    return true;
  } else {
    log(`⚠️  ${configFile} not found in config/ directory`, 'yellow');
    return false;
  }
}

function validateTsConfig() {
  const tsconfigPath = path.join(path.dirname(__dirname), 'tsconfig.json');
  
  if (!fs.existsSync(tsconfigPath)) {
    log('❌ tsconfig.json not found in root directory', 'red');
    return false;
  }
  
  try {
    const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
    const tsconfig = JSON.parse(tsconfigContent);
    
    // Check if references exist
    if (tsconfig.references) {
      for (const ref of tsconfig.references) {
        const refPath = path.join(path.dirname(__dirname), ref.path);
        if (!fs.existsSync(refPath)) {
          log(`❌ Referenced config file not found: ${ref.path}`, 'red');
          return false;
        } else {
          log(`✅ Referenced config file exists: ${ref.path}`, 'green');
        }
      }
    }
    
    log('✅ tsconfig.json validation passed', 'green');
    return true;
  } catch (error) {
    log(`❌ Error validating tsconfig.json: ${error.message}`, 'red');
    return false;
  }
}

function fixTypeScriptConfig() {
  log('🔍 Checking TypeScript configuration files...', 'blue');
  
  const configFiles = [
    'tsconfig.json',
    'tsconfig.node.json',
    'tsconfig.app.json'
  ];
  
  let allGood = true;
  
  configFiles.forEach(configFile => {
    const success = checkAndCopyConfig(configFile);
    if (!success) {
      allGood = false;
    }
  });
  
  // Validate the main tsconfig.json
  const validationSuccess = validateTsConfig();
  if (!validationSuccess) {
    allGood = false;
  }
  
  if (allGood) {
    log('\n🎉 All TypeScript configuration files are properly set up!', 'green');
  } else {
    log('\n⚠️  Some issues were found with TypeScript configuration', 'yellow');
  }
  
  return allGood;
}

// Run the fix
const success = fixTypeScriptConfig();
process.exit(success ? 0 : 1);