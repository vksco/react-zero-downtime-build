/**
 * Configuration types for React Zero Downtime Build
 */

export type BuildAdapter = 'react-scripts' | 'vite' | 'webpack';

export interface RzdConfig {
  /**
   * Build adapter to use (react-scripts, vite, webpack)
   */
  adapter: BuildAdapter;

  /**
   * Output directory for the build
   */
  outputDir?: string;

  /**
   * Check interval in milliseconds (default: 60000 - 1 minute)
   */
  checkInterval?: number;

  /**
   * API endpoint to check for version updates
   */
  versionEndpoint?: string;

  /**
   * Enable debug logging
   */
  debug?: boolean;

  /**
   * Custom build command
   */
  buildCommand?: string;

  /**
   * Environment variables to pass to build
   */
  env?: Record<string, string>;
}

export interface AppVersion {
  /**
   * Semantic version string
   */
  version: string;

  /**
   * Unix timestamp of build
   */
  timestamp: number;

  /**
   * Unique build identifier
   */
  buildId: string;
  /**
   * Git commit author (if available)
   */
  commitAuthor?: string | null;
  /**
   * Git commit message (if available)
   */
  commitMessage?: string | null;
}
