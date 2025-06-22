// Background script for Halonex Vanta Chrome Extension
console.log('Halonex Vanta background script loaded');

// Store blocked attempts counter
let blockedAttempts = 0;
let blockedToday = 0;
let totalThreatsBlocked = 0;
let lastResetDate = null;

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Initialize counters from storage
chrome.storage.local.get(['blockedToday', 'totalThreatsBlocked', 'lastResetDate'], (result) => {
  const today = new Date().toDateString();
  lastResetDate = result.lastResetDate || today;
  
  // Reset daily counter if it's a new day
  if (lastResetDate !== today) {
    blockedToday = 0;
    chrome.storage.local.set({
      'blockedToday': 0,
      'lastResetDate': today
    });
  } else {
    blockedToday = result.blockedToday || 0;
  }
  
  totalThreatsBlocked = result.totalThreatsBlocked || 0;
  console.log(`Initialized: Today: ${blockedToday}, Total: ${totalThreatsBlocked}`);
});

// Function to increment threat counters
function incrementThreatCounters() {
  const today = new Date().toDateString();
  
  // Reset daily counter if it's a new day
  if (lastResetDate !== today) {
    blockedToday = 0;
    lastResetDate = today;
  }
  
  blockedToday++;
  totalThreatsBlocked++;
  blockedAttempts++;
  
  // Save to storage
  chrome.storage.local.set({
    'blockedToday': blockedToday,
    'totalThreatsBlocked': totalThreatsBlocked,
    'vanta_blocked_attempts': blockedAttempts,
    'lastResetDate': lastResetDate
  });
  
  console.log(`Threat blocked - Today: ${blockedToday}, Total: ${totalThreatsBlocked}`);
}

// Hash hostname function
async function hashHostname(hostname) {
  const encoder = new TextEncoder();
  const data = encoder.encode(hostname);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Check if domain is whitelisted
async function isWhitelisted(hashedHostname) {
  return new Promise((resolve) => {
    const whitelistKey = `vanta_${hashedHostname}`;
    chrome.storage.local.get(whitelistKey, (result) => {
      // Check if the key exists and has a domain value (not just '0')
      resolve(result[whitelistKey] !== undefined && result[whitelistKey] !== null);
    });
  });
}

// Get all whitelisted domains
async function getWhitelistedDomains() {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, (result) => {
      console.log('All storage contents:', result);
      const whitelistedDomains = [];
      for (const [key, value] of Object.entries(result)) {
        console.log(`Checking key: ${key}, value: ${value}, type: ${typeof value}`);
        if (key.startsWith('vanta_') && 
            !key.startsWith('vanta_cache_') && 
            !key.startsWith('vanta_blocked_') &&
            !key.startsWith('vanta_engine_') &&
            value && typeof value === 'string' && value !== '0') {
          console.log(`Found whitelisted domain: ${key} = ${value}`);
          whitelistedDomains.push({
            hash: key.replace('vanta_', ''),
            domain: value,
            key: key
          });
        }
      }
      console.log('Final whitelisted domains:', whitelistedDomains);
      resolve(whitelistedDomains);
    });
  });
}

// Add domain to whitelist
async function addToWhitelist(domain) {
  const hashedHostname = await hashHostname(domain);
  const whitelistKey = `vanta_${hashedHostname}`;
  return new Promise((resolve) => {
    chrome.storage.local.set({ [whitelistKey]: domain }, () => {
      console.log(`Added ${domain} to whitelist with key: ${whitelistKey}`);
      resolve(true);
    });
  });
}

// Remove domain from whitelist
async function removeFromWhitelist(whitelistKey) {
  return new Promise((resolve) => {
    chrome.storage.local.remove(whitelistKey, () => {
      console.log(`Removed from whitelist: ${whitelistKey}`);
      resolve(true);
    });
  });
}

// Get cached threat status
async function getCachedThreatStatus(hashedHostname) {
  return new Promise((resolve) => {
    const cacheKey = `vanta_cache_${hashedHostname}`;
    chrome.storage.local.get(cacheKey, (result) => {
      const cached = result[cacheKey];
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        console.log(`Using cached result for ${hashedHostname}: ${cached.isThreat}`);
        resolve(cached.isThreat);
      } else {
        resolve(null); // No valid cache
      }
    });
  });
}

