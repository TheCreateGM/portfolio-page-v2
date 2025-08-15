import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GalleryItem } from '@/types';

export const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/src/data/gallery.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGalleryItems(data);
      } catch (err) {
        console.error('Failed to fetch gallery data:', err);
        setError('Could not load gallery information.');
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

  if (!galleryItems.length) {
    return (
      <div className="text-center py-12">
        <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 text-blue-700 dark:text-blue-300 px-4 py-3 rounded">
          No gallery items available.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {galleryItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <div className="card overflow-hidden group">
            {item.image && (
              <div className="aspect-video overflow-hidden">
                <a href={item.link} className="block">
                  <img
                    src={item.image}
                    alt={item.category || 'Gallery Item'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </a>
              </div>
            )}
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold">{item.category || 'Gallery'}</h3>
            </div>
            {item.link && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                <a
                  href={item.link}
                  className="block p-4 text-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    View Gallery
                  </span>
                </a>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};