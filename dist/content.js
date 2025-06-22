// Content script for Halonex Vanta Chrome Extension
console.log('Halonex Vanta content script loaded');

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
    <div id="vanta-indicator-main" style="
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 2147483647;
      background: linear-gradient(135deg, 
        rgba(16, 185, 129, 0.9) 0%, 
        rgba(5, 150, 105, 0.9) 50%, 
        rgba(4, 120, 87, 0.9) 100%);
      backdrop-filter: blur(16px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-weight: 600;
      box-shadow: 
        0 8px 32px rgba(16, 185, 129, 0.25),
        0 4px 16px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: default;
      user-select: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateZ(0);
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: radial-gradient(circle, #34d399 0%, #10b981 100%);
        border-radius: 50%;
        animation: vanta-pulse 2s ease-in-out infinite;
        box-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
      "></div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));">
        <path d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
      </svg>
      <span style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        font-size: 11px; 
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        letter-spacing: 0.5px;
      ">VANTA</span>
    </div>
    <style>
      @keyframes vanta-pulse {
        0%, 100% { 
          opacity: 1; 
          transform: scale(1); 
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
        }
        50% { 
          opacity: 0.7; 
          transform: scale(1.3); 
          box-shadow: 0 0 16px rgba(52, 211, 153, 0.8);
        }
      }
      
      @media (prefers-color-scheme: light) {
        #vanta-indicator-main {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(248, 250, 252, 0.95) 100%) !important;
          color: #1f2937 !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 4px 16px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
        }
        #vanta-indicator-main span {
          text-shadow: none !important;
        }
      }
      
      #vanta-indicator-main:hover {
        transform: translateY(-1px) translateZ(0);
        box-shadow: 
          0 12px 40px rgba(16, 185, 129, 0.3),
          0 6px 20px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
      }
      
      @media (prefers-color-scheme: light) {
        #vanta-indicator-main:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.12),
            0 6px 20px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 1) !important;
        }
      }
    </style>
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
