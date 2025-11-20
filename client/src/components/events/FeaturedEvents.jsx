import { memo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trophy, Calendar } from 'lucide-react';
import { getEventStatus, getEventTypeColors } from '../../utils/eventUtils';

/**
 * FeaturedEvents component for live/upcoming events carousel
 * @param {Object} props
 * @param {Array} props.events - Array of event objects
 */
const FeaturedEvents = memo(({ events = [] }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter live and upcoming events
  const featuredEvents = events.filter((event) => {
    const status = event.status || getEventStatus(event.startDate || event.date, event.endDate);
    return status === 'live' || status === 'upcoming';
  }).slice(0, 5); // Limit to 5 featured events

  if (featuredEvents.length === 0) {
    return null;
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Events</h2>
          <p className="text-gray-600">Don't miss these exciting events happening now or soon</p>
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
        {featuredEvents.map((event, index) => {
          const status = event.status || getEventStatus(event.startDate || event.date, event.endDate);
          const typeColors = getEventTypeColors(event.type);
          const isLive = status === 'live';
          const isFree = event.price === 0 || event.price === null || event.type === 'free' || !event.price;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex-shrink-0 w-full sm:w-96"
            >
              <div className="relative">
                {/* Featured Card with Enhanced Design */}
                <div className="bg-white rounded-xl shadow-xl border-2 border-primary/20 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div className={`relative h-56 bg-gradient-to-br ${typeColors.bg} overflow-hidden`}>
                    {/* Pulsing LIVE Badge */}
                    {isLive && (
                      <div className="absolute top-4 right-4 z-10">
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
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50"></div>
                          <span className="relative px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold uppercase tracking-wide shadow-lg flex items-center gap-2">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            Live
                          </span>
                        </motion.div>
                      </div>
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeColors.badge}`}
                      >
                        {event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'Event'}
                      </span>
                    </div>

                    {/* Pricing Badge */}
                    <div className="absolute bottom-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          isFree
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-purple-100 text-purple-800 border-purple-200'
                        }`}
                      >
                        {isFree ? 'Free' : event.price ? `$${event.price}` : 'Paid'}
                      </span>
                    </div>

                    {/* Quick Join Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.button
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/events/${event.id}`;
                        }}
                      >
                        {isLive ? <Trophy className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                        <span>{isLive ? 'Join Now' : 'Register'}</span>
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold text-xs">
                            {(event.organizer || event.instructor || 'TBA').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{event.organizer || event.instructor || 'TBA'}</span>
                      </div>

                      {(event.participants?.length || event.participantCount) && (
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-primary">
                            {event.participants?.length || event.participantCount || 0}
                          </span>{' '}
                          <span>participants</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
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

FeaturedEvents.displayName = 'FeaturedEvents';

export default FeaturedEvents;

