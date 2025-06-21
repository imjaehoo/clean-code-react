import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory of this module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json from project root
const packageJsonPath = join(__dirname, '..', 'package.json');

let cachedVersion: string | undefined;

export function getVersion(): string {
  if (cachedVersion) {
    return cachedVersion;
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const version = packageJson.version;
    if (typeof version === 'string') {
      cachedVersion = version;
      return version;
    }
  } catch (error) {
    console.warn('Could not read version from package.json:', error);
  }

  // Fallback
  cachedVersion = '0.0.0';
  return cachedVersion;
}
