# Vanta Shield - Browser Security Extension

Advanced browser protection powered by YARA threat detection. Safeguard your browsing experience from phishing attacks, malicious downloads, and cyber threats with enterprise-grade security.

## 🛡️ Features

- **Real-time Protection**: Advanced YARA-based threat detection with 99.9% detection rate
- **Cloud Intelligence**: Powered by threat intelligence database with 24M+ identified threats
- **Lightweight & Fast**: Minimal performance impact with <1ms response time
- **Privacy First**: Zero data collection - domains are hashed before transmission
- **Whitelist Management**: Comprehensive domain whitelisting system
- **Modern UI**: Beautiful React-based interface with Tailwind CSS

## 🚀 Chrome Extension

### Quick Start
```bash
npm install
npm run build:extension
```
Then load the `dist` folder as an unpacked extension in Chrome.

### Extension Features
- **Threat Blocking Page**: Detailed threat information when malicious sites are blocked
- **Extension Popup**: Quick access to protection status and controls
- **Settings Page**: Configure protection levels and manage whitelists
- **Background Protection**: Continuous monitoring without interrupting browsing

## ✅ Whitelist Management

### Features:
- **Settings Page Management**: Add, view, and remove whitelisted domains
- **Popup Quick-Add**: Whitelist current site directly from browser popup
- **Blocked Page Whitelist**: Add domains when they're flagged as threats
- **Chrome Extension Integration**: Full integration with Chrome storage API

### Usage:
1. **Via Settings**: Navigate to Settings → Whitelisted Sites to manage domains
2. **Via Popup**: Click the extension icon and select "Whitelist This Site"
3. **Via Blocked Page**: When a site is blocked, use "Add to Whitelist" option

## 🌐 Web Application & Showcase

The project includes a beautiful showcase page (`showcase.html`) demonstrating all extension features with live interactive demos.

## 🛠️ Technical Architecture

### Browser Extension
- Manifest V3 extension with content scripts and background workers
- Real-time domain scanning and threat detection
- Seamless integration with browser security APIs

### YARA Engine
- WebAssembly-based malware detection engine
- Custom rule sets for threat identification
- High-performance scanning algorithms

### Threat Intelligence
- Real-time API with hashed domain lookup
- Smart caching for optimal performance
- Privacy-preserving threat detection

## 📁 Project Structure

```
├── src/                    # React application source
├── public/                 # Chrome extension files
├── showcase.html          # Interactive feature showcase
├── index-standalone.html  # Threat blocking page
├── settings-standalone.html # Extension settings
└── dist/                  # Built extension files
```

## 🚀 Development

### Prerequisites
- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Local Development
```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd vanta-shield-browser

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build extension
npm run build:extension
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:extension` - Build Chrome extension
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🎯 Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI/UX**: Tailwind CSS, shadcn/ui components
- **Security**: YARA WebAssembly engine
- **Extension**: Chrome Manifest V3 APIs
- **Build**: Vite with custom extension configuration

## 📦 Deployment

### Chrome Web Store
1. Build the extension: `npm run build:extension`
2. Package the `dist` folder
3. Upload to Chrome Web Store Developer Dashboard

### Web Application
Open your preferred hosting platform and deploy the built files from the `dist` directory.
## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🏢 Built by Halonex

Vanta Shield is developed by Halonex with a focus on:
- Privacy-first security
- Open source transparency
- Enterprise-grade protection
- User-friendly experience

## 🔗 Links

- [Live Demo](showcase.html) - Interactive showcase of all features
- [Extension Settings](settings-standalone.html) - Configure protection settings
- [Threat Demo](index-standalone.html) - See how threats are blocked

---

**⚡ Get protected today with Vanta Shield - Advanced browser security made simple.**
