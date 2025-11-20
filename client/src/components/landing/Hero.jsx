import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, Users, Zap, Sparkles } from 'lucide-react';
import ScrollReveal from '../../shared/components/animations/ScrollReveal';

const Hero = () => {
  return (
    <section className="relative h-screen max-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light opacity-90">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djIyaC0yVjM0aDJ6bTAtMjJIMzR2MjJoMlYxMnptMjIgMjJoLTJWMzRoMnYyMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        {/* Animated floating shapes */}
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
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <ScrollReveal delay={0.1}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Join 10,000+ Students Learning Now</span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <TrendingUp className="w-4 h-4" />
                </motion.div>
              </motion.div>
            </ScrollReveal>

            {/* Main Headline */}
            <ScrollReveal delay={0.2} direction="up">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-white mb-3 lg:mb-4 leading-tight" role="heading" aria-level="1">
                Your Tech Career Starts{' '}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 inline-block"
                  animate={{ 
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Here
                </motion.span>
              </h1>
            </ScrollReveal>

            {/* Subheadline */}
            <ScrollReveal delay={0.3} direction="up">
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 lg:mb-6 leading-relaxed">
                Built for tier 2 & 3 college students. Learn, build, and grow with free live sessions, 
                hackathons, and a supportive community.{' '}
                <span className="font-bold text-white">100% Free to Start.</span>
              </p>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal delay={0.4} direction="up">
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center mb-4 lg:mb-6">
                <Link to="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button 
                      className="bg-white text-primary-dark hover:bg-gray-50 px-6 py-3 text-base font-bold shadow-xl hover:shadow-2xl transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                    >
                      <span className="flex items-center gap-2">
                        Get Started Free
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </span>
                    </button>
                  </motion.div>
                </Link>
                <Link to="/live-sessions">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button 
                      className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary-dark px-6 py-3 text-base font-semibold rounded-lg backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                    >
                      <span className="flex items-center gap-2">
                        <Play className="w-5 h-5" />
                        Explore Sessions
                      </span>
                    </button>
                  </motion.div>
                </Link>
              </div>
            </ScrollReveal>

            {/* Trust Indicators */}
            <ScrollReveal delay={0.5} direction="up">
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-white/90 text-xs sm:text-sm">
                <motion.div
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">100% Free</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium">No Credit Card</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <Users className="w-4 h-4 text-blue-300" />
                  <span className="font-medium">10,000+ Students</span>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column - Enhanced Visual Element */}
          <div className="hidden lg:block relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative"
            >
              {/* Enhanced Hero Illustration with Creative Effects */}
              <div className="relative w-full h-80 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 overflow-hidden shadow-2xl">
                {/* Animated particle background */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white/30 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>

                {/* Animated connecting lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: 1 }}>
                  <motion.line
                    x1="20%"
                    y1="20%"
                    x2="50%"
                    y2="50%"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    animate={{
                      pathLength: [0, 1, 0],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.line
                    x1="80%"
                    y1="20%"
                    x2="50%"
                    y2="50%"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    animate={{
                      pathLength: [0, 1, 0],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      delay: 0.5,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.line
                    x1="20%"
                    y1="80%"
                    x2="50%"
                    y2="50%"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    animate={{
                      pathLength: [0, 1, 0],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      delay: 1,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.line
                    x1="80%"
                    y1="80%"
                    x2="50%"
                    y2="50%"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    animate={{
                      pathLength: [0, 1, 0],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 3.8,
                      repeat: Infinity,
                      delay: 1.5,
                      ease: 'easeInOut',
                    }}
                  />
                </svg>
                
                {/* Floating feature cards with enhanced animations */}
                <div className="relative z-10 h-full flex flex-col justify-center items-center">
                  {/* Live Sessions Card - Blue with glow */}
                  <motion.div
                    className="absolute top-4 left-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 border-2 border-blue-400 shadow-2xl cursor-pointer group"
                    animate={{ 
                      y: [0, -12, 0], 
                      rotate: [-3, 3, -3],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    whileHover={{ 
                      scale: 1.2, 
                      zIndex: 30,
                      boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)',
                    }}
                  >
                    <div className="flex flex-col items-center gap-2 text-white">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      >
                        <Play className="w-6 h-6" />
                      </motion.div>
                      <span className="text-xs font-bold">Live Sessions</span>
                      <motion.span
                        className="text-[10px] opacity-75"
                        animate={{ opacity: [0.75, 1, 0.75] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        500+
                      </motion.span>
                    </div>
                  </motion.div>
                  
                  {/* Community Card - Purple with glow */}
                  <motion.div
                    className="absolute top-4 right-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 border-2 border-purple-400 shadow-2xl cursor-pointer group"
                    animate={{ 
                      y: [0, 12, 0], 
                      rotate: [3, -3, 3],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    whileHover={{ 
                      scale: 1.2, 
                      zIndex: 30,
                      boxShadow: '0 0 30px rgba(168, 85, 247, 0.8)',
                    }}
                  >
                    <div className="flex flex-col items-center gap-2 text-white">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Users className="w-6 h-6" />
                      </motion.div>
                      <span className="text-xs font-bold">Community</span>
                      <motion.span
                        className="text-[10px] opacity-75"
                        animate={{ opacity: [0.75, 1, 0.75] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      >
                        50+
                      </motion.span>
                    </div>
                  </motion.div>
                  
                  {/* Hackathons Card - Orange/Yellow with glow */}
                  <motion.div
                    className="absolute bottom-4 left-4 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl p-4 border-2 border-orange-400 shadow-2xl cursor-pointer group"
                    animate={{ 
                      y: [0, 12, 0], 
                      rotate: [3, -3, 3],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    whileHover={{ 
                      scale: 1.2, 
                      zIndex: 30,
                      boxShadow: '0 0 30px rgba(251, 146, 60, 0.8)',
                    }}
                  >
                    <div className="flex flex-col items-center gap-2 text-white">
                      <motion.div
                        animate={{ 
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Zap className="w-6 h-6" />
                      </motion.div>
                      <span className="text-xs font-bold">Hackathons</span>
                      <motion.span
                        className="text-[10px] opacity-75"
                        animate={{ opacity: [0.75, 1, 0.75] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      >
                        Active
                      </motion.span>
                    </div>
                  </motion.div>
                  
                  {/* Growth Card - Green with glow */}
                  <motion.div
                    className="absolute bottom-4 right-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 border-2 border-green-400 shadow-2xl cursor-pointer group"
                    animate={{ 
                      y: [0, -12, 0], 
                      rotate: [-3, 3, -3],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                    whileHover={{ 
                      scale: 1.2, 
                      zIndex: 30,
                      boxShadow: '0 0 30px rgba(34, 197, 94, 0.8)',
                    }}
                  >
                    <div className="flex flex-col items-center gap-2 text-white">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <TrendingUp className="w-6 h-6" />
                      </motion.div>
                      <span className="text-xs font-bold">Growth</span>
                      <motion.span
                        className="text-[10px] opacity-75"
                        animate={{ opacity: [0.75, 1, 0.75] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                      >
                        +25%
                      </motion.span>
                    </div>
                  </motion.div>
                  
                  {/* Center element - Enhanced with pulse and glow */}
                  <motion.div
                    className="bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 rounded-2xl p-8 border-4 border-yellow-300 shadow-2xl cursor-pointer relative overflow-hidden"
                    animate={{ 
                      scale: [1, 1.08, 1], 
                      rotate: [0, 3, 0],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    whileHover={{ 
                      scale: 1.15, 
                      zIndex: 30,
                      boxShadow: '0 0 40px rgba(251, 191, 36, 0.9)',
                    }}
                  >
                    {/* Pulse effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-2xl"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <div className="relative z-10 text-white text-center">
                      <motion.div
                        className="text-4xl font-bold mb-2 drop-shadow-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        10K+
                      </motion.div>
                      <div className="text-sm font-semibold opacity-95">Active Learners</div>
                      <motion.div
                        className="flex items-center justify-center gap-1 mt-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span className="text-[10px]">Growing Daily</span>
                        <Sparkles className="w-3 h-3" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.a
        href="#stats"
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label="Scroll to next section"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.a>
    </section>
  );
};

export default Hero;
