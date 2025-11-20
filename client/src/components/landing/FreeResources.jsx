import { Link } from 'react-router-dom';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Lock, Calendar, ArrowRight, Clock, User } from 'lucide-react';
import ScrollReveal from '../../shared/components/animations/ScrollReveal';
import StaggerContainer from '../../shared/components/animations/StaggerContainer';
import StaggerItem from '../../shared/components/animations/StaggerItem';

const FreeResources = memo(() => {
  const resources = [
    {
      type: 'blog',
      title: 'Getting Started with React: A Complete Guide',
      author: 'Tech Mentor',
      readTime: '5 min read',
      icon: BookOpen,
      category: 'Web Development',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      type: 'video',
      title: 'Introduction to Machine Learning',
      author: 'AI Expert',
      duration: '15 min',
      icon: Video,
      category: 'AI/ML',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      type: 'blog',
      title: 'Cybersecurity Basics for Beginners',
      author: 'Security Pro',
      readTime: '8 min read',
      icon: Lock,
      category: 'Cybersecurity',
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      type: 'webinar',
      title: 'Free Webinar: Building Your First Portfolio',
      author: 'Career Coach',
      date: 'Tomorrow, 6 PM',
      icon: Calendar,
      category: 'Career',
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Start Learning <span className="text-primary">For Free</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Explore our free resources and get a taste of what DevHubs Academy offers
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-10">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon;
              
              return (
                <StaggerItem key={index}>
                  <ScrollReveal delay={index * 0.1}>
                    <motion.div
                      className="group relative bg-white rounded-xl border border-gray-200 p-5 hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                      whileHover={{ y: -4 }}
                    >
                      {/* Icon */}
                      <div className="mb-4">
                        <motion.div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${resource.gradient} flex items-center justify-center text-white shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                        >
                          <IconComponent className="w-6 h-6" />
                        </motion.div>
                      </div>

                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-md">
                          {resource.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 flex-grow">
                        {resource.title}
                      </h3>

                      {/* Meta Info */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{resource.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{resource.readTime || resource.duration || resource.date}</span>
                        </div>
                      </div>

                      {/* CTA Link */}
                      <Link 
                        to={resource.type === 'webinar' ? '/live-sessions' : '/blog'}
                        className="mt-auto"
                      >
                        <motion.div
                          className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm group-hover:text-primary-dark transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          <span>{resource.type === 'webinar' ? 'Register' : 'Read More'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  </ScrollReveal>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>

        <ScrollReveal delay={0.4}>
          <div className="text-center">
            <Link to="/blog">
              <motion.button
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore All Free Resources</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
});

FreeResources.displayName = 'FreeResources';

export default FreeResources;
