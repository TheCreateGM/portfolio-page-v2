import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { preventClickjacking, securityMonitor } from './utils/security'

// Initialize security measures
try {
  preventClickjacking();
  securityMonitor.logSecurityEvent('app_initialization', {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
} catch (error) {
  console.error('Security initialization failed:', error);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
