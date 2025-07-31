#!/usr/bin/env node

/**
 * ParkEase Project Cleanup Script
 * Maintains clean project structure and removes unnecessary files
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 ParkEase Project Cleanup Script');
console.log('===================================\n');

// Define cleanup rules
const cleanupRules = {
  // Files that should be moved to temp folder
  tempFiles: [
    /^[A-Z][a-zA-Z]*Screen\(\)\)$/,  // Flutter/React Native screen files
    /^[A-Z][a-zA-Z]*Dialog\($/,      // Dialog fragments
    /^Navigator\.of\(context\)\.pop\(\)$/,  // Navigation fragments
  ],
  
  // Files that should be in docs folder
  docFiles: [
    /.*README.*\.md$/i,
    /.*\.txt$/,
    /.*connection.*\.txt$/i,
    /.*\.yaml$/,
    /.*\.yml$/,
  ],
  
  // Files that should be in scripts folder
  scriptFiles: [
    /^debug-.*\.js$/,
    /^install.*\.sh$/,
    /^setup.*\.js$/,
    /^build.*\.js$/,
  ],
  
  // Files that should stay in root
  rootFiles: [
    'package.json',
    'package-lock.json',
    '.env',
    '.env.example',
    '.gitignore',
    'index.html',
    'tsconfig.json',
    'vite.config.ts',
    'tailwind.config.js',
    'postcss.config.js',
    'eslint.config.js',
    'PROJECT_STRUCTURE.md'
  ]
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

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`📁 Created directory: ${dirPath}`, 'green');
  }
}

function moveFile(source, destination) {
  try {
    const destDir = path.dirname(destination);
    ensureDirectoryExists(destDir);
    
    if (fs.existsSync(source)) {
      fs.renameSync(source, destination);
      log(`📦 Moved: ${source} → ${destination}`, 'blue');
      return true;
    }
  } catch (error) {
    log(`❌ Error moving ${source}: ${error.message}`, 'red');
    return false;
  }
  return false;
}

function cleanupProject() {
  const rootDir = process.cwd();
  log(`🏠 Working in: ${rootDir}`, 'yellow');
  
  // Ensure required directories exist
  const requiredDirs = ['docs', 'scripts', 'config', 'temp', 'tests'];
  requiredDirs.forEach(dir => ensureDirectoryExists(dir));
  
  // Get all files in root directory
  const rootFiles = fs.readdirSync(rootDir).filter(file => {
    const filePath = path.join(rootDir, file);
    return fs.statSync(filePath).isFile();
  });
  
  let movedCount = 0;
  
  rootFiles.forEach(file => {
    // Skip files that should stay in root
    if (cleanupRules.rootFiles.includes(file)) {
      return;
    }
    
    let moved = false;
    
    // Check if file should go to temp folder
    if (cleanupRules.tempFiles.some(pattern => pattern.test(file))) {
      moved = moveFile(file, path.join('temp', file));
    }
    // Check if file should go to docs folder
    else if (cleanupRules.docFiles.some(pattern => pattern.test(file))) {
      moved = moveFile(file, path.join('docs', file));
    }
    // Check if file should go to scripts folder
    else if (cleanupRules.scriptFiles.some(pattern => pattern.test(file))) {
      moved = moveFile(file, path.join('scripts', file));
    }
    // Check if it's a config file
    else if (file.includes('config') || file.includes('.config.')) {
      moved = moveFile(file, path.join('config', file));
    }
    
    if (moved) {
      movedCount++;
    }
  });
  
  // Summary
  log('\n' + '='.repeat(40), 'blue');
  log('📊 CLEANUP SUMMARY', 'blue');
  log('='.repeat(40), 'blue');
  log(`📦 Files moved: ${movedCount}`, 'green');
  log(`📁 Root directory cleaned`, 'green');
  
  // List current root files
  const currentRootFiles = fs.readdirSync(rootDir).filter(file => {
    const filePath = path.join(rootDir, file);
    return fs.statSync(filePath).isFile();
  });
  
  log(`\n📋 Current root files (${currentRootFiles.length}):`, 'yellow');
  currentRootFiles.forEach(file => {
    log(`  • ${file}`, 'reset');
  });
  
  log('\n✅ Project cleanup completed!', 'green');
}

function validateStructure() {
  log('\n🔍 Validating project structure...', 'blue');
  
  const requiredDirs = ['src', 'server', 'tests', 'docs', 'scripts'];
  const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));
  
  if (missingDirs.length > 0) {
    log(`⚠️  Missing directories: ${missingDirs.join(', ')}`, 'yellow');
    missingDirs.forEach(dir => ensureDirectoryExists(dir));
  } else {
    log('✅ All required directories exist', 'green');
  }
  
  // Check for essential files
  const essentialFiles = ['package.json', 'tsconfig.json', 'vite.config.ts'];
  const missingFiles = essentialFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    log(`❌ Missing essential files: ${missingFiles.join(', ')}`, 'red');
  } else {
    log('✅ All essential files present', 'green');
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node cleanup-project.js [options]

Options:
  --help, -h      Show this help message
  --validate      Only validate structure, don't move files
  --dry-run       Show what would be moved without actually moving

Examples:
  node cleanup-project.js              # Clean up project structure
  node cleanup-project.js --validate   # Validate structure only
  node cleanup-project.js --dry-run    # Preview cleanup actions
  `);
} else if (args.includes('--validate')) {
  validateStructure();
} else if (args.includes('--dry-run')) {
  log('🔍 DRY RUN MODE - No files will be moved', 'yellow');
  // TODO: Implement dry run logic
  validateStructure();
} else {
  cleanupProject();
  validateStructure();
}