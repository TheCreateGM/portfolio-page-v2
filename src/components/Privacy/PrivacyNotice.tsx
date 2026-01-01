import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PrivacyNotice = () => {
  const [showNotice, setShowNotice] = useState(() => {
    // Check if user has already accepted/declined privacy policy
    if (typeof window === 'undefined') return false;
    const hasAccepted = localStorage.getItem('privacy-accepted');
    return !hasAccepted;
  });

  const acceptPrivacy = () => {
    localStorage.setItem('privacy-accepted', 'true');
    setShowNotice(false);
  };

  const declinePrivacy = () => {
    localStorage.setItem('privacy-accepted', 'false');
    setShowNotice(false);
    // Disable analytics if user declines
    if (typeof window !== 'undefined' && 'va' in window) {
      const windowWithVa = window as Window & { va: (action: string) => void };
      windowWithVa.va('opt-out');
    }
  };

  return (
    <AnimatePresence>
      {showNotice && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold mb-1">Privacy & Analytics</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  This site uses privacy-friendly analytics to understand visitor behavior.
                  No personal data is collected, and your IP is anonymized.
                  You can opt out at any time.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={declinePrivacy}
                  className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={acceptPrivacy}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};