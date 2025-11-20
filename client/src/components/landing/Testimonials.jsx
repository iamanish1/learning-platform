import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Quote, Award, TrendingUp, Trophy, Users } from 'lucide-react';
import ScrollReveal from '../../shared/components/animations/ScrollReveal';
import StaggerContainer from '../../shared/components/animations/StaggerContainer';
import StaggerItem from '../../shared/components/animations/StaggerItem';

const Testimonials = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Priya Sharma',
      college: 'Tier 3 Engineering College, Mumbai',
      achievement: 'Placed at Microsoft',
      quote: 'DevHubs Academy changed my career trajectory. The free live sessions and community support helped me land my dream job at Microsoft. The mentors are amazing!',
      rating: 5,
      avatarColor: 'from-blue-400 to-blue-600',
      badge: 'Career Success',
      badgeIcon: Award,
    },
    {
      name: 'Rahul Kumar',
      college: 'Tier 2 College, Delhi',
      achievement: 'Won 3 Hackathons',
      quote: 'I joined 3 hackathons through DevHubs and won all of them! The platform helped me build a strong portfolio and connect with amazing teammates.',
      rating: 5,
      avatarColor: 'from-purple-400 to-purple-600',
      badge: 'Hackathon Winner',
      badgeIcon: Trophy,
    },
    {
      name: 'Anjali Patel',
      college: 'Tier 3 College, Ahmedabad',
      achievement: 'Published 20+ Blog Posts',
      quote: 'The blog section helped me improve my writing and technical knowledge. I\'ve published 20+ articles and gained recognition in the tech community.',
      rating: 5,
      avatarColor: 'from-green-400 to-green-600',
      badge: 'Content Creator',
      badgeIcon: TrendingUp,
    },
    {
      name: 'Vikram Singh',
      college: 'Tier 2 College, Bangalore',
      achievement: 'Community Leader',
      quote: 'The community feature is incredible! I\'ve learned so much from discussions and collaborations. It\'s like having a study group available 24/7.',
      rating: 5,
      avatarColor: 'from-orange-400 to-orange-600',
      badge: 'Community Leader',
      badgeIcon: Users,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];
  const BadgeIcon = currentTestimonial.badgeIcon;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary-light rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Loved by <span className="text-primary">10,000+ Students</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              See what our students are saying about their journey
            </p>
          </div>
        </ScrollReveal>

        <div className="relative max-w-5xl mx-auto">
          {/* Testimonial Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="relative bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 overflow-hidden">
                {/* Decorative quote icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-16 h-16 text-primary" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Rating Stars */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <motion.svg
                        key={i}
                        className="w-5 h-5 md:w-6 md:h-6 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          delay: i * 0.1, 
                          type: 'spring',
                          stiffness: 200,
                          damping: 10
                        }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl lg:text-2xl text-gray-800 font-semibold leading-relaxed mb-6 text-center max-w-3xl mx-auto">
                    <span className="text-primary text-3xl md:text-4xl leading-none">"</span>
                    {currentTestimonial.quote}
                    <span className="text-primary text-3xl md:text-4xl leading-none">"</span>
                  </blockquote>

                  {/* Author Section */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      {/* Avatar */}
                      <motion.div
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${currentTestimonial.avatarColor} flex items-center justify-center text-white shadow-lg relative`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <GraduationCap className="w-8 h-8 md:w-10 md:h-10" />
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${currentTestimonial.avatarColor} rounded-full opacity-0 group-hover:opacity-50 blur-xl`}
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      </motion.div>

                      {/* Author Info */}
                      <div className="text-center sm:text-left flex-1">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                          <h3 className="font-bold text-gray-900 text-base md:text-lg">
                            {currentTestimonial.name}
                          </h3>
                          {/* Badge */}
                          <motion.div
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold"
                            whileHover={{ scale: 1.05 }}
                          >
                            <BadgeIcon className="w-3 h-3" />
                            <span>{currentTestimonial.badge}</span>
                          </motion.div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">
                          {currentTestimonial.college}
                        </p>
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary/5 text-primary rounded-lg text-xs font-semibold">
                          <Award className="w-3 h-3" />
                          <span>{currentTestimonial.achievement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/20 rounded-tl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/20 rounded-br-2xl"></div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <motion.button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary group"
            aria-label="Previous testimonial"
            type="button"
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary group"
            aria-label="Next testimonial"
            type="button"
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Enhanced Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  index === currentIndex
                    ? 'bg-primary w-10 h-3'
                    : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
                type="button"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: index === currentIndex ? 1 : 0.9,
                }}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <ScrollReveal delay={0.3}>
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:border-primary/50 transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${testimonial.avatarColor} flex items-center justify-center`}>
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.achievement}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;
