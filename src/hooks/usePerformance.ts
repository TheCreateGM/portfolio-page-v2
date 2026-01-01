import { useEffect, useRef } from 'react';
import { PerformanceMonitor } from '@/config/performance';

// Hook for component-level performance monitoring
export const usePerformance = (componentName: string) => {
  const monitor = useRef<PerformanceMonitor | null>(null);
  const mountTime = useRef<number | null>(null);

  useEffect(() => {
    monitor.current = PerformanceMonitor.getInstance();
    mountTime.current = performance.now();

    // Mark component mount
    monitor.current.mark(`${componentName}-mount-start`);

    return () => {
      if (monitor.current && mountTime.current) {
        // Mark component unmount
        monitor.current.mark(`${componentName}-mount-end`);

        // Measure component lifecycle
        monitor.current.measure(
          `${componentName}-mount-duration`,
          `${componentName}-mount-start`,
          `${componentName}-mount-end`
        );
      }
    };
  }, [componentName]);

  // Function to mark custom performance points
  const markPerformance = (eventName: string) => {
    monitor.current?.mark(`${componentName}-${eventName}`);
  };

  // Function to measure between two marks
  const measurePerformance = (measureName: string, startMark: string, endMark?: string) => {
    monitor.current?.measure(
      `${componentName}-${measureName}`,
      `${componentName}-${startMark}`,
      endMark ? `${componentName}-${endMark}` : undefined
    );
  };

  return {
    markPerformance,
    measurePerformance,

  };
};