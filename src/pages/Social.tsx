import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout/Layout';
import { SocialLinks } from '@/components/Social/SocialLinks';

export const Social = () => {
  return (
    <Layout currentPage="social">
      {/* Page Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Social Media</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Find me on these platforms:
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SocialLinks />
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="card max-w-4xl mx-auto p-4">
              <h3 className="text-2xl font-bold mb-4 text-center">Support My Work</h3>
              <iframe 
                id="kofiframe" 
                src="https://ko-fi.com/axogm/?hidefeed=true&widget=true&embed=true&preview=true" 
                style={{
                  border: 'none',
                  width: '100%',
                  padding: '4px',
                  background: '#f9f9f9'
                }}
                height="712" 
                title="axogm"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};