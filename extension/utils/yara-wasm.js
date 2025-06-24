import Yara from 'libyara-wasm';

// Global YARA instance and compiled rules cache
let yaraInstance = null;
let compiledRulesCache = null;
let isInitialized = false;

// Initialize YARA engine
async function initializeYara() {
    if (isInitialized && yaraInstance) {
        return yaraInstance;
    }

    try {
        console.log('Initializing YARA WebAssembly engine...');
        yaraInstance = await Yara();
        isInitialized = true;
        console.log('YARA engine initialized successfully');
        return yaraInstance;
    } catch (error) {
        console.error('Failed to initialize YARA engine:', error);
        throw new Error(`YARA initialization failed: ${error.message}`);
    }
}

// Cleanup YARA resources
function cleanupYara() {
    if (yaraInstance) {
        try {
            yaraInstance.destroy();
        } catch (error) {
            console.warn('Error during YARA cleanup:', error);
        }
        yaraInstance = null;
        compiledRulesCache = null;
        isInitialized = false;
    }
}

// Parse rule metadata from YARA output
function parseRuleMetadata(metaString) {
    if (!metaString) return {};

    const metadata = {};
    const metaRegex = /(\w+):\s*([^,\]]+)(?:,|])/g;
    let match;

    while ((match = metaRegex.exec(metaString)) !== null) {
        metadata[match[1].trim()] = match[2].trim();
    }

    return metadata;
}

// Parse match details from YARA output
function parseMatchDetails(matchString) {
    const details = {};

    if (matchString.includes('Pos ')) {
        details.position = parseInt(matchString.match(/Pos (\d+)/)[1]);
    }

    if (matchString.includes('length ')) {
        details.length = parseInt(matchString.match(/length (\d+)/)[1]);
    }

    if (matchString.includes('identifier ')) {
        details.identifier = matchString.match(/identifier ([^,]+)/)[1];
    }

    if (matchString.includes('data: "')) {
        details.data = matchString.match(/data: "([^"]+)"/)[1];
    }

    return details;
}

// Convert YARA text output to structured JSON
function parseYaraOutputToJson(outputText) {
    const result = {
        matched_rules: [],
        summary: {
            rules_matched: 0,
            total_matches: 0,
            warnings: 0,
            errors: 0
        },
        warnings: [],
        errors: []
    };

    // Parse the output by lines
    const lines = outputText.split('\n');
    let currentRule = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines
        if (!line) continue;

        // Handle errors
        if (line.startsWith('❌ Error')) {
            result.errors.push({
                message: line.substring(2).trim(),
                type: "error"
            });
            continue;
        }

        // Handle warnings
        if (line.startsWith('⚠️ Warning')) {
            result.warnings.push({
                message: line.substring(2).trim(),
                type: "warning"
            });
            continue;
        }

        // Handle console messages
        if (line.startsWith('📋')) {
            // Console messages can be ignored for JSON output
            continue;
        }

        // Handle rule matches
        if (line.startsWith('🔍 Rule') || line.startsWith('🔍 Input matches rule')) {
            // Start of a new rule match

            // Save the previous rule if it exists
            if (currentRule) {
                result.matched_rules.push(currentRule);
            }

            // Extract rule name
            const ruleNameMatch = line.match(/"([^"]+)"/);
            if (!ruleNameMatch) continue;

            const ruleName = ruleNameMatch[1];

            // Extract metadata if present
            let metadata = {};
            const metaMatch = line.match(/\[(.*?)\]/);
            if (metaMatch) {
                metadata = parseRuleMetadata(metaMatch[1]);
            }

            // Extract match count if present
            let matchCount = 0;
            const countMatch = line.match(/\((\d+) (?:time|match)/);
            if (countMatch) {
                matchCount = parseInt(countMatch[1]);
            }

            currentRule = {
                rule_name: ruleName,
                metadata: metadata,
                match_count: matchCount,
                matches: []
            };

            // Add to summary counts
            result.summary.rules_matched++;
            result.summary.total_matches += matchCount;

            continue;
        }

        // Handle individual matches
        if (line.startsWith('  • Pos') && currentRule) {
            const matchDetails = parseMatchDetails(line);
            currentRule.matches.push(matchDetails);
        }
    }

    // Add the last rule if it exists
    if (currentRule) {
        result.matched_rules.push(currentRule);
    }

    // Set summary counts
    result.summary.warnings = result.warnings.length;
    result.summary.errors = result.errors.length;

    return result;
}

