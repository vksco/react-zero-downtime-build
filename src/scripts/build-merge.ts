// Build into a temporary directory and merge into build/ without deleting old chunks
// Usage: node scripts/build-merge.js --env .env.local

import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

const root = path.resolve(__dirname, '../..');
const FINAL_BUILD_DIR = path.join(root, 'build');

interface ParsedArgs {
    envFile: string | null;
}

function parseArgs(): ParsedArgs {
    const args = process.argv.slice(2);
    const result: ParsedArgs = { envFile: null };
    for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if ((a === '--env' || a === '-e') && i + 1 < args.length) {
            result.envFile = args[i + 1];
            i++;
        }
    }
    return result;
}

function ensureDir(p: string): void {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copyRecursive(src: string, dst: string): void {
    if (!fs.existsSync(src)) return;
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        ensureDir(dst);
        for (const name of fs.readdirSync(src)) {
            copyRecursive(path.join(src, name), path.join(dst, name));
        }
    } else {
        ensureDir(path.dirname(dst));
        fs.copyFileSync(src, dst);
    }
}

async function run(): Promise<void> {
    const { envFile } = parseArgs();
    const tmpDir = path.join(root, `build-tmp-${Date.now()}`);

    // Prepare env and command
    const env = { ...process.env, BUILD_PATH: tmpDir };
    const args: string[] = [];
    if (envFile) {
        args.push('env-cmd', '-f', envFile, 'react-scripts', 'build');
    } else {
        args.push('react-scripts', 'build');
    }

    // On Windows, use shell so npx bin resolution works
    const cmd = process.platform === 'win32' ? 'npx' : 'npx';
    console.log(`[build-merge] Running build into ${tmpDir} ...`);
    await new Promise<void>((resolve, reject) => {
        const child = spawn(cmd, args, { cwd: root, env, stdio: 'inherit', shell: true });
        child.on('exit', code => {
            if (code === 0) resolve();
            else reject(new Error(`Build failed with code ${code}`));
        });
    });

    console.log('[build-merge] Merging new build into build/ (without deleting old files) ...');
    ensureDir(FINAL_BUILD_DIR);
    copyRecursive(tmpDir, FINAL_BUILD_DIR);

    // Clean up temp dir
    try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (_) {
        // ignore cleanup errors
    }

    console.log('[build-merge] Done. Old chunks are preserved.');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
