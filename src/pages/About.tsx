import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout/Layout';
import { Skills } from '@/components/About/Skills';
import type { InfoData } from '@/types';

export const About = () => {
  const [infoData, setInfoData] = useState<InfoData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/info.json');
        if (response.ok) {
          const data = await response.json();
          setInfoData(data);
        }
      } catch (err) {
        console.error('Failed to fetch info data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout currentPage="about">
      {/* Page Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Information</h1>
          </motion.div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            {infoData?.bio && (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Many people call me {infoData.bio.nickname} and you can call me {infoData.bio.nickname} if you want. 
                I'm from {infoData.bio.location}.
              </p>
            )}
          </motion.div>

          <Skills />
        </div>
      </section>



      {/* Projects Link Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4">My Projects</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              I still work on many things. Click the button below to see the projects page.
            </p>
            <a
              href="/projects"
              className="btn-primary inline-flex items-center"
            >
              <i className="fas fa-folder-open mr-2"></i>
              Go to Projects
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};