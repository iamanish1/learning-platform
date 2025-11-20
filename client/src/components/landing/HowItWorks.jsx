import { motion } from 'framer-motion';
import { UserPlus, Users, BookOpen, Award } from 'lucide-react';
import ScrollReveal from '../../shared/components/animations/ScrollReveal';
import StaggerContainer from '../../shared/components/animations/StaggerContainer';
import StaggerItem from '../../shared/components/animations/StaggerItem';
import HoverScale from '../../shared/components/animations/HoverScale';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Sign Up Free',
      description: 'Create your account in 30 seconds. No credit card required. Start learning immediately.',
      icon: UserPlus,
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: '02',
      title: 'Join Your Community',
      description: 'Choose from AI/ML, Web Dev, Cybersecurity, or College Clubs. Connect with like-minded students.',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    },
    {
      number: '03',
      title: 'Learn & Build Skills',
      description: 'Attend live sessions, join hackathons, read blogs, and collaborate on projects. Build your portfolio.',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
    },
    {
      number: '04',
      title: 'Showcase & Get Hired',
      description: 'Display your projects, achievements, and skills. Get noticed by recruiters and land your dream job.',
      icon: Award,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 4 simple steps
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Animated Timeline Line */}
            <motion.div
              className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-primary transform -translate-y-1/2"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />

            <StaggerContainer staggerDelay={0.2}>
              <div className="grid grid-cols-4 gap-8 relative">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <StaggerItem key={index}>
                      <ScrollReveal delay={index * 0.15}>
                        <HoverScale>
                          <div className="text-center group">
                            <div className="relative mb-6">
                              <motion.div
                                className={`w-24 h-24 mx-auto bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white shadow-lg relative z-10 group-hover:shadow-2xl transition-shadow`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                              >
                                <IconComponent className="w-10 h-10" />
                              </motion.div>
                              <motion.div
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full -z-10"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                              />
                            </div>
                            <div className="text-6xl font-bold text-primary/20 mb-2">{step.number}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                              {step.title}
                            </h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </HoverScale>
                      </ScrollReveal>
                    </StaggerItem>
                  );
                })}
              </div>
            </StaggerContainer>
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <ScrollReveal key={index} delay={index * 0.1}>
                <HoverScale>
                  <div className="flex gap-6 group">
                    <div className="flex-shrink-0">
                      <motion.div
                        className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <IconComponent className="w-8 h-8" />
                      </motion.div>
                      {index < steps.length - 1 && (
                        <div className="w-1 h-full bg-gradient-to-b from-primary to-primary-light mx-auto mt-4 min-h-[80px]"></div>
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="text-4xl font-bold text-primary/20 mb-2">{step.number}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </HoverScale>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
