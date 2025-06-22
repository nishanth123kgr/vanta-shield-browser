# 🔍 Whitelist Troubleshooting Guide

## Issue: Whitelisted domains list not showing in Settings

### 🛠️ Debug Steps:

#### 1. **Load Updated Extension**
```bash
# Rebuild with debug logging
npm run build && cp -r public/* dist/

# In Chrome:
# 1. Go to chrome://extensions/
# 2. Remove old Halonex Vanta extension
# 3. Load unpacked: select dist/ folder
```

#### 2. **Test Extension Loading**
- ✅ Extension loads without manifest errors
- ✅ Background script loads (check console)
- ✅ Settings page opens from popup

#### 3. **Debug Console Logging**

**Background Script Console:**
1. Open `chrome://extensions/`
2. Click "Inspect views: background page" for Halonex Vanta
3. Watch console for debug logs when:
   - Adding domains
   - Getting domains
   - Storage operations

**Settings Page Console:**
1. Open settings page
2. Press F12 to open DevTools
3. Watch console for debug logs

#### 4. **Test Debug Page**
Navigate to: `chrome-extension://[extension-id]/debug-whitelist.html`

**Test Buttons:**
- **Add test.example.com** - Should show success response
- **Get All Domains** - Should return array of whitelisted domains
- **Check Raw Storage** - Shows all storage contents
- **Clear Whitelist** - Removes all whitelist entries

#### 5. **Manual Storage Inspection**
1. Open Chrome DevTools (F12)
2. Go to: Application → Storage → Extensions → [Halonex Vanta ID]
3. Look for keys like: `vanta_[hash]` with domain values

### 🔧 **Expected Debug Output:**

#### When Adding Domain:
```
Background console:
✅ "Added test.example.com to whitelist with key: vanta_[hash]"

Settings console:
✅ "Using Chrome API to get whitelisted domains"
✅ "Received response from background script: {domains: [...]}"
```

#### When Loading Domains:
```
Background console:
✅ "Received getWhitelistedDomains request"
✅ "All storage contents: {...}"
✅ "Found whitelisted domain: vanta_[hash] = test.example.com"
✅ "Sending response with domains: [{domain: 'test.example.com', ...}]"

Settings console:
✅ "Loading whitelisted domains..."
✅ "Setting whitelisted domains: [...]"
```

### 🚨 **Common Issues & Fixes:**

#### Issue: "Chrome API not available"
**Fix:** Ensure you're accessing the settings page through the extension (not localhost)

#### Issue: Empty domains array
**Possible causes:**
1. No domains actually added yet
2. Storage filtering is too restrictive
3. Wrong storage key format

#### Issue: Domains added but not showing
**Check:**
1. Background script logs show domain being added
2. Storage inspection shows the key exists
3. getWhitelistedDomains returns the domain
4. Settings page receives the response

### 📊 **Quick Tests:**

1. **Add domain via popup** → Check if it appears in debug page
2. **Add domain via settings** → Check background script logs
3. **Reload settings page** → Check if domains persist
4. **Check raw storage** → Verify keys exist with correct format

### 🎯 **Next Steps:**
Once you've run the debug tests, share the console output to identify the exact issue!
