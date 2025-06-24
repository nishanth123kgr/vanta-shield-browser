// Settings page script for Halonex Vanta Chrome Extension

document.addEventListener('DOMContentLoaded', function() {
  // Get references to elements
  const enabledToggle = document.getElementById('enabled-toggle');
  const realtimeToggle = document.getElementById('realtime-toggle');
  const indicatorToggle = document.getElementById('indicator-toggle');
  const warningToggle = document.getElementById('warning-toggle');
  const threatsBlocked = document.getElementById('threats-blocked');
  const sitesWhitelisted = document.getElementById('sites-whitelisted');
  const protectionUptime = document.getElementById('protection-uptime');
  const resetStatsBtn = document.getElementById('reset-stats');
  const exportSettingsBtn = document.getElementById('export-settings');
  const clearWhitelistBtn = document.getElementById('clear-whitelist');

  // Load current settings and stats
  loadSettings();
  loadStats();
  updateCacheStats(); // Add cache stats loading

  // Add event listeners for toggles
  enabledToggle.addEventListener('click', () => toggleGlobalSetting('enabled', enabledToggle));
  realtimeToggle.addEventListener('click', () => toggleSetting('realtime', realtimeToggle));
  indicatorToggle.addEventListener('click', () => toggleSetting('indicator', indicatorToggle));
  warningToggle.addEventListener('click', () => toggleSetting('warning', warningToggle));

  // Add event listeners for buttons
  resetStatsBtn.addEventListener('click', resetStatistics);
  exportSettingsBtn.addEventListener('click', exportSettings);
  clearWhitelistBtn.addEventListener('click', clearWhitelist);

  function loadSettings() {
    // Load protection state from background script
    if (chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'getProtectionState' }, (response) => {
        if (response && response.enabled !== undefined) {
          updateToggleState(enabledToggle, response.enabled);
          console.log('Loaded protection state from background:', response.enabled);
        }
      });
    } else {
      // Fallback: Load global enabled setting from local storage
      chrome.storage.local.get(['protectionEnabled'], (result) => {
        updateToggleState(enabledToggle, result.protectionEnabled !== false);
      });
    }
    
    // Load other settings from local storage
    chrome.storage.local.get(['vanta_realtime', 'vanta_indicator', 'vanta_warning'], (result) => {
      // Default all settings to enabled
      updateToggleState(realtimeToggle, result.vanta_realtime !== false);
      updateToggleState(indicatorToggle, result.vanta_indicator !== false);
      updateToggleState(warningToggle, result.vanta_warning !== false);
    });
  }

  function loadStats() {
    chrome.storage.local.get(['vanta_blocked_attempts'], (result) => {
      if (result.vanta_blocked_attempts) {
        threatsBlocked.textContent = result.vanta_blocked_attempts;
      }
    });

    // Count whitelisted sites
    chrome.storage.local.get(null, (items) => {
      const whitelistCount = Object.keys(items).filter(key => 
        key.startsWith('vanta_') && key.length > 10 && items[key] === '0'
      ).length;
      sitesWhitelisted.textContent = whitelistCount;
    });

    updateCacheStats();
  }

  function toggleSetting(setting, toggleElement) {
    const isActive = toggleElement.classList.contains('active');
    const newState = !isActive;
    
    updateToggleState(toggleElement, newState);
    
    // Save setting
    const settingKey = `vanta_${setting}`;
    const data = {};
    data[settingKey] = newState;
    chrome.storage.local.set(data);
    
    console.log(`${setting} setting: ${newState}`);
  }

  function toggleGlobalSetting(setting, toggleElement) {
    const isActive = toggleElement.classList.contains('active');
    const newState = !isActive;
    
    updateToggleState(toggleElement, newState);
    
    // Handle protection setting specifically
    if (setting === 'enabled') {
      // Send to background script
      if (chrome.runtime) {
        chrome.runtime.sendMessage({
          type: 'setProtectionState',
          enabled: newState
        }, (response) => {
          if (response && response.success) {
            console.log('Protection state updated in background script');
            showNotification(newState ? 'Protection Enabled' : 'Protection Disabled');
          }
        });
      }
      
      // Also save to local storage for backward compatibility
      chrome.storage.local.set({ protectionEnabled: newState });
    } else {
      // Save other global settings to sync storage
      const data = {};
      data[setting] = newState;
      chrome.storage.sync.set(data);
      console.log(`Global ${setting} setting: ${newState}`);
    }
  }

  function updateToggleState(toggle, isActive) {
    if (isActive) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }
  }

  function resetStatistics() {
    if (confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
      chrome.storage.local.set({
        'vanta_blocked_attempts': 0
      }, () => {
        threatsBlocked.textContent = '0';
        showNotification('Statistics reset successfully');
      });
    }
  }

  function exportSettings() {
    chrome.storage.local.get(null, (items) => {
      const settings = {};
      for (const key in items) {
        if (key.startsWith('vanta_')) {
          settings[key] = items[key];
        }
      }
      
      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vanta-shield-settings.json';
      a.click();
      URL.revokeObjectURL(url);
      
      showNotification('Settings exported successfully');
    });
  }

  function clearWhitelist() {
    if (confirm('Are you sure you want to clear all whitelisted sites? This action cannot be undone.')) {
      chrome.storage.local.get(null, (items) => {
        const keysToRemove = Object.keys(items).filter(key => 
          key.startsWith('vanta_') && key.length > 10 && items[key] === '0'
        );
        
        chrome.storage.local.remove(keysToRemove, () => {
          sitesWhitelisted.textContent = '0';
          showNotification('Whitelist cleared successfully');
        });
      });
    }
  }

  // Add cache management
  function clearCache() {
    if (confirm('Are you sure you want to clear the threat detection cache? This will force fresh API checks for all sites.')) {
      chrome.storage.local.get(null, (items) => {
        const cacheKeys = Object.keys(items).filter(key => key.startsWith('vanta_cache_'));
        
        chrome.storage.local.remove(cacheKeys, () => {
          showNotification(`Cleared ${cacheKeys.length} cache entries`);
        });
      });
    }
  }

  // Add cache stats
  function updateCacheStats() {
    chrome.storage.local.get(null, (items) => {
      const cacheEntries = Object.keys(items).filter(key => key.startsWith('vanta_cache_'));
      const validEntries = cacheEntries.filter(key => {
        const cached = items[key];
        return cached && (Date.now() - cached.timestamp) < (24 * 60 * 60 * 1000); // 24 hours
      });
      
      // Add cache info to stats if not already present
      if (!document.getElementById('cache-stats')) {
        const statsGrid = document.querySelector('.stats-grid');
        const cacheCard = document.createElement('div');
        cacheCard.className = 'stat-card';
        cacheCard.innerHTML = `
          <div class="stat-value" id="cache-stats">${validEntries.length}</div>
          <div class="stat-label">Cached Entries</div>
        `;
        statsGrid.appendChild(cacheCard);
        
        // Add clear cache button
        const actionsSection = document.querySelector('.section:nth-last-child(2)');
        const clearCacheBtn = document.createElement('button');
        clearCacheBtn.className = 'button secondary';
        clearCacheBtn.textContent = 'Clear Cache';
        clearCacheBtn.addEventListener('click', clearCache);
        actionsSection.appendChild(clearCacheBtn);
      } else {
        document.getElementById('cache-stats').textContent = validEntries.length;
      }
    });
  }

  function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => notification.style.opacity = '1', 100);
    
    // Fade out and remove
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
});
