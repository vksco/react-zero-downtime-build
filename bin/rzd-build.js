#!/usr/bin/env node

/**
 * React Zero Downtime Build CLI
 * Main executable for rzd-build and rzd-init commands
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const command = process.argv[2];

/**
 * Run the build process
 */
function buildCommand() {
  try {
    // Compile TypeScript wrapper to JavaScript if needed
    const wrapperTsPath = path.join(__dirname, '..', 'dist', 'scripts', 'wrapper.js');
    
    if (!fs.existsSync(wrapperTsPath)) {
      console.error('❌ Build wrapper not found. Please ensure the package is properly installed.');
      process.exit(1);
    }

    // Run the build wrapper
    require(wrapperTsPath).buildWrapper();
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
React Zero Downtime Build - Build Command

Usage:
  npx rzd build             Run the build process
  npm run build             Run the build (after initialization)

Options:
  -h, --help               Show this help message
  -v, --version            Show version number

Note: To initialize rzd in your project, use: npx @thisisayande/rzd init

Learn more: https://github.com/vksco/react-zero-downtime-build
`);
}

// Main command router
if (command === '-h' || command === '--help') {
  showHelp();
} else if (command === 'build' || command === 'rzd-build' || command === undefined) {
  buildCommand();
} else if (command === '-v' || command === '--version') {
  const packageJson = require('../package.json');
  console.log(packageJson.version);
} else {
  console.error(`❌ Unknown command: ${command}`);
  showHelp();
  process.exit(1);
}
