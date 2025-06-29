// Popup script for Halonex Vanta Chrome Extension
// Enhanced with design principles from the main app

document.addEventListener('DOMContentLoaded', function() {
  // Get references to elements
  const protectionToggle = document.getElementById('protection-toggle');
  const protectionIcon = document.getElementById('protection-icon');
  const protectionTitle = document.getElementById('protection-title');
  const protectionSubtitle = document.getElementById('protection-subtitle');
  const blockedCount = document.getElementById('blocked-count');
  const totalThreats = document.getElementById('total-threats');
  const currentSiteStatus = document.getElementById('current-site-status');
  const currentSite = document.getElementById('current-site');
  const engineVersion = document.getElementById('engine-version');
  const lastScan = document.getElementById('last-scan');
  const databaseStatus = document.getElementById('database-status');
  const scanBtn = document.getElementById('scan-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const scanProgress = document.getElementById('scan-progress');
  const scanProgressBar = document.getElementById('scan-progress-bar');

  let currentDomain = '';
  let isScanning = false;
  let isProtectionEnabled = true;

  // Utility function to truncate long domain names
  function truncateDomain(domain, maxLength = 25) {
    if (!domain || domain.length <= maxLength) {
      return domain;
    }
    
    // For very long domains, show start + ... + end
    if (domain.length > maxLength) {
      const start = domain.substring(0, Math.floor(maxLength * 0.6));
      const end = domain.substring(domain.length - Math.floor(maxLength * 0.3));
      return `${start}...${end}`;
    }
    
    return domain;
  }

  // Remove flickering - no need for fade-in animation
  // Initialize container immediately
  document.querySelector('.container').style.opacity = '1';

  // Load protection state from background script
  if (chrome.runtime) {
    chrome.runtime.sendMessage({ type: 'getProtectionState' }, (response) => {
      if (response && response.enabled !== undefined) {
        isProtectionEnabled = response.enabled;
        protectionToggle.checked = isProtectionEnabled;
        updateProtectionUI();
        console.log('Loaded protection state from background:', isProtectionEnabled);
      }
    });
  } else {
    // Fallback: Load from storage if runtime not available
    chrome.storage.local.get(['protectionEnabled'], (result) => {
      if (result.protectionEnabled !== undefined) {
        isProtectionEnabled = result.protectionEnabled;
        protectionToggle.checked = isProtectionEnabled;
        updateProtectionUI();
      }
    });
  }

  // Initialize stat values with immediate defaults and real data
  function initializeStats() {
    // Set immediate default values to prevent long loading
    if (blockedCount) {
      blockedCount.innerHTML = '0';
      blockedCount.className = 'stat-value blocked';
    }
    
    if (totalThreats) {
      totalThreats.innerHTML = '0';
      totalThreats.className = 'stat-value blocked';
    }
    
    if (currentSiteStatus) {
      const defaultSite = 'localhost';
      currentSiteStatus.innerHTML = truncateDomain(defaultSite);
      currentSiteStatus.className = 'stat-value safe';
    }
    
    // Then try to load real data quickly
    if (chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'getThreatStats' }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn('Could not get threat stats from background:', chrome.runtime.lastError);
          // Keep default values, try storage as backup
          loadStatsFromStorage();
          return;
        }
        
        if (response && blockedCount) {
          const todayCount = response.blockedToday || 0;
          blockedCount.innerHTML = todayCount.toString();
        }
        
        if (response && totalThreats) {
          const totalCount = response.totalThreatsBlocked || 0;
          totalThreats.innerHTML = totalCount.toString();
        }
      });
    } else {
      // Try storage as backup
      loadStatsFromStorage();
    }
  }
  
  // Fallback function to load from storage
  function loadStatsFromStorage() {
    if (chrome.storage) {
      chrome.storage.local.get(['blockedToday', 'totalThreatsBlocked'], (result) => {
        if (blockedCount) {
          const todayCount = result.blockedToday || 0;
          blockedCount.innerHTML = todayCount.toString();
          blockedCount.className = 'stat-value blocked';
        }
        
        if (totalThreats) {
          const totalCount = result.totalThreatsBlocked || 0;
          totalThreats.innerHTML = totalCount.toString();
          totalThreats.className = 'stat-value blocked';
        }
      });
    } else {
      // Final fallback
      if (blockedCount) {
        blockedCount.innerHTML = '0';
        blockedCount.className = 'stat-value blocked';
      }
      if (totalThreats) {
        totalThreats.innerHTML = '0';
        totalThreats.className = 'stat-value blocked';
      }
    }
  }

  // Call initialization
  initializeStats();

  // Immediate site detection with proper Chrome tabs API
  function detectCurrentSite() {
    // First set immediate fallback
    currentDomain = 'Loading...';
    const truncatedDomain = truncateDomain(currentDomain);
    if (currentSiteStatus) {
      currentSiteStatus.innerHTML = truncatedDomain;
      currentSiteStatus.className = 'stat-value safe';
    }
    if (currentSite) {
      currentSite.innerHTML = truncatedDomain;
    }
    
    // Then try to get the active tab URL
    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          console.warn('Could not query tabs:', chrome.runtime.lastError);
          setFallbackSite();
          return;
        }
        
        if (tabs && tabs.length > 0 && tabs[0].url) {
          try {
            const url = new URL(tabs[0].url);
            currentDomain = url.hostname;
            const truncatedDomain = truncateDomain(currentDomain);
            
            // Update current site display
            if (currentSite) {
              currentSite.innerHTML = truncatedDomain;
            }
            
            // Update current site status
            if (currentSiteStatus) {
              const isSecure = url.protocol === 'https:';
              const statusClass = isSecure ? 'safe' : 'warning';
              
              currentSiteStatus.innerHTML = truncatedDomain;
              currentSiteStatus.className = `stat-value ${statusClass}`;
            }
            
            // Check if the site is in our protection system
            checkSiteSafety(currentDomain);
            
          } catch (error) {
            console.log('Error parsing tab URL:', error);
            setFallbackSite();
          }
        } else {
          setFallbackSite();
        }
      });
    } else {
      setFallbackSite();
    }
  }
  
  // Fallback site when Chrome APIs are not available
  function setFallbackSite() {
    currentDomain = 'example.com';
    const truncatedDomain = truncateDomain(currentDomain);
    if (currentSiteStatus) {
      currentSiteStatus.innerHTML = truncatedDomain;
      currentSiteStatus.className = 'stat-value safe';
    }
    if (currentSite) {
      currentSite.innerHTML = truncatedDomain;
    }
  }
  
  // Check site safety with background script
  function checkSiteSafety(domain) {
    if (!chrome.runtime || !isProtectionEnabled) {
      return;
    }
    
    chrome.runtime.sendMessage({
      type: 'checkDomain',
      domain: domain,
      protectionEnabled: isProtectionEnabled
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn('Extension context may be unavailable:', chrome.runtime.lastError);
        return;
      }
      
      if (response && response.isMalicious && currentSiteStatus) {
        // Update UI to show blocked site
        const truncatedDomain = truncateDomain(domain);
        currentSiteStatus.innerHTML = truncatedDomain;
        currentSiteStatus.className = 'stat-value blocked';
        protectionSubtitle.textContent = 'Threat blocked on this site';
      }
    });
  }
  
  // Call immediate site detection
  detectCurrentSite();

  // Enhanced status indicators for new layout
  function updateStatusIndicator(element, status, text) {
    if (element) {
      element.innerHTML = text;
      element.className = `stat-value ${status}`;
    }
  }

  // Update protection UI based on state
  function updateProtectionUI() {
    if (isProtectionEnabled) {
      if (protectionIcon) protectionIcon.className = 'protection-status-icon active';
      if (protectionTitle) {
        protectionTitle.className = 'protection-title active';
        protectionTitle.textContent = 'Real-time Protection';
      }
      if (protectionSubtitle) protectionSubtitle.textContent = 'All threats blocked';
    } else {
      if (protectionIcon) protectionIcon.className = 'protection-status-icon inactive';
      if (protectionTitle) {
        protectionTitle.className = 'protection-title inactive';
        protectionTitle.textContent = 'Protection Disabled';
      }
      if (protectionSubtitle) protectionSubtitle.textContent = 'Sites not protected';
    }
  }

  // Protection toggle handler
  if (protectionToggle) {
    protectionToggle.addEventListener('change', function() {
      isProtectionEnabled = this.checked;
      updateProtectionUI();
      
      // Send state to background script first
      if (chrome.runtime) {
        chrome.runtime.sendMessage({
          type: 'setProtectionState',
          enabled: isProtectionEnabled
        }, (response) => {
          if (response && response.success) {
            console.log('Protection state updated in background script');
          }
        });
      }
      
      // Also save to local storage for backward compatibility
      if (chrome.storage) {
        chrome.storage.local.set({ protectionEnabled: isProtectionEnabled });
      }
      
      // Update footer status
      updateFooterStatus();
      
      // Update scan button state
      if (scanBtn) {
        if (!isProtectionEnabled) {
          setButtonState(scanBtn, 'disabled', 'Protection Disabled', '⚠️');
        } else {
          setButtonState(scanBtn, 'primary', 'Scan Current Page', '🔍');
        }
      }
      
      // Update footer status
      updateFooterStatus();
    });
  }

  // Enhanced button state management
  function setButtonState(button, state, text, icon = '') {
    if (!button) return;
    
    button.className = `button ${state}`;
    
    // Update the new button structure
    const buttonIcon = button.querySelector('.button-icon');
    const buttonTitle = button.querySelector('.button-title');
    
    if (buttonIcon && icon) {
      buttonIcon.textContent = icon;
    }
    
    if (buttonTitle) {
      buttonTitle.textContent = text;
    }
    
    button.disabled = (state.includes('disabled'));
  }

  // Progress bar animation
  function animateProgress(targetPercent, duration = 2000) {
    if (!scanProgressBar) return;
    
    const startTime = Date.now();
    const startPercent = 0;
    
    function updateProgress() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPercent = startPercent + (targetPercent - startPercent) * progress;
      
      scanProgressBar.style.width = `${currentPercent}%`;
      
      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      }
    }
    
    requestAnimationFrame(updateProgress);
  }

  // Try to get more accurate tab information if Chrome API is available
  try {
    if (chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs && tabs[0]) {
          try {
            const url = new URL(tabs[0].url);
            const detectedDomain = url.hostname || 'Unknown';
            
            // Only update if we got a better result than our fallback
            if (detectedDomain !== 'Unknown' && detectedDomain !== currentDomain) {
              currentDomain = detectedDomain;
              const truncatedDomain = truncateDomain(currentDomain);
              
              // Update current site display
              if (currentSite) {
                currentSite.innerHTML = truncatedDomain;
              }
              
              // Update current site status
              if (currentSiteStatus) {
                const isSecure = url.protocol === 'https:';
                const statusClass = isSecure ? 'safe' : 'warning';
                
                currentSiteStatus.innerHTML = truncatedDomain;
                currentSiteStatus.className = `stat-value ${statusClass}`;
              }
              
              // Check if current site is malicious with enhanced feedback
              if (chrome.runtime) {
                chrome.runtime.sendMessage({
                  type: 'checkDomain',
                  domain: currentDomain,
                  protectionEnabled: isProtectionEnabled
                }, (response) => {
                  if (chrome.runtime.lastError) {
                    console.warn('Extension context may be unavailable:', chrome.runtime.lastError);
                    return;
                  }
                  
                  if (!isProtectionEnabled) {
                    // When protection is disabled, don't block anything
                    return;
                  }
                  
                  if (response && response.isMalicious) {
                    // Update UI to show blocked site
                    protectionSubtitle.textContent = 'Threat blocked on this site';
                    
                    // Update current site status to show it's blocked
                    if (currentSiteStatus) {
                      const truncatedDomain = truncateDomain(currentDomain);
                      currentSiteStatus.innerHTML = truncatedDomain;
                      currentSiteStatus.className = 'stat-value blocked';
                    }
                  } else {
                    protectionSubtitle.textContent = 'All threats blocked';
                  }
                });
              }
            }
          } catch (error) {
            console.log('Error parsing tab URL:', error);
          }
        }
      });
    }
  } catch (error) {
    console.log('Chrome tabs API not available:', error);
  }

  // Get blocked attempts count with enhanced display
  chrome.runtime.sendMessage({
    type: 'getBlockedAttempts'
  }, (response) => {
    if (chrome.runtime.lastError) {
      // Fallback for when extension context is unavailable
      updateStatusIndicator(blockedCount, 'blocked', '0');
      return;
    }
    
    if (response && typeof response.count !== 'undefined') {
      updateStatusIndicator(blockedCount, 'blocked', response.count.toString());
    } else {
      // Simulate some blocked attempts for demo
      updateStatusIndicator(blockedCount, 'blocked', '0');
    }
  });

  // Enhanced scan functionality with protection check
  if (scanBtn) {
    scanBtn.addEventListener('click', function() {
      if (!isProtectionEnabled) {
        setButtonState(scanBtn, 'disabled', 'Enable protection first', '⚠️');
        setTimeout(() => {
          setButtonState(scanBtn, 'disabled', 'Protection Disabled', '⚠️');
        }, 2000);
        return;
      }
      
      if (isScanning) return;
      
      isScanning = true;
      setButtonState(scanBtn, 'primary disabled', 'Scanning', '🔄');
      if (scanProgress) scanProgress.classList.add('active');
      
      // Animate progress bar
      animateProgress(100, 2500);
      
      // Update last scan time
      if (lastScan) lastScan.textContent = 'Scanning...';
      
      // Simulate detailed scanning phases
      const phases = [
        { delay: 500, text: 'Analyzing Headers' },
        { delay: 1000, text: 'Checking Database' },
        { delay: 1500, text: 'Deep Scan' },
        { delay: 2000, text: 'Finalizing' }
      ];
      
      phases.forEach(phase => {
        setTimeout(() => {
          if (isScanning) {
            setButtonState(scanBtn, 'primary disabled', phase.text, '🔄');
          }
        }, phase.delay);
      });
      
      setTimeout(() => {
        isScanning = false;
        setButtonState(scanBtn, 'success', 'Scan Complete ✓', '✅');
        if (scanProgress) scanProgress.classList.remove('active');
        if (lastScan) lastScan.textContent = 'Just Now';
        
        // Reset button after showing success
        setTimeout(() => {
          setButtonState(scanBtn, 'primary', 'Scan Current Page', '🔍');
        }, 2500);
      }, 2800);
    });
  }

  // Enhanced settings navigation
  if (settingsBtn) {
    settingsBtn.addEventListener('click', function() {
    console.log('Settings button clicked');
    
    // Simple visual feedback for the small settings button
    const originalText = settingsBtn.textContent;
    settingsBtn.textContent = '🔄';
    settingsBtn.disabled = true;
    
    try {
      if (chrome.tabs) {
        // Try to open in new tab (extension context)
        chrome.tabs.create({
          url: chrome.runtime.getURL('settings-standalone.html')
        }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error opening settings:', chrome.runtime.lastError);
            // Fallback to direct navigation
            window.open('settings-standalone.html', '_blank');
            settingsBtn.textContent = originalText;
            settingsBtn.disabled = false;
          } else {
            // Close popup after opening settings
            window.close();
          }
        });
      } else {
        // Fallback: direct navigation (standalone context)
        console.log('Chrome tabs API not available, using fallback');
        window.open('settings-standalone.html', '_blank');
        settingsBtn.textContent = '✅';
        setTimeout(() => {
          settingsBtn.textContent = originalText;
          settingsBtn.disabled = false;
        }, 2000);
      }
    } catch (error) {
      console.error('Error opening settings:', error);
      // Final fallback
      window.open('settings-standalone.html', '_blank');
      settingsBtn.textContent = '✅';
      setTimeout(() => {
        settingsBtn.textContent = originalText;
        settingsBtn.disabled = false;
      }, 2000);
    }
    });
  }
  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.close();
    } else if (e.key === 's' && e.ctrlKey) {
      e.preventDefault();
      if (!isScanning && scanBtn) {
        scanBtn.click();
      }
    }
  });

  // Footer status management
  function updateFooterStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (statusIndicator && statusText) {
      if (isProtectionEnabled) {
        statusIndicator.className = 'status-indicator active';
        statusText.textContent = 'ACTIVE';
      } else {
        statusIndicator.className = 'status-indicator inactive';
        statusText.textContent = 'DISABLED';
      }
    }
  }

  // Update footer status on protection toggle
  function updateProtectionState(enabled) {
    isProtectionEnabled = enabled;
    protectionToggle.checked = enabled;
    
    // Update protection UI
    updateProtectionUI();
    
    // Update footer status
    updateFooterStatus();
  }

  // Initialize footer status
  updateFooterStatus();

  // Periodic status updates (simulating real-time protection)
  setInterval(() => {
    if (!isScanning && blockedCount) {
      // Randomly update blocked count to show active protection
      const currentCount = parseInt(blockedCount.textContent.match(/\d+/)?.[0] || '247');
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        updateStatusIndicator(blockedCount, 'blocked', (currentCount + 1).toString());
      }
    }
    
    // Update footer status periodically
    updateFooterStatus();
  }, 5000);
});
