import DOMPurify from 'dompurify';
import validator from 'validator';
import CryptoJS from 'crypto-js';

// XSS Protection - Sanitize HTML content
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror']
  });
};

// Validate and sanitize URLs
export const sanitizeURL = (url: string): string => {
  if (!validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
    allow_underscores: false,
    host_whitelist: ['github.com', 'linkedin.com', 'twitter.com', 'instagram.com', 'discord.com', 'youtube.com']
  })) {
    return '#';
  }
  return validator.escape(url);
};

// Validate email addresses
export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email) && email.length <= 254;
};

// Rate limiting helper (client-side)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) { // 10 requests per minute
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Content Security Policy nonce generator
export const generateNonce = (): string => {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64);
};

// Secure local storage with encryption
export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), 'portfolio-secret-key').toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store encrypted data:', error);
    }
  },
  
  getItem: (key: string): any => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, 'portfolio-secret-key');
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Failed to retrieve encrypted data:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  }
};

// Input validation for contact forms
export const validateInput = {
  name: (name: string): boolean => {
    return validator.isLength(name, { min: 1, max: 100 }) && 
           validator.isAlpha(name.replace(/\s/g, ''));
  },
  
  message: (message: string): boolean => {
    return validator.isLength(message, { min: 1, max: 1000 });
  },
  
  subject: (subject: string): boolean => {
    return validator.isLength(subject, { min: 1, max: 200 });
  }
};

// Prevent clickjacking
export const preventClickjacking = (): void => {
  if (window.top !== window.self) {
    document.body.style.display = 'none';
    throw new Error('Clickjacking attempt detected');
  }
};

// Content integrity checker
export const verifyContentIntegrity = async (url: string, expectedHash: string): Promise<boolean> => {
  try {
    const response = await fetch(url);
    const content = await response.text();
    const hash = CryptoJS.SHA256(content).toString(CryptoJS.enc.Hex);
    return hash === expectedHash;
  } catch (error) {
    console.error('Failed to verify content integrity:', error);
    return false;
  }
};

// Monitor for suspicious activity
export const securityMonitor = {
  logSecurityEvent: (event: string, details: any = {}) => {
    const securityLog = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // In production, send this to your security monitoring service
    console.warn('Security Event:', securityLog);
    
    // Store locally for analysis (encrypted)
    const existingLogs = secureStorage.getItem('security_logs') || [];
    existingLogs.push(securityLog);
    
    // Keep only last 50 logs
    if (existingLogs.length > 50) {
      existingLogs.shift();
    }
    
    secureStorage.setItem('security_logs', existingLogs);
  }
};

// Error boundary for security-related errors
export class SecurityError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'SecurityError';
  }
}
