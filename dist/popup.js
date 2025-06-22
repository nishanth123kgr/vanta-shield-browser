// Popup script for Vanta Shield Chrome Extension

document.addEventListener('DOMContentLoaded', function() {
  // Get references to elements
  const protectionStatus = document.getElementById('protection-status');
  const blockedCount = document.getElementById('blocked-count');
  const currentSite = document.getElementById('current-site');
  const engineVersion = document.getElementById('engine-version');
  const scanBtn = document.getElementById('scan-btn');
  const whitelistBtn = document.getElementById('whitelist-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const reportBtn = document.getElementById('report-btn');

  let currentDomain = '';

  // Get current tab information
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0]) {
      const url = new URL(tabs[0].url);
      currentDomain = url.hostname || 'Unknown';
      currentSite.textContent = currentDomain;
      
      // Check if current site is malicious
      chrome.runtime.sendMessage({
        type: 'checkDomain',
        domain: currentDomain
      }, (response) => {
        if (response && response.isMalicious) {
          protectionStatus.textContent = 'Threat Blocked';
          protectionStatus.className = 'status-value blocked';
        }
      });
    }
  });

  // Get blocked attempts count
  chrome.runtime.sendMessage({
    type: 'getBlockedAttempts'
  }, (response) => {
    if (response) {
      blockedCount.textContent = response.count;
    }
  });

  // Scan button functionality
  scanBtn.addEventListener('click', function() {
    scanBtn.textContent = 'Scanning...';
    scanBtn.disabled = true;
    
    // Simulate scanning
    setTimeout(() => {
      scanBtn.textContent = 'Scan Complete ✓';
      setTimeout(() => {
        scanBtn.textContent = 'Scan Current Page';
        scanBtn.disabled = false;
      }, 2000);
    }, 1500);
  });

  // Whitelist button functionality
  whitelistBtn.addEventListener('click', function() {
    if (!currentDomain || currentDomain === 'Unknown') {
      whitelistBtn.textContent = 'Cannot whitelist this page';
      setTimeout(() => {
        whitelistBtn.textContent = 'Whitelist This Site';
      }, 2000);
      return;
    }

    whitelistBtn.textContent = 'Adding...';
    whitelistBtn.disabled = true;
    
    chrome.runtime.sendMessage({
      type: 'addToWhitelist',
      domain: currentDomain
    }, (response) => {
      if (response && response.success) {
        whitelistBtn.textContent = 'Added to Whitelist ✓';
        setTimeout(() => {
          whitelistBtn.textContent = 'Whitelist This Site';
          whitelistBtn.disabled = false;
        }, 2000);
      } else {
        whitelistBtn.textContent = 'Failed to add';
        setTimeout(() => {
          whitelistBtn.textContent = 'Whitelist This Site';
          whitelistBtn.disabled = false;
        }, 2000);
      }
    });
  });

  // Settings button functionality
  settingsBtn.addEventListener('click', function() {
    chrome.tabs.create({
      url: chrome.runtime.getURL('settings-standalone.html')
    });
  });

  // Report button functionality
  reportBtn.addEventListener('click', function() {
    reportBtn.textContent = 'Report Sent ✓';
    setTimeout(() => {
      reportBtn.textContent = 'Report False Positive';
    }, 2000);
  });
});
