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
 * Initialize rzd in a project
 */
function initCommand() {
  console.log('🚀 React Zero Downtime Build - Initialization\n');

  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, 'package.json');
  const configPath = path.join(cwd, 'rzd.config.js');
  const templateDir = path.join(__dirname, '..', 'templates');

  // Check if package.json exists
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found. Make sure you are in a valid project directory.');
    process.exit(1);
  }

  // Create rzd.config.js if it doesn't exist
  if (!fs.existsSync(configPath)) {
    const configTemplate = fs.readFileSync(
      path.join(templateDir, 'rzd.config.js'),
      'utf-8'
    );
    fs.writeFileSync(configPath, configTemplate, 'utf-8');
    console.log('✅ Created rzd.config.js');
  } else {
    console.log('⚠️  rzd.config.js already exists, skipping...');
  }

  // Update package.json scripts
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    // Backup original build script if it exists
    if (packageJson.scripts.build && !packageJson.scripts['build:original']) {
      packageJson.scripts['build:original'] = packageJson.scripts.build;
      console.log('✅ Original build script saved as "build:original"');
    }

    // Set new build script
    packageJson.scripts.build = 'rzd build';
    
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
      'utf-8'
    );
    console.log('✅ Updated package.json scripts');
    console.log('   - New build script uses rzd build wrapper');
  } catch (error) {
    console.error('❌ Failed to update package.json:', error.message);
    process.exit(1);
  }

  console.log('\n🎉 Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Wrap your app with VersionProvider (see docs)');
  console.log('2. Run: npm run build\n');
}

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
React Zero Downtime Build CLI

Usage:
  npx @karmick/rzd init     Initialize rzd in your project
  npx rzd build             Run the build process
  npm run build             Run the build (after initialization)

Options:
  -h, --help               Show this help message
  -v, --version            Show version number

Learn more: https://github.com/vksco/react-zero-downtime-build
`);
}

// Main command router
if (command === '-h' || command === '--help') {
  showHelp();
} else if (command === 'init' || command === 'rzd-init') {
  initCommand();
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