async function loadRules() {
    try {
        // Try to load from cache first
        if (compiledRulesCache) {
            return compiledRulesCache;
        }

        console.log('Loading YARA rules from rules.yar...');
        
        // Determine the correct URL for the rules file
        let rulesUrl = './rules.yar';
        
        // In Chrome extension context, use chrome.runtime.getURL
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
            rulesUrl = chrome.runtime.getURL('rules.yar');
        }
        // In web context, check if we're in the extension directory
        else if (window.location.protocol === 'chrome-extension:') {
            rulesUrl = chrome.runtime.getURL('rules.yar');
        }
        
        const response = await fetch(rulesUrl);
        if (!response.ok) {
            throw new Error(`Failed to load rules from ${rulesUrl}: ${response.status} ${response.statusText}`);
        }
        
        const rulesText = await response.text();
        
        if (!rulesText || rulesText.trim().length === 0) {
            throw new Error('Rules file is empty or invalid');
        }

        // Validate the rules format
        const validation = validateYaraRules(rulesText);
        
        // Cache the rules
        compiledRulesCache = validation.rulesText;
        console.log(`Loaded and validated ${validation.valid}/${validation.total} YARA rules`);
        
        return validation.rulesText;
    } catch (error) {
        console.error('Error loading YARA rules:', error);
        throw new Error(`Failed to load YARA rules: ${error.message}`);
    }
}

// Validate YARA rules format
function validateYaraRules(rulesText) {
    if (!rulesText || typeof rulesText !== 'string') {
        throw new Error('Rules text is empty or not a string');
    }

    // Basic YARA rule format validation
    const rulePattern = /rule\s+\w+\s*\{[\s\S]*?\}/g;
    const rules = rulesText.match(rulePattern);
    
    if (!rules || rules.length === 0) {
        throw new Error('No valid YARA rules found in the rules file');
    }

    // Check for basic required sections in rules
    let validRules = 0;
    for (const rule of rules) {
        if (rule.includes('condition:') && (rule.includes('strings:') || rule.includes('meta:'))) {
            validRules++;
        }
    }

    if (validRules === 0) {
        throw new Error('No rules with valid structure (meta/strings + condition) found');
    }

    console.log(`Validated ${validRules} valid YARA rules out of ${rules.length} total rules`);
    return {
        total: rules.length,
        valid: validRules,
        rulesText: rulesText
    };
}

// Validate file input (supports File objects, Blobs, and ArrayBuffers)
function validateFileInput(input, fileName = 'unknown') {
    if (!input) {
        throw new Error('No file data provided for analysis');
    }

    let size;
    if (input instanceof File) {
        size = input.size;
    } else if (input instanceof Blob) {
        size = input.size;
    } else if (input instanceof ArrayBuffer) {
        size = input.byteLength;
    } else if (input instanceof Uint8Array) {
        size = input.length;
    } else {
        throw new Error('Unsupported file input type. Expected File, Blob, ArrayBuffer, or Uint8Array');
    }

    const maxFileSize = 50 * 1024 * 1024; // 50MB limit
    if (size > maxFileSize) {
        throw new Error(`File too large: ${size} bytes (max: ${maxFileSize} bytes)`);
    }

    return { size, fileName };
}

// Convert various input types to Uint8Array for YARA processing
async function convertToUint8Array(input) {
    if (input instanceof Uint8Array) {
        return input;
    } else if (input instanceof ArrayBuffer) {
        return new Uint8Array(input);
    } else if (input instanceof Blob || input instanceof File) {
        const arrayBuffer = await input.arrayBuffer();
        return new Uint8Array(arrayBuffer);
    } else {
        throw new Error('Cannot convert input to Uint8Array');
    }
}