// Cache threat status
async function cacheThreatStatus(hashedHostname, isThreat) {
  const cacheKey = `vanta_cache_${hashedHostname}`;
  const cacheData = {
    isThreat: isThreat,
    timestamp: Date.now()
  };
  chrome.storage.local.set({ [cacheKey]: cacheData });
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "loading" || !tab.url.startsWith("http")) return;

  chrome.storage.sync.get("enabled", async (data) => {
    if (data.enabled === false) return;

    try {
      const hostName = new URL(tab.url).hostname;
      
      // Skip special cases and invalid hostnames
      if (!hostName || 
          hostName === 'newtab' || 
          hostName.includes('chrome-extension://') || 
          tab.url.startsWith('chrome://') || 
          tab.url.startsWith('moz-extension://') ||
          tab.url.startsWith('about:') ||
          tab.url.startsWith('file://')) {
        console.log(`Skipping check for: ${hostName || 'unknown'}`);
        return;
      }

      console.log(`Tab updated - checking domain: ${hostName} (tab ID: ${tabId})`);
      
      const hashedHostname = await hashHostname(hostName);
      
      // Step 1: Check if domain is whitelisted
      const whitelisted = await isWhitelisted(hashedHostname);
      if (whitelisted) {
        console.log(`Domain ${hostName} is whitelisted, allowing access`);
        return;
      }
      
      // Step 2: Check cache first
      let isThreat = await getCachedThreatStatus(hashedHostname);
      
      // Step 3: If not in cache, check with API
      if (isThreat === null) {
        try {
          console.log(`Making API request for: ${hostName}`);
          const req = await fetch(`https://api.vanta.halonex.app/block/phishing/sha256/${hashedHostname}`);
          const phishing = await req.text();
          isThreat = phishing.trim() === "true";
          
          // Cache the result
          await cacheThreatStatus(hashedHostname, isThreat);
        } catch (apiError) {
          console.error('API request failed:', apiError);
          isThreat = false; // Fail safe - don't block on API errors
        }
      }
      
      // Step 4: Block if threat detected
      if (isThreat) {
        console.log(`Blocking malicious site: ${hostName}`);
        
        // Increment threat counters
        incrementThreatCounters();
        
        // Redirect to warning page
        chrome.tabs.update(tabId, {
          url: chrome.runtime.getURL("index-standalone.html") + "?domain=" + encodeURIComponent(hostName)
        });
      }
    } catch (error) {
      console.error('Error in tab update listener:', error);
    }
  });
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.type === 'setData') {
    // Store data in Chrome storage
    const data = {};
    data[request.key] = request.value;
    chrome.storage.local.set(data, () => {
      console.log(`Stored ${request.key} = ${request.value}`);
      sendResponse({ success: true });
    });
    return true; // Will respond asynchronously
  }
  
  if (request.type === 'getData') {
    chrome.storage.local.get(request.key, (result) => {
      sendResponse({ value: result[request.key] });
    });
    return true; // Will respond asynchronously
  }
  
  if (request.type === 'getBlockedAttempts') {
    sendResponse({ count: blockedAttempts });
  }
  
  if (request.type === 'getThreatStats') {
    sendResponse({ 
      blockedToday: blockedToday,
      totalThreatsBlocked: totalThreatsBlocked
    });
  }
  
  if (request.type === 'getWhitelistedDomains') {
    console.log('Received getWhitelistedDomains request');
    (async () => {
      try {
        const domains = await getWhitelistedDomains();
        console.log('Sending response with domains:', domains);
        sendResponse({ domains: domains });
      } catch (error) {
        console.error('Error getting whitelisted domains:', error);
        sendResponse({ domains: [] });
      }
    })();
    return true; // Will respond asynchronously
  }
  
  if (request.type === 'addToWhitelist') {
    (async () => {
      try {
        await addToWhitelist(request.domain);
        sendResponse({ success: true });
      } catch (error) {
        console.error('Error adding to whitelist:', error);
        sendResponse({ success: false });
      }
    })();
    return true; // Will respond asynchronously
  }
  
  if (request.type === 'removeFromWhitelist') {
    (async () => {
      try {
        await removeFromWhitelist(request.key);
        sendResponse({ success: true });
      } catch (error) {
        console.error('Error removing from whitelist:', error);
        sendResponse({ success: false });
      }
    })();
    return true; // Will respond asynchronously
  }
  
  if (request.type === 'checkDomain') {
    // Check domain using whitelist, cache, then API
    (async () => {
      try {
        const hashedHostname = await hashHostname(request.domain);
        
        // Check whitelist first
        const whitelisted = await isWhitelisted(hashedHostname);
        if (whitelisted) {
          console.log(`Domain ${request.domain} is whitelisted`);
          sendResponse({ isMalicious: false });
          return;
        }
        
        // Check cache
        let isThreat = await getCachedThreatStatus(hashedHostname);
        
        // If not cached, check API
        if (isThreat === null) {
          const req = await fetch(`https://api.vanta.halonex.app/block/phishing/sha256/${hashedHostname}`);
          const phishing = await req.text();
          isThreat = phishing.trim() === "true";
          
          // Cache the result
          await cacheThreatStatus(hashedHostname, isThreat);
        }
        
        sendResponse({ isMalicious: isThreat });
      } catch (error) {
        console.error('Error checking domain:', error);
        sendResponse({ isMalicious: false });
      }
    })();
    return true; // Will respond asynchronously
  }
  
  // Handle opening settings page
  if (request.type === 'openSettings') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('settings-standalone.html')
    });
    sendResponse({ success: true });
  }
});

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Halonex Vanta extension installed');
  
  // Set initial storage values
  chrome.storage.local.set({
    'vanta_blocked_attempts': blockedAttempts,
    'vanta_engine_version': '1.0'
  });
  
  // Set default enabled state in sync storage
  chrome.storage.sync.get("enabled", (data) => {
    if (data.enabled === undefined) {
      chrome.storage.sync.set({ "enabled": true });
      console.log('Halonex Vanta protection enabled by default');
    }
  });
});
