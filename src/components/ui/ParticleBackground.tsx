// src/components/ui/ParticleBackground.tsx

import React, { useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { ParticleSystem } from '@/lib/particle-system';

interface ParticleBackgroundProps extends React.HTMLAttributes<HTMLCanvasElement> {
  className?: string;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  className = '', 
  ...props 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const { theme } = useTheme();

  // Effect for initialization and cleanup
  useEffect(() => {
    if (canvasRef.current && theme) {
      const particleSystem = new ParticleSystem(canvasRef.current, theme);
      particleSystem.start();
      particleSystemRef.current = particleSystem;

      const handleResize = () => {
        particleSystem.handleResize();
      };

      window.addEventListener('resize', handleResize);

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        particleSystem.stop();
        particleSystemRef.current = null;
      };
    }
  }, [theme]); // Re-initialize if theme changes

  // Effect for updating the theme on the fly
  useEffect(() => {
    if (particleSystemRef.current && theme) {
      particleSystemRef.current.updateTheme(theme);
    }
  }, [theme]);

  const combinedClassName = `fixed top-0 left-0 w-full h-full -z-50 pointer-events-none ${className}`.trim();

  return (
    <canvas
      ref={canvasRef}
      className={combinedClassName}
      {...props}
    />
  );
};