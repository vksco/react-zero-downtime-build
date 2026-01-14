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

  getBuildCommand(config: RzdConfig, outputDirOverride?: string): string {
    const envString = this.getEnvString(config.env);
    let baseCommand = config.buildCommand || 'webpack --mode production';

    if (outputDirOverride) {
      baseCommand += ` --output-path ${outputDirOverride}`;
    }

    return envString ? `${envString} ${baseCommand}` : baseCommand;
  }

  getOutputDir(config: RzdConfig): string {
    return config.outputDir || 'dist';
  }

  async build(config: RzdConfig, outputDirOverride?: string): Promise<void> {
    const { execSync } = require('child_process');
    const command = this.getBuildCommand(config, outputDirOverride);

    // Prepare environment variables
    const buildEnv = {
      ...process.env,
      ...config.env
    };

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
