/**
 * Config reader utility - Read rzd.config.js
 */

import * as path from 'path';
import * as fs from 'fs';
import { RzdConfig } from '../types/config';
import { DEFAULT_CONFIG, CONFIG_FILE_NAME } from '../constants/defaults';
import { Logger } from './logger';

const logger = new Logger();

/**
 * Read and validate the rzd.config.js file from the project root
 */
export function readConfig(projectRoot: string = process.cwd()): RzdConfig {
  const configPath = path.join(projectRoot, CONFIG_FILE_NAME);

  if (!fs.existsSync(configPath)) {
    logger.warn(`Config file not found at ${configPath}. Using defaults.`);
    return { 
      adapter: 'react-scripts',
      ...DEFAULT_CONFIG 
    } as RzdConfig;
  }

  try {
    // Clear require cache to get fresh config
    delete require.cache[require.resolve(configPath)];
    
    const userConfig = require(configPath);
    const config: RzdConfig = {
      ...DEFAULT_CONFIG,
      ...userConfig,
    };

    // Validate required fields
    if (!config.adapter) {
      throw new Error('adapter is required in rzd.config.js');
    }

    if (config.debug) {
      logger.info('Loaded config:', config);
    }

    return config;
  } catch (error) {
    logger.error(`Failed to read config file: ${error}`);
    throw error;
  }
}

/**
 * Get config with environment-specific overrides
 */
export function getConfigWithEnv(projectRoot?: string): RzdConfig {
  const config = readConfig(projectRoot);
  
  // Override with environment variables if present
  if (process.env.RZD_CHECK_INTERVAL) {
    config.checkInterval = parseInt(process.env.RZD_CHECK_INTERVAL, 10);
  }
  
  if (process.env.RZD_VERSION_ENDPOINT) {
    config.versionEndpoint = process.env.RZD_VERSION_ENDPOINT;
  }
  
  if (process.env.RZD_DEBUG === 'true') {
    config.debug = true;
  }
  
  return config;
}
