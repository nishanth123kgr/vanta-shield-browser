// Test script for whitelist functionality
console.log('Testing whitelist functionality...');

// Test the hash function
async function testHashFunction() {
    // Define the same hash function as in background.js
    async function hashHostname(hostname) {
        const encoder = new TextEncoder();
        const data = encoder.encode(hostname);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        return hashHex;
    }
    
    const testDomain = "example.com";
    const hash = await hashHostname(testDomain);
    console.log(`Hash for ${testDomain}: ${hash}`);
    
    // Test storage key format
    const storageKey = `vanta_${hash}`;
    console.log(`Storage key: ${storageKey}`);
}

testHashFunction();
