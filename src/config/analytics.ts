// Analytics configuration for privacy compliance

export const analyticsConfig = {
  // Only track in production
  enabled: process.env.NODE_ENV === 'production',
  
  // Privacy-first settings
  respectDoNotTrack: true,
  anonymizeIP: true,
  
  // Custom events for portfolio tracking
  events: {
    PROJECT_VIEW: 'project_view',
    SOCIAL_CLICK: 'social_click',
    THEME_TOGGLE: 'theme_toggle',
    CONTACT_CLICK: 'contact_click',
  }
} as const;

// Type-safe analytics tracking
export type AnalyticsEvent = typeof analyticsConfig.events[keyof typeof analyticsConfig.events];

// Helper function to track events safely
export const trackEvent = (event: AnalyticsEvent, properties?: Record<string, string | number>) => {
  if (!analyticsConfig.enabled) return;
  
  // Check for Do Not Track
  if (navigator.doNotTrack === '1') return;
  
  // Track with Vercel Analytics
  if (typeof window !== 'undefined' && 'va' in window) {
    (window as any).va('track', event, properties);
  }
};