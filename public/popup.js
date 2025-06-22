// Popup script for Vanta Shield Chrome Extension

document.addEventListener('DOMContentLoaded', function() {
  // Get references to elements
  const protectionStatus = document.getElementById('protection-status');
  const blockedCount = document.getElementById('blocked-count');
  const currentSite = document.getElementById('current-site');
  const engineVersion = document.getElementById('engine-version');
  const scanBtn = document.getElementById('scan-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const reportBtn = document.getElementById('report-btn');

  // Get current tab information
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0]) {
      const url = new URL(tabs[0].url);
      const domain = url.hostname || 'Unknown';
      currentSite.textContent = domain;
      
      // Check if current site is malicious
      chrome.runtime.sendMessage({
        type: 'checkDomain',
        domain: domain
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

  // Settings button functionality
  settingsBtn.addEventListener('click', function() {
    chrome.tabs.create({
      url: chrome.runtime.getURL('settings-react.html')
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
