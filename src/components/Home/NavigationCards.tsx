import { motion } from 'framer-motion';

interface NavigationCard {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  alt: string;
}

export const NavigationCards = () => {
  const cards: NavigationCard[] = [
    {
      title: 'Information',
      subtitle: 'The information about me.',
      image: '/img/card/2.png',
      href: '/about',
      alt: 'Information Thumbnail'
    },
    {
      title: 'Projects',
      subtitle: 'The projects and stuff that I make.',
      image: '/img/card/1.png',
      href: '/projects',
      alt: 'Project Thumbnail'
    },
    {
      title: 'Social Media',
      subtitle: 'Media social where I post my projects.',
      image: '/img/card/3.png',
      href: '/social',
      alt: 'Social Media Thumbnail'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <a
                href={card.href}
                className="block group"
              >
                <div className="card card-hover h-full flex flex-col overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{card.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 flex-1">{card.subtitle}</p>
                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                      <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                        See More →
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};