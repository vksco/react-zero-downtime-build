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

  getBuildCommand(config: RzdConfig, outputDirOverride?: string): string {
    const envString = this.getEnvString(config.env);
    // If outputDirOverride is provided, we'll handle it via env vars in the build method, 
    // but typically react-scripts reads BUILD_PATH from env, so command string might just need to ensure custom envs are passed if we were using 'cross-env' in the string.
    // However, since we run via child_process.execSync with a custom env object, we don't strictly need to modify the command string itself for the path, 
    // BUT for clarity in logging/debugging we usually return the command string.
    const baseCommand = config.buildCommand || 'react-scripts build';

    return envString ? `${envString} ${baseCommand}` : baseCommand;
  }

  getOutputDir(config: RzdConfig): string {
    return config.outputDir || DEFAULT_OUTPUT_DIR;
  }

  async build(config: RzdConfig, outputDirOverride?: string): Promise<void> {
    const { execSync } = require('child_process');
    const command = this.getBuildCommand(config, outputDirOverride);

    // Prepare environment variables
    const buildEnv = {
      ...process.env,
      ...config.env
    };

    if (outputDirOverride) {
      buildEnv.BUILD_PATH = outputDirOverride;
    }

    try {
      execSync(command, {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: buildEnv
      });
    } catch (error) {
      throw new Error(`Build failed: ${error}`);
    }
  }
}
