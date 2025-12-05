/**
 * Webpack adapter (placeholder for future implementation)
 */

import * as fs from 'fs';
import * as path from 'path';
import { RzdConfig } from '../../types/config';
import { BaseBuildAdapter } from './base';

export class WebpackAdapter extends BaseBuildAdapter {
  name = 'webpack';

  validate(): boolean {
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        return false;
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      const hasWebpack = 
        (packageJson.dependencies && packageJson.dependencies['webpack']) ||
        (packageJson.devDependencies && packageJson.devDependencies['webpack']);

      return !!hasWebpack;
    } catch (error) {
      return false;
    }
  }

  getBuildCommand(config: RzdConfig): string {
    const envString = this.getEnvString(config.env);
    const baseCommand = config.buildCommand || 'webpack --mode production';
    
    return envString ? `${envString} ${baseCommand}` : baseCommand;
  }

  getOutputDir(config: RzdConfig): string {
    return config.outputDir || 'dist';
  }

  async build(config: RzdConfig): Promise<void> {
    const { execSync } = require('child_process');
    const command = this.getBuildCommand(config);
    
    try {
      execSync(command, {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
    } catch (error) {
      throw new Error(`Build failed: ${error}`);
    }
  }
}
