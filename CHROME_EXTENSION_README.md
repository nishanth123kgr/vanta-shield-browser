# Halonex Vanta Chrome Extension

A powerful browser security extension that protects users from malicious websites and online threats.

## Features

- **Real-time Threat Detection**: Automatically blocks access to known malicious domains
- **Whitelist Management**: Allow users to add trusted sites to a whitelist
- **Threat Counter**: Tracks the number of blocked threats
- **Protection Indicator**: Shows protection status on legitimate websites
- **Modern UI**: Beautiful React-based warning and popup interfaces

## Installation

### Development Installation

1. **Build the Extension**:
   ```bash
   npm install
   npm run build:extension
   ```

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

3. **Test the Extension**:
   - Navigate to `suspicious-banking-site.com` to see the warning page
   - Click the Halonex Vanta icon in the toolbar to see the popup
   - Visit any legitimate website to see the protection indicator

### Production Installation

For production, you would:
1. Zip the `dist` folder contents
2. Upload to Chrome Web Store Developer Dashboard
3. Follow Chrome Web Store review process

## Project Structure

```
/dist/                  # Built extension files
├── manifest.json       # Extension configuration
├── background.js       # Background service worker
├── content.js          # Content script for all pages
├── popup.html          # Extension popup interface
├── popup.js            # Popup functionality
├── warning.html        # Warning page for blocked sites
├── assets/             # Built React app assets
└── vanta-logo.png      # Extension icon
```

## Extension Components

### 1. Manifest (manifest.json)
- Defines extension permissions and configuration
- Uses Manifest V3 (latest Chrome extension format)
- Requests permissions for tabs, storage, and web navigation

### 2. Background Script (background.js)
- Monitors web navigation for malicious domains
- Maintains threat database and blocked attempts counter
- Handles message passing between components
- Redirects users to warning page when threats detected

### 3. Content Script (content.js)
- Runs on all websites
- Shows protection indicator on legitimate sites
- Communicates with background script for threat checking

### 4. Popup (popup.html/js)
- Shows extension status and statistics
- Provides quick access to settings and actions
- Displays current site protection status

### 5. Warning Page (warning.html)
- Full-page React app shown when threats are blocked
- Allows users to go back, whitelist sites, or report false positives
- Uses the same React components as the main app

## Configuration

### Adding Malicious Domains
Edit the `MALICIOUS_DOMAINS` array in `public/background.js`:

```javascript
const MALICIOUS_DOMAINS = [
  'suspicious-banking-site.com',
  'fake-login-portal.net',
  'malware-download.org',
  // Add more domains...
];
```

### Customizing the UI
The warning page uses React components from `src/pages/Index.tsx`. You can:
- Modify colors and styling in the component
- Update the threat message text
- Add new functionality like threat reporting

## Chrome Extension APIs Used

- **chrome.webNavigation**: Monitor page navigation
- **chrome.storage**: Store whitelisted domains and settings
- **chrome.tabs**: Update tab URLs for redirects
- **chrome.runtime**: Message passing between scripts

## Security Features

- **Domain Whitelisting**: SHA256 hashed domain storage
- **Real-time Protection**: Blocks threats before page loads
- **Privacy Friendly**: No data sent to external servers
- **Minimal Permissions**: Only requests necessary permissions

## Development

### Building for Development
```bash
npm run build:dev     # Build with dev optimizations
npm run dev           # Run development server for testing
```

### Testing
- Test the warning page at: `http://localhost:8080`
- Load the extension in Chrome for full functionality testing
- Check console logs for debugging information

## Deployment

1. **Update Version**: Increment version in `public/manifest.json`
2. **Build**: Run `npm run build:extension`
3. **Test**: Load unpacked extension and test all features
4. **Package**: Zip the `dist` folder contents
5. **Submit**: Upload to Chrome Web Store

## Browser Compatibility

- **Chrome**: Full support (Manifest V3)
- **Edge**: Full support (Chromium-based)
- **Firefox**: Requires manifest conversion for Manifest V2
- **Safari**: Requires Safari Web Extension conversion

## License

This extension is built for educational and demonstration purposes. Ensure you have proper threat intelligence data and user consent before deploying to production.
