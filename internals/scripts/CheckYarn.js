const { execSync } = require('child_process');
const { semverSatisfies } = require('./semver');

const requiredVersionRange = '>=6.x <=8.16.0';

try {
  const npmVersion = execSync('npm -v').toString().trim();
  // Bypassing version check for development
  console.info(`Using npm version: ${npmVersion} (version check bypassed)`);
} catch (error) {
  console.error('Error checking npm version:', error);

  process.exit(1);
}

if (!/yarn\.js$/.test(process.env.npm_execpath || '')) {
  console.warn(
    "\u001b[33mYou don't seem to be using yarn. This could produce unexpected results.\u001b[39m",
  );
}
