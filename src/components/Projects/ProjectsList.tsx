import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { trackEvent, analyticsConfig } from '@/config/analytics';
import type { ProjectsData } from '@/types';

export const ProjectsList = () => {
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/projects.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjectsData(data);
      } catch (err) {
        console.error('Failed to fetch projects data:', err);
        setError('Could not load projects information.');
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

  if (!projectsData || Object.keys(projectsData).length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 text-blue-700 dark:text-blue-300 px-4 py-3 rounded">
          No projects information available.
        </div>
      </div>
    );
  }

  const categories = Object.keys(projectsData) as (keyof ProjectsData)[];

  return (
    <div className="space-y-16">
      {categories.map((category, catIndex) => {
        const projects = projectsData[category];
        if (!projects.length) return null;

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: catIndex * 0.1 }}
          >
            <h2 className="text-3xl font-bold mb-8 capitalize">
              {category.replace('_', ' ')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, projIndex) => (
                <motion.div
                  key={projIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (catIndex * 0.1) + (projIndex * 0.05) }}
                  className="card overflow-hidden h-full flex flex-col"
                >
                  {/* Project Image */}
                  <div className="aspect-video overflow-hidden">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-4">{project.title}</h3>
                    
                    {/* Tech Logos */}
                    {project.logos && project.logos.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.logos.map((logo, logoIndex) => (
                          logo && (
                            <img
                              key={logoIndex}
                              src={logo}
                              alt="Tech logo"
                              className="h-6 w-auto opacity-70"
                            />
                          )
                        ))}
                      </div>
                    )}

                    {/* Project Links */}
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-2">
                        {project.live_link && (
                          <a
                            href={project.live_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            onClick={() => trackEvent(analyticsConfig.events.PROJECT_VIEW, { 
                              project: project.title, 
                              category: category,
                              type: 'live'
                            })}
                          >
                            <i className="fas fa-external-link-alt mr-1"></i>
                            View Live
                          </a>
                        )}
                        {project.repo_link && (
                          <a
                            href={project.repo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            onClick={() => trackEvent(analyticsConfig.events.PROJECT_VIEW, { 
                              project: project.title, 
                              category: category,
                              type: 'repo'
                            })}
                          >
                            <i className="fab fa-github mr-1"></i>
                            View Code
                          </a>
                        )}
                        {!project.live_link && !project.repo_link && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">No Links</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {catIndex < categories.length - 1 && (
              <hr className="mt-16 border-gray-200 dark:border-gray-700" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};