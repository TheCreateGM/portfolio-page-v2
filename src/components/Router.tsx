import { useState, useEffect } from 'react';
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Projects } from '@/pages/Projects';
import { Social } from '@/pages/Social';
import { ParticleTest } from '@/pages/ParticleTest';
import { Login } from '@/pages/Login';
import { Blog } from '@/pages/Blog';
import { BlogPost } from '@/pages/BlogPost';

type StaticRoute = {
  path: string;
  component: () => React.JSX.Element;
};

type DynamicRoute = {
  pattern: RegExp;
  component: (params: Record<string, string>) => React.JSX.Element;
};

type Route = StaticRoute | DynamicRoute;

export const Router = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Define all routes (static and dynamic)
  const routes: Route[] = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/projects', component: Projects },
    { path: '/social', component: Social },
    { path: '/particle-test', component: ParticleTest },
    { path: '/login', component: Login },
    { path: '/blog', component: Blog },
    {
      pattern: /^\/blog\/([^/]+)$/,
      component: ({ slug }) => <BlogPost slug={slug} />
    }
  ];

  // Route resolution with pattern matching
  const renderPage = () => {
    // Try to find exact static path match first
    for (const route of routes) {
      if ('path' in route && route.path === currentPath) {
        return <route.component />;
      }
    }

    // Try dynamic pattern matching
    for (const route of routes) {
      if ('pattern' in route) {
        const match = currentPath.match(route.pattern);
        if (match) {
          // Extract slug from first capture group
          const slug = match[1];
          return route.component({ slug });
        }
      }
    }

    // Fallback to home for 404
    return <Home />;
  };

  return renderPage();
};
