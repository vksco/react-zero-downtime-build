/**
 * Logger utility for React Zero Downtime Build
 */

import { LOG_PREFIX } from '../constants/defaults';

export class Logger {
  private debug: boolean;

  constructor(debug: boolean = false) {
    this.debug = debug;
  }

  log(message: string, ...args: any[]): void {
    console.log(`${LOG_PREFIX} ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`${LOG_PREFIX} ❌ ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`${LOG_PREFIX} ⚠️  ${message}`, ...args);
  }

  info(message: string, ...args: any[]): void {
    if (this.debug) {
      console.info(`${LOG_PREFIX} ℹ️  ${message}`, ...args);
    }
  }

  success(message: string, ...args: any[]): void {
    console.log(`${LOG_PREFIX} ✅ ${message}`, ...args);
  }
}

export const logger = new Logger();
