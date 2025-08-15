import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout/Layout';
import { ProjectsList } from '@/components/Projects/ProjectsList';

export const Projects = () => {
  return (
    <Layout currentPage="projects">
      {/* Page Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              A collection of my work across different technologies and platforms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ProjectsList />
        </div>
      </section>
    </Layout>
  );
};