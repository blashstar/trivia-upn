import { execSync } from 'child_process';
import { rmSync, existsSync } from 'fs';

function killProcess(name) {
  try {
    const currentPid = process.pid;
    execSync(`taskkill /F /IM ${name} /FI "PID ne ${currentPid}"`, { stdio: 'ignore' });
  } catch {
    // Process not found or already killed - that's fine
  }
}

async function removeWithRetry(dir, retries = 5, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      if (existsSync(dir)) {
        rmSync(dir, { recursive: true, force: true });
        console.log(`  Removed ${dir}/`);
        return true;
      }
    } catch (e) {
      if (i < retries - 1) {
        console.log(`  Waiting for ${dir} to unlock... (attempt ${i + 1}/${retries})`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        console.log(`  WARNING: Could not remove ${dir}/ - manual cleanup may be needed`);
      }
    }
  }
}

console.log('=== Electron Build Script ===\n');

console.log('[1/4] Killing Node and Electron processes...');
killProcess('node.exe');
killProcess('electron.exe');

await new Promise(r => setTimeout(r, 2000));

console.log('[2/4] Cleaning build directories...');
await removeWithRetry('.output');
await removeWithRetry('.nuxt');
await removeWithRetry('dist');

console.log('[3/4] Generating Nuxt static files...');
execSync('npx nuxt generate', { stdio: 'inherit', env: { ...process.env, ELECTRON_BUILD: 'true' } });

console.log('[4/4] Building Electron installer...');
execSync('npx electron-builder --win', { stdio: 'inherit' });

console.log('\n=== Build Complete! ===');
console.log('Installer location: release\\');
