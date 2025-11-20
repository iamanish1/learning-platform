import { useState, useEffect, useRef, memo } from 'react';
import { Users, Video, Users as Communities, BookOpen } from 'lucide-react';
import ScrollReveal from '../../shared/components/animations/ScrollReveal';
import StaggerContainer from '../../shared/components/animations/StaggerContainer';
import StaggerItem from '../../shared/components/animations/StaggerItem';

const StatsBar = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    students: 0,
    sessions: 0,
    communities: 0,
    resources: 0,
  });
  const sectionRef = useRef(null);

  const targetCounts = {
    students: 10000,
    sessions: 500,
    communities: 50,
    resources: 1000,
  };

  const targetCountsRef = useRef(targetCounts);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const intervals = {};

    Object.keys(targetCountsRef.current).forEach((key) => {
      const target = targetCountsRef.current[key];
      const increment = target / steps;
      let current = 0;
      let step = 0;

      intervals[key] = setInterval(() => {
        step++;
        current = Math.min(Math.floor(increment * step), target);
        setCounts((prev) => ({ ...prev, [key]: current }));

        if (step >= steps) {
          clearInterval(intervals[key]);
          setCounts((prev) => ({ ...prev, [key]: target }));
        }
      }, stepDuration);
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, [isVisible]);

  const stats = [
    {
      icon: Users,
      value: counts.students.toLocaleString(),
      label: 'Active Students',
      suffix: '+',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Video,
      value: counts.sessions,
      label: 'Live Sessions',
      suffix: '+',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Communities,
      value: counts.communities,
      label: 'Communities',
      suffix: '+',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: BookOpen,
      value: counts.resources.toLocaleString(),
      label: 'Free Resources',
      suffix: '+',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <section id="stats" ref={sectionRef} className="py-16 bg-white border-y border-gray-200" aria-label="Platform Statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <StaggerItem key={index}>
                <ScrollReveal delay={index * 0.1}>
                  <div className="text-center group">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {stat.value}
                      {stat.suffix}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </ScrollReveal>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
});

StatsBar.displayName = 'StatsBar';

export default StatsBar;
