/**
 * React Zero Downtime Build Configuration
 * 
 * This file configures how your application is built and how version checking works.
 */

module.exports = {
  /**
   * Build adapter to use
   * Options: 'react-scripts', 'vite', 'webpack'
   */
  adapter: 'react-scripts',

  /**
   * Output directory for the build (relative to project root)
   * Default: 'build' for react-scripts, 'dist' for vite/webpack
   */
  outputDir: 'build',

  /**
   * Check interval in milliseconds (how often to check for updates)
   * Default: 60000 (1 minute)
   */
  checkInterval: 60000,

  /**
   * API endpoint to check for version updates
   * Default: '/app-version.json'
   */
  versionEndpoint: '/app-version.json',

  /**
   * Enable debug logging
   * Default: false
   */
  debug: false,

  /**
   * Custom build command (optional)
   * If not specified, uses the default command for the adapter
   * Example: 'react-scripts build' or 'vite build'
   */
  // buildCommand: 'react-scripts build',

  /**
   * Environment variables to pass to the build process
   * Example: { NODE_ENV: 'production', REACT_APP_API_URL: 'https://api.example.com' }
   */
  env: {
    // Add your environment variables here
  },
};