async function analyzeYara(input, fileName = 'unknown') {
    try {
        // Validate input (supports File, Blob, ArrayBuffer, Uint8Array)
        const validation = validateFileInput(input, fileName);

        // Initialize YARA if not already done
        await initializeYara();

        console.log(`Starting YARA analysis of file: ${validation.fileName} (${validation.size} bytes)`);
        
        // Convert input to Uint8Array for YARA processing
        const fileUint8Array = await convertToUint8Array(input);
        const rulesText = await loadRules();

        console.log('YARA rules preview:', rulesText.substring(0, 200) + '...');

        if (!yaraInstance) {
            throw new Error('YARA instance not initialized');
        }

        // Run YARA scan with timeout
        const scanPromise = yaraInstance.run(fileUint8Array, rulesText);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('YARA scan timeout')), 30000) // 30 second timeout
        );

        const result = await Promise.race([scanPromise, timeoutPromise]);
        console.log('YARA scan completed successfully');

        // Process the result into a more descriptive format
        let yaraOutputText = processYaraOutput(result);

        // Parse the output into structured JSON
        const jsonResults = parseYaraOutputToJson(yaraOutputText);

        // Add scan metadata
        jsonResults.scan_info = {
            file_name: validation.fileName,
            file_size: validation.size,
            scan_timestamp: new Date().toISOString(),
            engine_version: 'libyara-wasm'
        };

        console.log(`YARA analysis complete: ${jsonResults.summary.rules_matched} rules matched`);
        return jsonResults;

    } catch (error) {
        console.error('Error during YARA analysis:', error);
        
        // Return error result in consistent format
        return {
            matched_rules: [],
            summary: {
                rules_matched: 0,
                total_matches: 0,
                warnings: 0,
                errors: 1
            },
            warnings: [],
            errors: [{
                message: error.message,
                type: "scan_error",
                timestamp: new Date().toISOString()
            }],
            scan_info: {
                file_name: fileName,
                file_size: input?.size || input?.byteLength || input?.length || 0,
                scan_timestamp: new Date().toISOString(),
                engine_version: 'libyara-wasm',
                status: 'failed'
            }
        };
    }
}

// Scan raw binary data, Blobs, or ArrayBuffers
async function scanBinaryData(input, fileName = 'unknown') {
    try {
        // Validate and convert input to Uint8Array
        const validation = validateFileInput(input, fileName);
        const binaryData = await convertToUint8Array(input);

        // Initialize YARA if not already done
        await initializeYara();

        console.log(`Starting YARA analysis of binary data: ${validation.fileName} (${validation.size} bytes)`);
        
        const rulesText = await loadRules();

        if (!yaraInstance) {
            throw new Error('YARA instance not initialized');
        }

        // Run YARA scan
        const result = await yaraInstance.run(binaryData, rulesText);
        console.log('YARA scan completed successfully');

        // Process the result
        let yaraOutputText = processYaraOutput(result);
        const jsonResults = parseYaraOutputToJson(yaraOutputText);

        // Add scan metadata
        jsonResults.scan_info = {
            file_name: validation.fileName,
            file_size: validation.size,
            scan_timestamp: new Date().toISOString(),
            engine_version: 'libyara-wasm'
        };

        return jsonResults;

    } catch (error) {
        console.error('Error during binary data YARA analysis:', error);
        
        return {
            matched_rules: [],
            summary: {
                rules_matched: 0,
                total_matches: 0,
                warnings: 0,
                errors: 1
            },
            warnings: [],
            errors: [{
                message: error.message,
                type: "scan_error",
                timestamp: new Date().toISOString()
            }],
            scan_info: {
                file_name: fileName,
                file_size: binaryData?.length || 0,
                scan_timestamp: new Date().toISOString(),
                engine_version: 'libyara-wasm',
                status: 'failed'
            }
        };
    }
}

