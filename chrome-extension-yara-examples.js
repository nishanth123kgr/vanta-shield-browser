// Chrome Extension YARA Integration Example
// This demonstrates how to use YARA scanning with blobs in a Chrome extension

import { 
    scanBlob, 
    scanChromeExtensionContent, 
    initializeYara, 
    analyzeYara 
} from './yara-wasm.js';

// Initialize YARA engine when extension loads
let yaraReady = false;

async function initYaraEngine() {
    if (!yaraReady) {
        try {
            await initializeYara();
            yaraReady = true;
            console.log('✅ YARA engine ready for Chrome extension');
        } catch (error) {
            console.error('❌ Failed to initialize YARA:', error);
        }
    }
}

// Example 1: Scan downloaded file blob
async function scanDownloadedFile(blob, fileName) {
    try {
        console.log(`🔍 Scanning downloaded file: ${fileName}`);
        const results = await scanBlob(blob, fileName);
        
        if (results.summary.rules_matched > 0) {
            console.warn(`⚠️ Threats detected in ${fileName}:`, results.matched_rules);
            // Block download or show warning
            return { threat: true, results };
        } else {
            console.log(`✅ File ${fileName} is clean`);
            return { threat: false, results };
        }
    } catch (error) {
        console.error('Error scanning downloaded file:', error);
        return { threat: false, error: error.message };
    }
}

// Example 2: Scan web content
async function scanWebContent(content, url) {
    try {
        const metadata = {
            fileName: new URL(url).hostname,
            url: url,
            contentType: 'text/html'
        };
        
        const results = await scanChromeExtensionContent(content, metadata);
        
        if (results.summary.rules_matched > 0) {
            console.warn(`⚠️ Malicious content detected on ${url}:`, results.matched_rules);
            return { threat: true, results };
        }
        
        return { threat: false, results };
    } catch (error) {
        console.error('Error scanning web content:', error);
        return { threat: false, error: error.message };
    }
}

// Example 3: Scan binary data from fetch response
async function scanFetchResponse(response, url) {
    try {
        const blob = await response.blob();
        const fileName = url.split('/').pop() || 'fetched_content';
        
        return await scanDownloadedFile(blob, fileName);
    } catch (error) {
        console.error('Error scanning fetch response:', error);
        return { threat: false, error: error.message };
    }
}

// Example 4: Integration with Chrome downloads API
chrome.downloads?.onCreated?.addListener(async (downloadItem) => {
    if (!yaraReady) {
        await initYaraEngine();
    }
    
    // Wait for download to complete
    chrome.downloads.onChanged.addListener(async (delta) => {
        if (delta.id === downloadItem.id && delta.state?.current === 'complete') {
            try {
                // Read the downloaded file
                const fileResponse = await fetch(`file://${downloadItem.filename}`);
                const blob = await fileResponse.blob();
                
                const scanResult = await scanDownloadedFile(blob, downloadItem.filename);
                
                if (scanResult.threat) {
                    // Show notification or block file
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'shield.png',
                        title: 'Malware Detected!',
                        message: `Threats found in ${downloadItem.filename}`
                    });
                    
                    // Optionally remove the dangerous file
                    chrome.downloads.removeFile(downloadItem.id);
                }
            } catch (error) {
                console.error('Error scanning downloaded file:', error);
            }
        }
    });
});

// Example 5: Content script integration
function setupContentScriptScanning() {
    // Listen for messages from content scripts
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.action === 'scanContent') {
            if (!yaraReady) {
                await initYaraEngine();
            }
            
            try {
                const result = await scanWebContent(message.content, sender.tab.url);
                sendResponse(result);
            } catch (error) {
                sendResponse({ threat: false, error: error.message });
            }
        }
    });
}

// Example 6: Scan clipboard content
async function scanClipboardContent() {
    try {
        const clipboardData = await navigator.clipboard.readText();
        
        if (clipboardData.length > 1000) { // Only scan substantial content
            const metadata = {
                fileName: 'clipboard_content',
                contentType: 'text/plain'
            };
            
            const result = await scanChromeExtensionContent(clipboardData, metadata);
            
            if (result.summary.rules_matched > 0) {
                console.warn('⚠️ Suspicious content detected in clipboard');
                return result;
            }
        }
        
        return { threat: false };
    } catch (error) {
        console.error('Error scanning clipboard:', error);
        return { threat: false, error: error.message };
    }
}

// Usage examples for different data formats:

// 1. ArrayBuffer from fetch
async function example1() {
    const response = await fetch('https://example.com/file.bin');
    const arrayBuffer = await response.arrayBuffer();
    const result = await analyzeYara(arrayBuffer, 'example_file.bin');
    console.log('ArrayBuffer scan result:', result);
}

// 2. Uint8Array from processing
async function example2() {
    const binaryData = new Uint8Array([0x4D, 0x5A, 0x90, 0x00]); // PE header
    const result = await analyzeYara(binaryData, 'test_binary');
    console.log('Uint8Array scan result:', result);
}

// 3. Blob from file input or download
async function example3() {
    const blob = new Blob(['test content'], { type: 'text/plain' });
    const result = await scanBlob(blob, 'test_file.txt');
    console.log('Blob scan result:', result);
}

// Initialize when extension loads
initYaraEngine();
setupContentScriptScanning();

// Export functions for use in other extension scripts
export {
    scanDownloadedFile,
    scanWebContent,
    scanFetchResponse,
    scanClipboardContent,
    initYaraEngine
};
