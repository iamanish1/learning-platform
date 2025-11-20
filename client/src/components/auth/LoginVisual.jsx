import { memo } from 'react';
import { motion } from 'framer-motion';
import { Code, Users, BookOpen, Trophy, GraduationCap } from 'lucide-react';

const LoginVisual = memo(() => {
  const benefits = [
    { icon: Users, text: '10,000+ active learners', stat: '10K+' },
    { icon: BookOpen, text: 'Free learning resources', stat: '500+' },
    { icon: Trophy, text: 'Hackathons & competitions', stat: '50+' },
    { icon: GraduationCap, text: 'Career opportunities', stat: '100+' },
  ];

  return (
    <div className="hidden lg:flex lg:w-3/5 relative bg-gradient-to-br from-primary-dark via-primary to-primary-light">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:40px_40px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 py-12 h-full text-white">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl xl:text-3xl font-bold">DevHubs Academy</h1>
          </div>
          <p className="text-white/80 text-sm xl:text-base ml-13">
            Empowering tier 2 & 3 college students
          </p>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl xl:text-4xl font-bold mb-3 leading-tight">
            Learn, Build, and Grow
          </h2>
          <p className="text-white/90 text-base xl:text-lg max-w-md leading-relaxed">
            Join thousands of students building real-world projects and advancing their careers in tech.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-2 gap-4 max-w-md"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <benefit.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-xl xl:text-2xl font-bold">{benefit.stat}</div>
              </div>
              <p className="text-white/80 text-xs xl:text-sm">{benefit.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
});

LoginVisual.displayName = 'LoginVisual';

export default LoginVisual;
