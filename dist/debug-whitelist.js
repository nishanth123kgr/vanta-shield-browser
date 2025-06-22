function log(message) {
    const output = document.getElementById('output');
    const timestamp = new Date().toLocaleTimeString();
    output.innerHTML += `[${timestamp}] ${message}<br>`;
    output.scrollTop = output.scrollHeight;
    console.log(message);
}

function testAddDomain() {
    log('Testing addToWhitelist...');
    if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage({
            type: 'addToWhitelist',
            domain: 'test.example.com'
        }, (response) => {
            log('Add response: ' + JSON.stringify(response));
        });
    } else {
        log('Chrome API not available');
    }
}

function testGetDomains() {
    log('Testing getWhitelistedDomains...');
    if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage({
            type: 'getWhitelistedDomains'
        }, (response) => {
            log('Get domains response: ' + JSON.stringify(response, null, 2));
        });
    } else {
        log('Chrome API not available');
    }
}

function testClearWhitelist() {
    log('Clearing all whitelist entries...');
    if (chrome && chrome.storage) {
        chrome.storage.local.get(null, (items) => {
            const keysToRemove = [];
            for (const key in items) {
                if (key.startsWith('vanta_') && 
                    !key.startsWith('vanta_cache_') && 
                    !key.startsWith('vanta_blocked_') &&
                    !key.startsWith('vanta_engine_')) {
                    keysToRemove.push(key);
                }
            }
            if (keysToRemove.length > 0) {
                chrome.storage.local.remove(keysToRemove, () => {
                    log(`Removed ${keysToRemove.length} whitelist entries: ${keysToRemove.join(', ')}`);
                });
            } else {
                log('No whitelist entries found to remove');
            }
        });
    } else {
        log('Chrome storage API not available');
    }
}

function testCheckStorage() {
    log('Checking raw storage contents...');
    if (chrome && chrome.storage) {
        chrome.storage.local.get(null, (items) => {
            log('All storage items:');
            for (const [key, value] of Object.entries(items)) {
                log(`  ${key}: ${JSON.stringify(value)}`);
            }
        });
    } else {
        log('Chrome storage API not available');
    }
}

// Auto-check storage on load
window.onload = () => {
    log('Debug test page loaded');
    testCheckStorage();
};
