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
            <div className="card max-w-md mx-auto p-8">
              <h3 className="text-2xl font-bold mb-4">Support My Work</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Donations help me create more projects!
              </p>
              <a
                href="https://www.paypal.com/paypalme/axogm"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center"
              >
                <i className="fab fa-paypal mr-2"></i>
                Donate via PayPal
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};