// Process raw YARA result into text format
function processYaraOutput(resp) {
    if (!resp) {
        return 'No YARA response received';
    }

    let outputText = '';

    try {
        // Handle compile errors and warnings
        if (resp.compileErrors && resp.compileErrors.size() > 0) {
            for (let i = 0; i < resp.compileErrors.size(); i++) {
                const compileError = resp.compileErrors.get(i);
                if (!compileError.warning) {
                    outputText += `❌ Error on line ${compileError.lineNumber}: ${compileError.message}\n`;
                } else {
                    outputText += `⚠️ Warning on line ${compileError.lineNumber}: ${compileError.message}\n`;
                }
            }
        }

        // Show console messages if they exist
        if (resp.consoleLogs && resp.consoleLogs.size() > 0) {
            const consoleLogs = resp.consoleLogs;
            for (let i = 0; i < consoleLogs.size(); i++) {
                outputText += `📋 ${consoleLogs.get(i)}\n`;
            }
        }

        // Process matched rules
        if (resp.matchedRules && resp.matchedRules.size() > 0) {
            const matchedRules = resp.matchedRules;
            for (let i = 0; i < matchedRules.size(); i++) {
                const rule = matchedRules.get(i);
                const matches = rule.resolvedMatches;

                // Process metadata
                let meta = "";
                if (rule.metadata && rule.metadata.size() > 0) {
                    meta += " [";
                    for (let j = 0; j < rule.metadata.size(); j++) {
                        const metadata = rule.metadata.get(j);
                        meta += `${metadata.identifier}: ${metadata.data}, `;
                    }
                    meta = meta.slice(0, -2) + "]";
                }

                // Process matches
                const matchesSize = matches.size();
                const countString = matchesSize === 0 ? "" : ` (${matchesSize} match${matchesSize > 1 ? "es" : ""})`;

                if (matchesSize === 0) {
                    outputText += `🔍 Input matches rule "${rule.ruleName}"${meta}${countString.length > 0 ? ` ${countString}` : ""}.\n`;
                } else {
                    outputText += `🔍 Rule "${rule.ruleName}"${meta} matches${countString}:\n`;
                    for (let j = 0; j < matchesSize; j++) {
                        const match = matches.get(j);
                        outputText += `  • Pos ${match.location}, length ${match.matchLength}, identifier ${match.stringIdentifier}, data: "${match.data}"\n`;
                    }
                }
            }
        } else {
            outputText += '✅ No malicious patterns detected\n';
        }

    } catch (error) {
        console.error('Error processing YARA output:', error);
        outputText += `❌ Error processing YARA result: ${error.message}\n`;
    }

    return outputText;
}

