import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Card from '../../shared/components/Card';
import ScrollReveal from '../../shared/components/animations/ScrollReveal';
import StaggerContainer from '../../shared/components/animations/StaggerContainer';
import StaggerItem from '../../shared/components/animations/StaggerItem';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'Is it really free?',
      answer: 'Yes! DevHubs Academy is 100% free to start. You can join communities, attend free live sessions, read blogs, and participate in events without any cost. Some premium sessions may have a fee, but the majority of our content is completely free.',
    },
    {
      question: 'Do I need prior experience?',
      answer: 'Not at all! DevHubs Academy is designed for students at all levels, including complete beginners. Our community and mentors are here to help you learn from scratch. We have resources for everyone, from basics to advanced topics.',
    },
    {
      question: 'What if I\'m from a tier 3 college?',
      answer: 'That\'s exactly why we built DevHubs Academy! We specifically focus on tier 2 & 3 college students. Your college doesn\'t define your potential. Our platform provides the resources, community, and opportunities you need to succeed, regardless of your college tier.',
    },
    {
      question: 'How do I get started?',
      answer: 'Getting started is easy! Just click "Get Started Free" above, create your account (takes 30 seconds), choose your community, and start learning. No credit card required, no commitments.',
    },
    {
      question: 'Can I get a certificate?',
      answer: 'Yes! We offer certificates for completed courses and hackathons. These certificates can be added to your LinkedIn profile and resume to showcase your skills to employers.',
    },
    {
      question: 'What makes DevHubs different from other platforms?',
      answer: 'DevHubs Academy is built specifically for tier 2 & 3 college students. We focus on community, real-time mentorship, hands-on projects, and building a portfolio. Unlike other platforms, we emphasize peer learning and collaboration, not just passive video watching.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about DevHubs Academy
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.1}>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <StaggerItem key={index}>
                <ScrollReveal delay={index * 0.05}>
                  <Card className="overflow-hidden">
                    <motion.button
                      onClick={() => toggleFAQ(index)}
                      className="w-full text-left flex items-center justify-between p-6 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                      aria-expanded={openIndex === index}
                      aria-controls={`faq-answer-${index}`}
                      id={`faq-question-${index}`}
                      type="button"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <h3 className="text-lg font-bold text-gray-900 pr-8">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-6 h-6 text-primary flex-shrink-0" />
                      </motion.div>
                    </motion.button>
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          id={`faq-answer-${index}`}
                          role="region"
                          aria-labelledby={`faq-question-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </ScrollReveal>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default FAQ;
