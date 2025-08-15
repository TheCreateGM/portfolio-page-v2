import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SocialLink } from '@/types';

export const SocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/src/data/social.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSocialLinks(data);
      } catch (err) {
        console.error('Failed to fetch social links:', err);
        setError('Could not load social media links.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!socialLinks.length) {
    return (
      <div className="text-center py-12">
        <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 text-blue-700 dark:text-blue-300 px-4 py-3 rounded">
          No social media links available.
        </div>
      </div>
    );
  }

  // Use Font Awesome icons directly
  const getIconComponent = (faClass: string, name: string) => {
    return (
      <i className={`${faClass} text-2xl`} title={name}></i>
    );
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {socialLinks.map((platform, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.05 }}
        >
          <a
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 rounded-lg bg-white dark:bg-secondary-dark border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-200 group"
            title={platform.name}
          >
            <div className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors duration-200 flex items-center justify-center">
              {getIconComponent(platform.fa_class, platform.name)}
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors duration-200">
              {platform.name}
            </span>
          </a>
        </motion.div>
      ))}
    </div>
  );
};