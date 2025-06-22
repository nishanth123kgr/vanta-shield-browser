// Content script for Vanta Shield Chrome Extension
console.log('Vanta Shield content script loaded');

// Add protection indicators to legitimate sites
const currentDomain = window.location.hostname;

if (currentDomain && 
    !currentDomain.includes('chrome-extension://') && 
    !window.location.href.startsWith('chrome://') &&
    !window.location.href.startsWith('moz-extension://') &&
    !window.location.href.startsWith('about:') &&
    !window.location.href.startsWith('file://')) {
  // Add a small protection indicator
  const indicator = document.createElement('div');
  indicator.id = 'vanta-shield-indicator';
  indicator.innerHTML = `
    <div style="
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 999999;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 12px;
      font-family: monospace;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    ">
      🛡️ Protected by Vanta Shield
    </div>
  `;
  
  // Add to page after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(indicator);
    });
  } else {
    document.body.appendChild(indicator);
  }
  
  // Remove indicator after 3 seconds
  setTimeout(() => {
    const elem = document.getElementById('vanta-shield-indicator');
    if (elem) {
      elem.style.opacity = '0';
      elem.style.transition = 'opacity 0.5s';
      setTimeout(() => elem.remove(), 500);
    }
  }, 3000);
}
