import { memo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';
import CommunityCard from './CommunityCard';

/**
 * FeaturedCommunities - Carousel for featured communities
 * @param {Object} props
 * @param {Array} props.communities - Array of featured community objects
 * @param {Array} props.myCommunities - User's joined communities
 */
const FeaturedCommunities = memo(({ communities = [], myCommunities = [] }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter featured communities (limit to 5)
  const featuredCommunities = communities
    .filter((community) => community.featured || community.isFeatured)
    .slice(0, 5);

  useEffect(() => {
    handleScroll();
  }, [featuredCommunities]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft =
        scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  if (featuredCommunities.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Featured Communities
          </h2>
          <p className="text-gray-600">Handpicked communities you shouldn't miss</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            whileHover={{ scale: canScrollLeft ? 1.05 : 1 }}
            whileTap={{ scale: canScrollLeft ? 0.95 : 1 }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </motion.button>
          <motion.button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            whileHover={{ scale: canScrollRight ? 1.05 : 1 }}
            whileTap={{ scale: canScrollRight ? 0.95 : 1 }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </motion.button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {featuredCommunities.map((community, index) => (
          <motion.div
            key={community.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex-shrink-0 w-full sm:w-96"
          >
            <div className="relative">
              {/* Featured Badge */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-2 -right-2 z-10"
              >
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50"></div>
                <span className="relative px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Featured
                </span>
              </motion.div>
              <CommunityCard community={community} index={index} myCommunities={myCommunities} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
});

FeaturedCommunities.displayName = 'FeaturedCommunities';

export default FeaturedCommunities;

