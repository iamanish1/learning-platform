import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../../shared/components/animations/ScrollReveal';

const FinalCTA = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light"></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2MjJoLTIgVjM0aDJ6bTAtMjJIMzR2MjJoMlYxMnptMjIgMjJoLTJWMzRoMnYyMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

      {/* Animated Background Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal delay={0.1}>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to Start Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Tech Journey?
            </span>
          </motion.h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join 10,000+ students who are already building their careers with DevHubs Academy. 
            Start learning today - it&apos;s free!
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link to="/register">
              <motion.button
                className="bg-white text-primary-dark hover:bg-gray-100 px-8 py-4 text-base md:text-lg font-semibold rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free Now →
              </motion.button>
            </Link>
            <Link to="/live-sessions">
              <motion.button
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-dark px-8 py-4 text-base md:text-lg font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Free Sessions
              </motion.button>
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <p className="mt-6 text-white/80 text-sm">
            No credit card required • 100% Free • Join in 30 seconds
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FinalCTA;
