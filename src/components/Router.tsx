import { useState, useEffect } from 'react';
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Projects } from '@/pages/Projects';
import { Social } from '@/pages/Social';
import { ParticleTest } from '@/pages/ParticleTest';

export const Router = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Simple client-side routing
  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Home />;
      case '/about':
        return <About />;
      case '/projects':
        return <Projects />;
      case '/social':
        return <Social />;
      case '/particle-test':
        return <ParticleTest />;
      default:
        return <Home />;
    }
  };

  return renderPage();
};