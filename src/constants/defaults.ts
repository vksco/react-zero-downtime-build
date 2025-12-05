/**
 * Default constants for React Zero Downtime Build
 */

import { RzdConfig } from '../types/config';

export const DEFAULT_CHECK_INTERVAL = 60000; // 1 minute
export const DEFAULT_VERSION_ENDPOINT = '/app-version.json';
export const DEFAULT_OUTPUT_DIR = 'build';
export const VERSION_FILE_NAME = 'app-version.json';
export const CONFIG_FILE_NAME = 'rzd.config.js';

export const DEFAULT_CONFIG: Partial<RzdConfig> = {
  checkInterval: DEFAULT_CHECK_INTERVAL,
  versionEndpoint: DEFAULT_VERSION_ENDPOINT,
  outputDir: DEFAULT_OUTPUT_DIR,
  debug: false,
};

export const LOG_PREFIX = '[RZD]';
