// Performance monitoring configuration

export const performanceConfig = {
  // Enable only in production
  enabled: process.env.NODE_ENV === 'production',
  
  // Core Web Vitals thresholds
  thresholds: {
    // Largest Contentful Paint (LCP) - should be < 2.5s
    lcp: 2500,
    // First Input Delay (FID) - should be < 100ms
    fid: 100,
    // Cumulative Layout Shift (CLS) - should be < 0.1
    cls: 0.1,
    // Time to First Byte (TTFB) - should be < 800ms
    ttfb: 800,
  },
  
  // Performance observer options
  observer: {
    // Monitor these entry types
    entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] as const,
    // Buffer size for performance entries
    buffered: true,
  },
  
  // Custom performance metrics
  customMetrics: {
    // Track time to interactive
    timeToInteractive: true,
    // Track resource loading times
    resourceTiming: true,
    // Track user interactions
    userTiming: true,
  }
} as const;

// Performance monitoring utility
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private observers: PerformanceObserver[] = [];

  private constructor() {
    if (performanceConfig.enabled && typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    // Core Web Vitals observer
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.handlePerformanceEntry(entry);
          }
        });

        observer.observe({ 
          entryTypes: [...performanceConfig.observer.entryTypes],
          buffered: performanceConfig.observer.buffered 
        });

        this.observers.push(observer);
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    // Log performance issues in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Entry:', entry);
    }

    // Handle specific performance metrics
    switch (entry.entryType) {
      case 'largest-contentful-paint':
        this.handleLCP(entry as PerformanceEntry);
        break;
      case 'first-input':
        this.handleFID(entry as PerformanceEntry);
        break;
      case 'layout-shift':
        this.handleCLS(entry as PerformanceEntry);
        break;
    }
  }

  private handleLCP(entry: PerformanceEntry) {
    const lcp = entry.startTime;
    if (lcp > performanceConfig.thresholds.lcp) {
      console.warn(`LCP is slow: ${lcp}ms (threshold: ${performanceConfig.thresholds.lcp}ms)`);
    }
  }

  private handleFID(entry: PerformanceEntry) {
    const perfEntry = entry as PerformanceEntry & { processingStart?: number };
    const fid = (perfEntry.processingStart || 0) - entry.startTime;
    if (fid > performanceConfig.thresholds.fid) {
      console.warn(`FID is slow: ${fid}ms (threshold: ${performanceConfig.thresholds.fid}ms)`);
    }
  }

  private handleCLS(entry: PerformanceEntry) {
    const perfEntry = entry as PerformanceEntry & { value?: number };
    const cls = perfEntry.value || 0;
    if (cls > performanceConfig.thresholds.cls) {
      console.warn(`CLS is high: ${cls} (threshold: ${performanceConfig.thresholds.cls})`);
    }
  }

  // Custom performance marking
  public mark(name: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(name);
    }
  }

  public measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        performance.measure(name, startMark, endMark);
      } catch (error) {
        console.warn('Performance measure failed:', error);
      }
    }
  }

  // Cleanup observers
  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}