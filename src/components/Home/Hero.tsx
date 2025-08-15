import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Hello, I'm AxoGM
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
            I'm a programmer and 3D model maker.
          </p>
        </motion.div>
      </div>
    </section>
  );
};