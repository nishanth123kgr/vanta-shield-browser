# Chrome Extension Test Instructions

## 🔧 Setup
1. **Build the extension:**
   ```bash
   npm run build
   cp -r public/* dist/
   ```

2. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" 
   - Click "Load unpacked"
   - Select the `dist` folder

## ✅ Test Whitelist Functionality

### Test 1: Settings Page Access
1. Click the Halonex Vanta extension icon
2. Click "Settings" button
3. **Expected**: Settings page opens successfully (no ERR_FILE_NOT_FOUND)
4. **Expected**: "Whitelisted Sites" section is visible

### Test 2: Add Domain via Settings
1. In the Whitelisted Sites section
2. Enter "example.com" in the input field
3. Click the "+" button
4. **Expected**: Domain appears in the list below
5. **Expected**: Success toast notification

### Test 3: Remove Domain via Settings
1. Click the trash icon next to a whitelisted domain
2. **Expected**: Domain disappears from the list
3. **Expected**: Success toast notification

### Test 4: Whitelist via Popup
1. Navigate to any website (e.g., google.com)
2. Click the Halonex Vanta extension icon
3. Click "Whitelist This Site"
4. **Expected**: Success message appears
5. Go to Settings → Whitelisted Sites
6. **Expected**: The domain appears in the list

### Test 5: Storage Verification
1. Open Chrome DevTools (F12)
2. Go to Application → Storage → Extensions → [Extension ID]
3. **Expected**: See entries like `vanta_[hash] = "domain.com"`
4. **Expected**: No entries with value "0" for new domains

## 🛠️ Troubleshooting

### If Settings Page Doesn't Open:
- Check that `settings-standalone.html` exists in the `dist/` folder
- Verify the build process completed successfully
- Check browser console for any errors

### If Whitelist Doesn't Work:
- Check browser console for JavaScript errors
- Verify Chrome storage permissions in manifest.json
- Test in incognito mode to rule out conflicts

## 📁 Key Files to Check:
- `dist/settings-standalone.html` - Settings page
- `dist/background.js` - Updated whitelist functions  
- `dist/popup.js` - Updated popup functionality
- `dist/manifest.json` - Extension permissions
