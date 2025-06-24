// YARA Integration Example for Chrome Extension Background Script
// This shows how to integrate the enhanced yara-wasm.js with your existing threat detection

import { 
    initializeYara, 
    scanUrlContent, 
    generateThreatAssessment,
    checkYaraHealth 
} from './yara-wasm.js';

class VantaShieldYaraIntegration {
    constructor() {
        this.yaraInitialized = false;
        this.lastHealthCheck = null;
        this.healthCheckInterval = 5 * 60 * 1000; // 5 minutes
    }

    async initialize() {
        try {
            console.log('🔧 Initializing Vanta Shield YARA integration...');
            
            // Initialize YARA engine
            await initializeYara();
            this.yaraInitialized = true;
            
            // Run initial health check
            await this.performHealthCheck();
            
            // Set up periodic health checks
            setInterval(() => this.performHealthCheck(), this.healthCheckInterval);
            
            console.log('✅ Vanta Shield YARA integration initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize YARA integration:', error);
            this.yaraInitialized = false;
            return false;
        }
    }

    async performHealthCheck() {
        try {
            const health = await checkYaraHealth();
            this.lastHealthCheck = health;
            
            if (health.status !== 'healthy') {
                console.warn('⚠️ YARA engine health check failed:', health);
                this.yaraInitialized = false;
            }
            
            return health;
        } catch (error) {
            console.error('❌ Health check error:', error);
            this.yaraInitialized = false;
            return { status: 'error', error: error.message };
        }
    }

    async enhancedThreatCheck(hostName, pageContent = null) {
        try {
            // Your existing API-based threat detection
            const hashedHostname = await this.hashHostname(hostName);
            let isThreat = await this.getCachedThreatStatus(hashedHostname);
            
            if (isThreat === null) {
                const req = await fetch(`https://api.vanta.halonex.app/block/phishing/sha256/${hashedHostname}`);
                const phishing = await req.text();
                isThreat = phishing.trim() === "true";
                await this.cacheThreatStatus(hashedHostname, isThreat);
            }

            // Enhanced YARA-based content analysis
            let yaraResult = null;
            let yaraAssessment = null;

            if (this.yaraInitialized && pageContent) {
                try {
                    console.log(`🔍 Running YARA analysis on ${hostName}...`);
                    yaraResult = await scanUrlContent(hostName, pageContent);
                    yaraAssessment = generateThreatAssessment(yaraResult);
                    
                    // Update threat status based on YARA results
                    if (yaraAssessment.is_threat && yaraAssessment.risk_level === 'high') {
                        isThreat = true;
                        console.log(`🚨 YARA detected high-risk content on ${hostName}`);
                    }
                } catch (yaraError) {
                    console.warn('⚠️ YARA scan failed, falling back to API-only detection:', yaraError);
                }
            }

            return {
                isThreat,
                source: isThreat ? (yaraAssessment?.is_threat ? 'yara+api' : 'api') : 'none',
                yaraResult,
                yaraAssessment,
                hostName,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Enhanced threat check failed:', error);
            return {
                isThreat: false,
                source: 'error',
                error: error.message,
                hostName,
                timestamp: new Date().toISOString()
            };
        }
    }

    async handleWebRequest(details) {
        try {
            const url = new URL(details.url);
            const hostName = url.hostname;

            // Skip non-HTTP(S) requests
            if (!['http:', 'https:'].includes(url.protocol)) {
                return;
            }

            // For main frame requests, perform enhanced threat checking
            if (details.type === 'main_frame') {
                // You might want to fetch page content here for YARA analysis
                // This depends on your extension's permissions and architecture
                const threatInfo = await this.enhancedThreatCheck(hostName);
                
                if (threatInfo.isThreat) {
                    console.log(`🛡️ Threat detected on ${hostName}:`, threatInfo);
                    
                    // Block the request or show warning
                    this.handleThreatDetected(details, threatInfo);
                }
            }

        } catch (error) {
            console.error('❌ Error handling web request:', error);
        }
    }

    handleThreatDetected(requestDetails, threatInfo) {
        // Your existing threat handling logic
        console.log(`🚨 Blocking threat: ${requestDetails.url}`);
        
        // You can enhance this with YARA-specific information
        if (threatInfo.yaraAssessment) {
            console.log('YARA threat types:', threatInfo.yaraAssessment.threat_types);
            console.log('Risk level:', threatInfo.yaraAssessment.risk_level);
            console.log('Recommendations:', threatInfo.yaraAssessment.recommendations);
        }

        // Block the request or redirect to warning page
        chrome.tabs.update(requestDetails.tabId, {
            url: chrome.runtime.getURL('blocked.html') + '?reason=yara&host=' + encodeURIComponent(requestDetails.url)
        });
    }

    // Utility methods (implement these based on your existing code)
    async hashHostname(hostname) {
        const encoder = new TextEncoder();
        const data = encoder.encode(hostname);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async getCachedThreatStatus(hashedHostname) {
        // Implement your caching logic
        const cached = await chrome.storage.local.get(hashedHostname);
        return cached[hashedHostname] || null;
    }

    async cacheThreatStatus(hashedHostname, isThreat) {
        // Implement your caching logic
        await chrome.storage.local.set({ [hashedHostname]: isThreat });
    }

    getStatus() {
        return {
            yaraInitialized: this.yaraInitialized,
            lastHealthCheck: this.lastHealthCheck,
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize the integration
const yaraIntegration = new VantaShieldYaraIntegration();

// Auto-initialize when the background script loads
yaraIntegration.initialize().then(success => {
    if (success) {
        console.log('🛡️ Vanta Shield with YARA protection is active');
        
        // Set up web request listener with YARA integration
        chrome.webRequest.onBeforeRequest.addListener(
            (details) => yaraIntegration.handleWebRequest(details),
            { urls: ["<all_urls>"] },
            ["blocking"]
        );
    } else {
        console.warn('⚠️ Vanta Shield running without YARA protection (API-only mode)');
    }
});

// Export for use in other parts of the extension
if (typeof window !== 'undefined') {
    window.yaraIntegration = yaraIntegration;
}

export { yaraIntegration };
