import { useState, useRef, useEffect } from 'react';
import { getOptimizedImageUrl } from '../utils/imageOptimization';

const LazyImage = ({ src, alt, className = '', placeholder = null, ...props }) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const optimizedUrl = getOptimizedImageUrl(src);
            setImageSrc(optimizedUrl);
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${!isLoaded ? 'opacity-50' : 'opacity-100 transition-opacity duration-300'}`}
      {...props}
    />
  );
};

export default LazyImage;