// Health check function
async function checkYaraHealth() {
    try {
        await initializeYara();
        const testData = new Uint8Array([0x4D, 0x5A]); // PE header bytes
        const simpleRule = 'rule test_rule { strings: $a = { 4D 5A } condition: $a }';
        
        const result = await yaraInstance.run(testData, simpleRule);
        
        return {
            status: 'healthy',
            initialized: isInitialized,
            test_passed: result && result.matchedRules && result.matchedRules.size() > 0,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            initialized: isInitialized,
            test_passed: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Utility function to scan URL content (for use in background scripts)
async function scanUrlContent(url, content) {
    try {
        if (!content || typeof content !== 'string') {
            throw new Error('Invalid content provided for URL scanning');
        }

        // Convert string content to Uint8Array
        const encoder = new TextEncoder();
        const binaryData = encoder.encode(content);

        const result = await scanBinaryData(binaryData, url);
        
        // Add URL-specific metadata
        result.scan_info.url = url;
        result.scan_info.content_type = 'text/html';
        
        return result;
    } catch (error) {
        console.error('Error scanning URL content:', error);
        return {
            matched_rules: [],
            summary: {
                rules_matched: 0,
                total_matches: 0,
                warnings: 0,
                errors: 1
            },
            warnings: [],
            errors: [{
                message: error.message,
                type: "url_scan_error",
                timestamp: new Date().toISOString()
            }],
            scan_info: {
                url: url,
                content_type: 'text/html',
                scan_timestamp: new Date().toISOString(),
                engine_version: 'libyara-wasm',
                status: 'failed'
            }
        };
    }
}

// Convenient function for Chrome extension blob scanning
async function scanBlob(blob, fileName = 'downloaded_file') {
    if (!(blob instanceof Blob)) {
        throw new Error('Input must be a Blob object');
    }
    
    console.log(`Scanning blob: ${fileName} (${blob.size} bytes, type: ${blob.type})`);
    return await analyzeYara(blob, fileName);
}

// Scan content from a Chrome extension message/response
async function scanChromeExtensionContent(data, metadata = {}) {
    try {
        const fileName = metadata.fileName || metadata.url || 'chrome_content';
        const contentType = metadata.contentType || 'application/octet-stream';
        
        let input;
        
        // Handle different data formats from Chrome extension
        if (typeof data === 'string') {
            // Convert string to Blob
            input = new Blob([data], { type: contentType });
        } else if (data instanceof ArrayBuffer) {
            input = data;
        } else if (data instanceof Uint8Array) {
            input = data;
        } else if (data instanceof Blob) {
            input = data;
        } else if (Array.isArray(data)) {
            // Convert array of bytes to Uint8Array
            input = new Uint8Array(data);
        } else {
            throw new Error('Unsupported data format for Chrome extension content');
        }
        
        return await analyzeYara(input, fileName);
        
    } catch (error) {
        console.error('Error scanning Chrome extension content:', error);
        throw error;
    }
}

// Function to check if content contains suspicious patterns
function containsSuspiciousPatterns(yaraResult) {
    if (!yaraResult || !yaraResult.matched_rules) {
        return false;
    }

    // Check for high-severity rules
    const highSeverityKeywords = [
        'malware', 'trojan', 'virus', 'backdoor', 'keylogger', 
        'ransomware', 'spyware', 'adware', 'rootkit', 'botnet',
        'phishing', 'exploit', 'shellcode', 'injection'
    ];

    for (const rule of yaraResult.matched_rules) {
        const ruleName = rule.rule_name.toLowerCase();
        const metadata = rule.metadata || {};
        
        // Check rule name for suspicious patterns
        if (highSeverityKeywords.some(keyword => ruleName.includes(keyword))) {
            return true;
        }

        // Check metadata for severity indicators
        if (metadata.severity && ['high', 'critical'].includes(metadata.severity.toLowerCase())) {
            return true;
        }

        // Check for specific threat types in metadata
        if (metadata.threat_type && highSeverityKeywords.includes(metadata.threat_type.toLowerCase())) {
            return true;
        }
    }

    return yaraResult.summary.rules_matched > 0;
}

// Generate a threat assessment report
function generateThreatAssessment(yaraResult) {
    const assessment = {
        is_threat: false,
        risk_level: 'low',
        threat_types: [],
        recommendations: [],
        details: {
            rules_triggered: yaraResult.summary.rules_matched,
            total_matches: yaraResult.summary.total_matches,
            scan_errors: yaraResult.summary.errors
        }
    };

    if (yaraResult.summary.rules_matched === 0) {
        assessment.recommendations.push('No malicious patterns detected. Content appears safe.');
        return assessment;
    }

    assessment.is_threat = containsSuspiciousPatterns(yaraResult);

    // Analyze matched rules for threat types and risk level
    let highRiskCount = 0;
    const threatTypes = new Set();

    for (const rule of yaraResult.matched_rules) {
        const ruleName = rule.rule_name.toLowerCase();
        const metadata = rule.metadata || {};

        // Extract threat types
        if (ruleName.includes('malware') || metadata.threat_type === 'malware') {
            threatTypes.add('malware');
            highRiskCount++;
        }
        if (ruleName.includes('phishing') || metadata.threat_type === 'phishing') {
            threatTypes.add('phishing');
            highRiskCount++;
        }
        if (ruleName.includes('trojan') || metadata.threat_type === 'trojan') {
            threatTypes.add('trojan');
            highRiskCount++;
        }
        if (ruleName.includes('exploit') || metadata.threat_type === 'exploit') {
            threatTypes.add('exploit');
            highRiskCount++;
        }

        // Check metadata severity
        if (metadata.severity === 'high' || metadata.severity === 'critical') {
            highRiskCount++;
        }
    }

    assessment.threat_types = Array.from(threatTypes);

    // Determine risk level
    if (highRiskCount > 2 || yaraResult.summary.rules_matched > 5) {
        assessment.risk_level = 'high';
        assessment.recommendations.push('⚠️ High risk content detected. Block access immediately.');
        assessment.recommendations.push('🔒 Run additional security scans if file was downloaded.');
    } else if (highRiskCount > 0 || yaraResult.summary.rules_matched > 2) {
        assessment.risk_level = 'medium';
        assessment.recommendations.push('⚠️ Potentially suspicious content detected. Proceed with caution.');
        assessment.recommendations.push('🔍 Consider additional verification before trusting this content.');
    } else {
        assessment.risk_level = 'low';
        assessment.recommendations.push('ℹ️ Some patterns detected but risk appears minimal.');
    }

    return assessment;
}

// Export the analyzeYara function so it can be imported by other modules
export { 
    analyzeYara, 
    scanBinaryData,
    scanUrlContent,
    scanBlob,
    scanChromeExtensionContent,
    initializeYara, 
    cleanupYara, 
    checkYaraHealth,
    loadRules,
    validateYaraRules,
    validateFileInput,
    convertToUint8Array,
    containsSuspiciousPatterns,
    generateThreatAssessment
};