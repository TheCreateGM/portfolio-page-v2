import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Router } from '@/components/Router';
import { PrivacyNotice } from '@/components/Privacy/PrivacyNotice';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
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

  // Handle navigation clicks - only for internal SPA routes
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href) {
        // Don't intercept external links (different origin or target="_blank")
        if (link.target === '_blank' || 
            link.rel.includes('noopener') || 
            link.origin !== window.location.origin ||
            link.href.startsWith('http') && !link.href.startsWith(window.location.origin)) {
          return; // Let the browser handle external links normally
        }
        
        // Only intercept internal SPA routes (not games)
        const url = new URL(link.href);
        const path = url.pathname;
        const internalRoutes = ['/', '/about', '/projects', '/social'];
        
        // Don't intercept game links - let them open normally
        if (internalRoutes.includes(path) && !path.startsWith('/games/')) {
          e.preventDefault();
          window.history.pushState({}, '', path);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <ParticleBackground />
      <Router />
      <Analytics />
      <SpeedInsights />
      <PrivacyNotice />
    </>
  );
}

export default App;
