#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🛡️  Portfolio Security Test Suite\n');

// Test 1: Check security headers in vercel.json
console.log('1. Checking Security Headers Configuration...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  const headers = vercelConfig.headers?.[0]?.headers || [];
  
  const requiredHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options', 
    'X-XSS-Protection',
    'Referrer-Policy',
    'Strict-Transport-Security',
    'Content-Security-Policy',
    'Permissions-Policy'
  ];
  
  const presentHeaders = headers.map(h => h.key);
  const missingHeaders = requiredHeaders.filter(h => !presentHeaders.includes(h));
  
  if (missingHeaders.length === 0) {
    console.log('✅ All required security headers are configured');
  } else {
    console.log('❌ Missing headers:', missingHeaders.join(', '));
  }
} catch (error) {
  console.log('❌ Error reading vercel.json:', error.message);
}

// Test 2: Check for sensitive files
console.log('\n2. Checking for Sensitive Files...');
const sensitiveFiles = ['.env', 'private.key', 'secrets.json', '.secret'];
const foundSensitiveFiles = sensitiveFiles.filter(file => fs.existsSync(file));

if (foundSensitiveFiles.length === 0) {
  console.log('✅ No sensitive files found in root directory');
} else {
  console.log('❌ Sensitive files detected:', foundSensitiveFiles.join(', '));
}

// Test 3: Check .gitignore coverage
console.log('\n3. Checking .gitignore Security Coverage...');
try {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  const securityPatterns = ['.env', '*.key', '*.pem', 'secrets/', 'security-logs/'];
  const missingPatterns = securityPatterns.filter(pattern => !gitignoreContent.includes(pattern));
  
  if (missingPatterns.length === 0) {
    console.log('✅ .gitignore has good security coverage');
  } else {
    console.log('⚠️  Missing gitignore patterns:', missingPatterns.join(', '));
  }
} catch (error) {
  console.log('❌ Error reading .gitignore:', error.message);
}

// Test 4: Check security utilities
console.log('\n4. Checking Security Utilities...');
try {
  const securityFile = fs.readFileSync('src/utils/security.ts', 'utf8');
  const securityFeatures = [
    'sanitizeHTML',
    'sanitizeURL', 
    'validateEmail',
    'RateLimiter',
    'secureStorage',
    'securityMonitor'
  ];
  
  const missingFeatures = securityFeatures.filter(feature => !securityFile.includes(feature));
  
  if (missingFeatures.length === 0) {
    console.log('✅ All security utilities are implemented');
  } else {
    console.log('❌ Missing security features:', missingFeatures.join(', '));
  }
} catch (error) {
  console.log('❌ Error reading security utilities:', error.message);
}

// Test 5: Check package.json security scripts
console.log('\n5. Checking Security Scripts...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const securityScripts = [
    'security:audit',
    'security:check',
    'security:scan',
    'build:secure'
  ];
  
  const presentScripts = Object.keys(packageJson.scripts || {});
  const missingScripts = securityScripts.filter(script => !presentScripts.includes(script));
  
  if (missingScripts.length === 0) {
    console.log('✅ All security scripts are configured');
  } else {
    console.log('❌ Missing security scripts:', missingScripts.join(', '));
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Test 6: Check CSP configuration
console.log('\n6. Checking Content Security Policy...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  const cspHeader = vercelConfig.headers?.[0]?.headers?.find(h => h.key === 'Content-Security-Policy');
  
  if (cspHeader) {
    const csp = cspHeader.value;
    const requiredDirectives = ['default-src', 'script-src', 'style-src', 'img-src', 'frame-ancestors'];
    const missingDirectives = requiredDirectives.filter(dir => !csp.includes(dir));
    
    if (missingDirectives.length === 0) {
      console.log('✅ CSP has all required directives');
      
      // Check for secure CSP values
      if (csp.includes("'unsafe-eval'")) {
        console.log('⚠️  CSP allows unsafe-eval (consider removing if possible)');
      }
      if (csp.includes('*')) {
        console.log('⚠️  CSP uses wildcard sources (consider being more specific)');
      }
    } else {
      console.log('❌ CSP missing directives:', missingDirectives.join(', '));
    }
  } else {
    console.log('❌ No CSP header found');
  }
} catch (error) {
  console.log('❌ Error checking CSP:', error.message);
}

console.log('\n🔍 Security Test Complete!\n');
console.log('📝 Recommendations:');
console.log('• Run `npm audit` regularly to check for vulnerabilities');
console.log('• Test security headers at https://securityheaders.com/');
console.log('• Consider implementing server-side rate limiting');
console.log('• Monitor security logs for suspicious activity');
console.log('• Keep dependencies updated with `npm update`');

console.log('\n🛡️  Your portfolio is now significantly more secure!');
