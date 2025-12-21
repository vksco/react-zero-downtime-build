#!/usr/bin/env node

/**
 * React Zero Downtime Build - Initialization Script
 * Sets up rzd in a React project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Check if package is installed, if not, install it
console.log('📦 Checking if @thisisayande/rzd is installed...');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const isInstalled = 
  (packageJson.dependencies && packageJson.dependencies['@thisisayande/rzd']) ||
  (packageJson.devDependencies && packageJson.devDependencies['@thisisayande/rzd']);

if (!isInstalled) {
  console.log('📥 Installing @thisisayande/rzd...\n');
  try {
    // Detect package manager
    let packageManager = 'npm';
    if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
      packageManager = 'yarn';
    } else if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
      packageManager = 'pnpm';
    }

    // Install the package
    const installCmd = packageManager === 'yarn' 
      ? 'yarn add @thisisayande/rzd'
      : packageManager === 'pnpm'
      ? 'pnpm add @thisisayande/rzd'
      : 'npm install @thisisayande/rzd';

    console.log(`Running: ${installCmd}\n`);
    execSync(installCmd, { cwd, stdio: 'inherit' });
    console.log('\n✅ Package installed successfully!\n');
  } catch (error) {
    console.error('❌ Failed to install package:', error.message);
    console.error('\nPlease install manually with:');
    console.error('  npm install @thisisayande/rzd\n');
    process.exit(1);
  }
} else {
  console.log('✅ Package already installed\n');
}

// Create rzd.config.js if it doesn't exist
if (!fs.existsSync(configPath)) {
  // Check if templates directory exists
  if (fs.existsSync(templateDir) && fs.existsSync(path.join(templateDir, 'rzd.config.js'))) {
    const configTemplate = fs.readFileSync(
      path.join(templateDir, 'rzd.config.js'),
      'utf-8'
    );
    fs.writeFileSync(configPath, configTemplate, 'utf-8');
    console.log('✅ Created rzd.config.js');
  } else {
    // Create default config if template doesn't exist
    const defaultConfig = `module.exports = {
  // Build adapter: 'react-scripts', 'vite', or 'webpack'
  adapter: 'react-scripts',

  // Output directory
  outputDir: 'build',

  // Check for updates every 60 seconds (60000ms)
  checkInterval: 60000,

  // Version endpoint
  versionEndpoint: '/app-version.json',

  // Enable debug logging
  debug: false,

  // Environment variables for build
  env: {
    // REACT_APP_API_URL: 'https://api.example.com',
  },
};
`;
    fs.writeFileSync(configPath, defaultConfig, 'utf-8');
    console.log('✅ Created rzd.config.js');
  }
} else {
  console.log('⚠️  rzd.config.js already exists, skipping...');
}

// Update package.json scripts
try {
  // Reload package.json in case it was updated during installation
  const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  if (!updatedPackageJson.scripts) {
    updatedPackageJson.scripts = {};
  }

  // Backup original build script if it exists
  if (updatedPackageJson.scripts.build && !updatedPackageJson.scripts['build:original']) {
    updatedPackageJson.scripts['build:original'] = updatedPackageJson.scripts.build;
    console.log('✅ Original build script saved as "build:original"');
  }

  // Set new build script
  updatedPackageJson.scripts.build = 'rzd build';
  
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(updatedPackageJson, null, 2) + '\n',
    'utf-8'
  );
  console.log('✅ Updated package.json scripts');
  console.log('   - build: "rzd build"');
  if (updatedPackageJson.scripts['build:original']) {
    console.log(`   - build:original: "${updatedPackageJson.scripts['build:original']}"`);
  }
} catch (error) {
  console.error('❌ Failed to update package.json:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup complete!\n');
console.log('Next steps:');
console.log('1. Wrap your app with <VersionProvider> in src/index.tsx');
console.log('2. Add <UpdateBanner> or <UpdatePrompt> to your App component');
console.log('3. Run: npm run build\n');
console.log('See documentation: https://github.com/vksco/react-zero-downtime-build\n');
