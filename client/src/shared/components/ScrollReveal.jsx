import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ScrollReveal = ({ children, className = '', delay = 0 }) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'revealed' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;

