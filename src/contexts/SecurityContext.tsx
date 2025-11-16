import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { 
  securityMonitor, 
  rateLimiter, 
  secureStorage, 
  SecurityError 
} from '../utils/security';

interface SecurityContextType {
  isSecurityEnabled: boolean;
  reportSecurityEvent: (event: string, details?: Record<string, unknown>) => void;
  checkRateLimit: (identifier: string) => boolean;
  secureStore: typeof secureStorage;
  lastSecurityCheck: Date | null;
}

export const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true);
  const [lastSecurityCheck, setLastSecurityCheck] = useState<Date | null>(null);

  useEffect(() => {
    // Initialize security monitoring
    const initializeSecurity = async () => {
      try {
        // Perform initial security checks
        const securityChecks = {
          localStorage: typeof Storage !== 'undefined',
          crypto: typeof crypto !== 'undefined',
          fetch: typeof fetch !== 'undefined',
          csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,
          https: location.protocol === 'https:' || location.hostname === 'localhost'
        };

        const failedChecks = Object.entries(securityChecks)
          .filter(([, passed]) => !passed)
          .map(([check]) => check);

        if (failedChecks.length > 0) {
          throw new SecurityError(
            `Security checks failed: ${failedChecks.join(', ')}`,
            'SECURITY_CHECK_FAILED'
          );
        }

        securityMonitor.logSecurityEvent('security_context_initialized', {
          checks: securityChecks,
          timestamp: new Date().toISOString()
        });

        setLastSecurityCheck(new Date());
        setIsSecurityEnabled(true);

        // Set up periodic security monitoring
        const securityInterval = setInterval(() => {
          performSecurityCheck();
        }, 5 * 60 * 1000); // Every 5 minutes

        return () => clearInterval(securityInterval);
      } catch (error) {
        console.error('Security initialization failed:', error);
        securityMonitor.logSecurityEvent('security_initialization_failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        setIsSecurityEnabled(false);
      }
    };

    initializeSecurity();
  }, []);

  const performSecurityCheck = () => {
    try {
      // Check for suspicious activity
      const suspiciousPatterns = [
        // Check for potential XSS attempts in URL
        /<script|javascript:|data:text\/html|vbscript:/i.test(window.location.href),
        
        // Check for unusual DOM modifications
        document.querySelectorAll('script[src^="data:"]').length > 0,
        
        // Check for potential clickjacking
        window.top !== window.self,
        
        // Check for console tampering
        typeof console.log !== 'function'
      ];

      const suspiciousCount = suspiciousPatterns.filter(Boolean).length;

      if (suspiciousCount > 0) {
        securityMonitor.logSecurityEvent('suspicious_activity_detected', {
          suspiciousCount,
          patterns: suspiciousPatterns,
          url: window.location.href,
          timestamp: new Date().toISOString()
        });
      }

      setLastSecurityCheck(new Date());
    } catch (error) {
      securityMonitor.logSecurityEvent('security_check_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const reportSecurityEvent = (event: string, details: Record<string, unknown> = {}) => {
    securityMonitor.logSecurityEvent(event, {
      ...details,
      userReported: true,
      timestamp: new Date().toISOString()
    });
  };

  const checkRateLimit = (identifier: string): boolean => {
    const allowed = rateLimiter.isAllowed(identifier);
    
    if (!allowed) {
      securityMonitor.logSecurityEvent('rate_limit_exceeded', {
        identifier,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    }
    
    return allowed;
  };

  const contextValue: SecurityContextType = {
    isSecurityEnabled,
    reportSecurityEvent,
    checkRateLimit,
    secureStore: secureStorage,
    lastSecurityCheck
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};


