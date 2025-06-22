// Simple test to verify the index.html can be accessed
console.log('Testing Chrome extension URL access...');

// This would be the actual extension URL structure
const extensionUrl = 'chrome-extension://YOUR_EXTENSION_ID/index.html';
console.log('Extension should be accessible at:', extensionUrl);

// Check if files exist
import fs from 'fs';
import path from 'path';

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');
const assetsPath = path.join(distPath, 'assets');

console.log('Checking files:');
console.log('index.html exists:', fs.existsSync(indexPath));
console.log('assets folder exists:', fs.existsSync(assetsPath));

if (fs.existsSync(assetsPath)) {
  const assetFiles = fs.readdirSync(assetsPath);
  console.log('Assets:', assetFiles);
}

console.log('All files should be accessible from the extension!');
