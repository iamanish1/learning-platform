import { Link } from 'react-router-dom';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Code, Video, FileText, Heart } from 'lucide-react';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import ScrollReveal from '../../shared/components/animations/ScrollReveal';
import HoverScale from '../../shared/components/animations/HoverScale';

const CommunityActivity = memo(() => {
  const activities = [
    {
      type: 'achievement',
      user: 'Rahul K.',
      action: 'earned the "Hackathon Winner" badge',
      time: '2 minutes ago',
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      type: 'project',
      user: 'Priya S.',
      action: 'published a new project',
      project: 'E-Commerce Dashboard',
      time: '15 minutes ago',
      icon: Code,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      type: 'session',
      user: '50+ students',
      action: 'are attending live session',
      session: 'React Advanced Patterns',
      time: 'Live now',
      icon: Video,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      isLive: true,
    },
    {
      type: 'blog',
      user: 'Anjali P.',
      action: 'published a new article',
      article: 'Getting Started with AI/ML',
      time: '1 hour ago',
      icon: FileText,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
  ];

  const featuredProjects = [
    {
      title: 'AI Chatbot Assistant',
      author: 'Vikram Singh',
      tech: ['React', 'Node.js', 'OpenAI'],
      likes: 45,
    },
    {
      title: 'E-Commerce Platform',
      author: 'Priya Sharma',
      tech: ['Next.js', 'MongoDB'],
      likes: 38,
    },
    {
      title: 'Task Management App',
      author: 'Rahul Kumar',
      tech: ['Vue.js', 'Firebase'],
      likes: 52,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join a <span className="text-primary">Thriving Community</span>
            </h2>
            <p className="text-xl text-gray-600">
              See what&apos;s happening right now
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Live Activity Feed */}
          <ScrollReveal delay={0.1}>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Live Activity</h3>
                <div className="flex items-center gap-2 text-green-600">
                  <motion.span
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium">247 students online</span>
                </div>
              </div>
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className={`p-2 ${activity.bgColor} rounded-lg group-hover:scale-110 transition-transform`}>
                        <IconComponent className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">
                          <span className="font-semibold">{activity.user}</span>{' '}
                          {activity.action}
                        </p>
                        {(activity.project || activity.session || activity.article) && (
                          <p className="text-primary font-medium text-sm mt-1">
                            {activity.project || activity.session || activity.article}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-gray-500 text-xs">{activity.time}</p>
                          {activity.isLive && (
                            <motion.span
                              className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium"
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              LIVE
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </ScrollReveal>

          {/* Featured Projects */}
          <ScrollReveal delay={0.2}>
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h3>
              <div className="space-y-4">
                {featuredProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <HoverScale>
                      <div className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all cursor-pointer">
                        <h4 className="font-bold text-gray-900 mb-2">{project.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">by {project.author}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 flex-wrap">
                            {project.tech.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            <span className="text-sm">{project.likes}</span>
                          </div>
                        </div>
                      </div>
                    </HoverScale>
                  </motion.div>
                ))}
              </div>
            </Card>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.3}>
          <div className="text-center">
            <Link to="/community">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="px-8">
                  Join Community Now →
                </Button>
              </motion.div>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
});

CommunityActivity.displayName = 'CommunityActivity';

export default CommunityActivity;
