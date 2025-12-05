/**
 * Base adapter interface for different build tools
 */

import { RzdConfig } from '../../types/config';

export interface BuildAdapter {
  /**
   * Name of the adapter
   */
  name: string;

  /**
   * Execute the build process
   */
  build(config: RzdConfig): Promise<void>;

  /**
   * Get the build command
   */
  getBuildCommand(config: RzdConfig): string;

  /**
   * Get the output directory
   */
  getOutputDir(config: RzdConfig): string;

  /**
   * Validate if this adapter can be used in the current project
   */
  validate(): boolean;
}

export abstract class BaseBuildAdapter implements BuildAdapter {
  abstract name: string;

  abstract getBuildCommand(config: RzdConfig): string;
  
  abstract getOutputDir(config: RzdConfig): string;
  
  abstract validate(): boolean;

  async build(config: RzdConfig): Promise<void> {
    throw new Error('build() method must be implemented by subclass');
  }

  protected getEnvString(env?: Record<string, string>): string {
    if (!env) return '';
    
    return Object.entries(env)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');
  }
}
