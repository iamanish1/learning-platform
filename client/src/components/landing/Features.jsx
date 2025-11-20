import { Link } from 'react-router-dom';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Video, Trophy, BookOpen, Users, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../../shared/components/animations/ScrollReveal';
import StaggerContainer from '../../shared/components/animations/StaggerContainer';
import StaggerItem from '../../shared/components/animations/StaggerItem';
import HoverScale from '../../shared/components/animations/HoverScale';

const Features = memo(() => {
  const features = [
    {
      icon: Video,
      title: 'Live Sessions & Webinars',
      description: 'Join free and paid live sessions with industry experts. Get real-time mentorship and learn directly from professionals.',
      benefit: 'Direct mentor interaction and live guidance',
      link: '/live-sessions',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      stat: '500+',
      statLabel: 'Sessions',
      accentColor: 'text-blue-600',
      accentBorder: 'border-blue-200',
      accentHover: 'hover:text-blue-700',
      highlights: ['Free Sessions', 'Expert Mentors', 'Live Q&A'],
    },
    {
      icon: Trophy,
      title: 'Events & Hackathons',
      description: 'Compete in hackathons, build real projects, and showcase your work. Form teams and win prizes.',
      benefit: 'Builds portfolio and hands-on experience',
      link: '/events',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      stat: '50+',
      statLabel: 'Events',
      accentColor: 'text-purple-600',
      accentBorder: 'border-purple-200',
      accentHover: 'hover:text-purple-700',
      highlights: ['Team Building', 'Real Projects', 'Prizes'],
    },
    {
      icon: BookOpen,
      title: 'Blog & Documentation',
      description: 'Read curated articles and publish your own content. Share knowledge and grow your personal brand.',
      benefit: 'Develops communication and technical skills',
      link: '/blog',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      stat: '1K+',
      statLabel: 'Articles',
      accentColor: 'text-green-600',
      accentBorder: 'border-green-200',
      accentHover: 'hover:text-green-700',
      highlights: ['Curated Content', 'Publish Articles', 'Build Brand'],
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join skill-based communities. Collaborate, discuss, and learn together in a structured ecosystem.',
      benefit: 'Centralized learning groups for maximum growth',
      link: '/community',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      stat: '50+',
      statLabel: 'Communities',
      accentColor: 'text-orange-600',
      accentBorder: 'border-orange-200',
      accentHover: 'hover:text-orange-700',
      highlights: ['Skill Groups', 'Collaboration', '24/7 Support'],
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-light rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Everything You Need to{' '}
              <span className="text-primary">Succeed</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              A complete learning platform designed specifically for tier 2 & 3 college students
            </p>
          </div>
        </ScrollReveal>

        {/* Enhanced Grid Layout with perfect spacing */}
        <StaggerContainer staggerDelay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              
              return (
                <StaggerItem key={index}>
                  <ScrollReveal delay={index * 0.1}>
                    <HoverScale scale={1.02}>
                      <motion.div
                        className="group relative bg-white rounded-xl p-5 md:p-6 border border-gray-200 hover:border-primary/30 transition-all duration-300 hover:shadow-xl overflow-hidden h-full"
                        whileHover={{ y: -3 }}
                      >
                        {/* Animated gradient background */}
                        <motion.div
                          className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-500`}
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        ></motion.div>
                        
                        {/* Top decorative line */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        
                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col">
                          {/* Icon and Stat Row */}
                          <div className="flex items-start justify-between mb-3">
                            <motion.div
                              className={`w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 relative`}
                              whileHover={{ rotate: [0, -5, 5, 0] }}
                            >
                              <IconComponent className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
                              <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl opacity-0 group-hover:opacity-50 blur-md`}
                                animate={{
                                  scale: [1, 1.2, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              />
                            </motion.div>
                            <div className="text-right">
                              <motion.div
                                className={`text-xl md:text-2xl font-bold bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}
                                whileHover={{ scale: 1.1 }}
                              >
                                {feature.stat}
                              </motion.div>
                              <div className="text-xs text-gray-500 font-medium mt-0.5">
                                {feature.statLabel}
                              </div>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2.5 group-hover:text-primary transition-colors duration-300">
                            {feature.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 leading-relaxed mb-3 text-sm md:text-base flex-grow">
                            {feature.description}
                          </p>

                          {/* Highlights */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {feature.highlights.map((highlight, idx) => (
                              <motion.div
                                key={idx}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r ${feature.bgGradient} ${feature.accentBorder} border-opacity-30 text-xs font-medium text-gray-700`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + idx * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <CheckCircle2 className={`w-2.5 h-2.5 ${feature.accentColor}`} />
                                <span>{highlight}</span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Benefit Badge */}
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r ${feature.bgGradient} ${feature.accentBorder} border-opacity-50 mb-3 group-hover:shadow-md transition-shadow`}>
                            <Sparkles className={`w-3.5 h-3.5 ${feature.accentColor}`} />
                            <p className="text-xs text-gray-700 font-semibold">
                              {feature.benefit}
                            </p>
                          </div>

                          {/* CTA Link */}
                          <Link to={feature.link} className="mt-auto">
                            <motion.div
                              className={`inline-flex items-center gap-1.5 ${feature.accentColor} font-semibold text-sm group/link ${feature.accentHover} transition-colors`}
                              whileHover={{ x: 5 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              <span>Learn More</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                            </motion.div>
                          </Link>
                        </div>

                        {/* Hover effect overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none`}></div>
                      </motion.div>
                    </HoverScale>
                  </ScrollReveal>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
});

Features.displayName = 'Features';

export default Features;
