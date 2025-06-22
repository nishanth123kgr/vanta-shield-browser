#!/bin/bash

# Chrome Extension Test Script
echo "🛡️  Testing Vanta Shield Chrome Extension..."
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found. Run 'npm run build:extension' first."
    exit 1
fi

# Check required files
required_files=("manifest.json" "background.js" "content.js" "popup.html" "popup.js" "warning.html" "vanta-logo.png")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "dist/$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "❌ Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    echo ""
    echo "Run 'npm run build:extension' to generate all files."
    exit 1
fi

echo "✅ All required extension files are present:"
for file in "${required_files[@]}"; do
    echo "   ✓ $file"
done

echo ""
echo "📁 Extension files are ready in the 'dist' folder."
echo ""
echo "🚀 To test the extension:"
echo "   1. Open Chrome and go to chrome://extensions/"
echo "   2. Enable 'Developer mode'"
echo "   3. Click 'Load unpacked'"
echo "   4. Select the 'dist' folder"
echo "   5. Test by visiting: suspicious-banking-site.com"
echo ""
echo "🔧 Extension features:"
echo "   • Real-time malicious site blocking"
echo "   • Protection indicator on legitimate sites"
echo "   • Popup with threat statistics"
echo "   • Whitelist management"
echo ""

# Check if Chrome is available
if command -v google-chrome &> /dev/null || command -v chrome &> /dev/null; then
    echo "💡 Tip: Chrome is available. You can load the extension now!"
else
    echo "⚠️  Chrome not found in PATH. Make sure Chrome is installed."
fi
