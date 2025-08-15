import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchJSON } from '@/utils/api';
import type { InfoData } from '@/types';

export const Skills = () => {
  const [infoData, setInfoData] = useState<InfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchJSON<InfoData>('/data/info.json');
        setInfoData(data);
      } catch (err) {
        console.error('Failed to fetch info data:', err);
        setError('Could not load skill information. Please try refreshing the page.');
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

  if (!infoData?.skills?.length) {
    return (
      <div className="text-center py-12">
        <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 text-blue-700 dark:text-blue-300 px-4 py-3 rounded">
          No skills information available.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {infoData.skills.map((skill, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="card overflow-hidden"
        >
          {skill.image && (
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={skill.image}
                alt="Skill image"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {skill.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};