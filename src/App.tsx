import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Router } from '@/components/Router';
import { PrivacyNotice } from '@/components/Privacy/PrivacyNotice';
import { PerformanceMonitor } from '@/config/performance';
import './App.css';

function App() {
  useEffect(() => {
    // Set initial theme based on localStorage or system preference
    const theme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    document.documentElement.classList.add(theme);

    // Initialize performance monitoring
    PerformanceMonitor.getInstance();
  }, []);

  // Handle navigation clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && link.origin === window.location.origin) {
        e.preventDefault();
        const path = new URL(link.href).pathname;
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <Router />
      <Analytics />
      <SpeedInsights />
      <PrivacyNotice />
    </>
  );
}

export default App;
