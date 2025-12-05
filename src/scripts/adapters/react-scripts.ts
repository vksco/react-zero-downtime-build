/**
 * React Scripts adapter for Create React App projects
 */

import * as fs from 'fs';
import * as path from 'path';
import { RzdConfig } from '../../types/config';
import { BaseBuildAdapter } from './base';
import { DEFAULT_OUTPUT_DIR } from '../../constants/defaults';

export class ReactScriptsAdapter extends BaseBuildAdapter {
  name = 'react-scripts';

  validate(): boolean {
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        return false;
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      // Check if react-scripts is in dependencies or devDependencies
      const hasReactScripts = 
        (packageJson.dependencies && packageJson.dependencies['react-scripts']) ||
        (packageJson.devDependencies && packageJson.devDependencies['react-scripts']);

      return !!hasReactScripts;
    } catch (error) {
      return false;
    }
  }

  getBuildCommand(config: RzdConfig): string {
    const envString = this.getEnvString(config.env);
    const baseCommand = config.buildCommand || 'react-scripts build';
    
    return envString ? `${envString} ${baseCommand}` : baseCommand;
  }

  getOutputDir(config: RzdConfig): string {
    return config.outputDir || DEFAULT_OUTPUT_DIR;
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
