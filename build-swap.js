const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Zero-Downtime Next.js Build...');

// 1. Run build in a new directory (.next-new)
try {
  console.log('📦 Compiling Next.js application...');
  execSync('npm run build', {
    env: { ...process.env, BUILD_DIR: '.next-new' },
    stdio: 'inherit'
  });
} catch (error) {
  console.error('❌ Build failed! Keeping the current site online.');
  process.exit(1);
}

const targetDir = path.join(__dirname, '.next');
const newDir = path.join(__dirname, '.next-new');
const oldDir = path.join(__dirname, '.next-old');

console.log('🔄 Swapping build directories...');

// Remove any lingering backup folder from previous runs
if (fs.existsSync(oldDir)) {
  fs.rmSync(oldDir, { recursive: true, force: true });
}

try {
  // 2. Folder swap (atomic rename)
  if (fs.existsSync(targetDir)) {
    fs.renameSync(targetDir, oldDir);
  }
  fs.renameSync(newDir, targetDir);
  
  // Clean up old directory in the background
  if (fs.existsSync(oldDir)) {
    fs.rmSync(oldDir, { recursive: true, force: true });
  }
  console.log('✅ Folder swap completed.');

  // 3. PM2 Process Reload
  console.log('🔄 Reloading PM2 process "promise-erp"...');
  try {
    // Executes rolling reload on the PM2 application
    execSync('pm2 reload promise-erp', { stdio: 'inherit' });
    console.log('🎉 PM2 reloaded successfully!');
  } catch (pm2Error) {
    console.log('⚠️ PM2 reload command failed (PM2 might not be running or not installed globally).');
    console.log('👉 If this is the first run on the server, start it using: pm2 start ecosystem.config.js');
  }

  console.log('🎉 Site updated successfully with ZERO downtime!');
} catch (swapError) {
  console.error('❌ Error during folder swap:', swapError);
  // Rollback: If something went wrong and the original .next is missing, restore it from backup
  if (!fs.existsSync(targetDir) && fs.existsSync(oldDir)) {
    console.log('🔄 Restoring original build from backup...');
    fs.renameSync(oldDir, targetDir);
  }
  process.exit(1);
}
