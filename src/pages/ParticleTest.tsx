// src/pages/ParticleTest.tsx
// This is a test page to demonstrate the particle background system

import { Layout } from '@/components/Layout/Layout';
import { useTheme } from '@/hooks/useTheme';

export const ParticleTest = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Layout currentPage="test">
      <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Particle Background Test
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              This page demonstrates the particle animation background system. 
              The particles should be visible behind this content and should 
              respond to theme changes.
            </p>

            <div className="space-y-6">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Current Theme</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className="btn-primary"
              >
                Toggle Theme to Test Particles
              </button>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>✅ Particles should be visible in the background</p>
                <p>✅ Particles should change color when toggling theme</p>
                <p>✅ Lines should connect nearby particles</p>
                <p>✅ Animation should be smooth at 60fps</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};