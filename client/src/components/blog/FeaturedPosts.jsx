import { memo, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Award, Heart, MessageCircle, Eye } from 'lucide-react';
import { formatDate, getReadingTime, formatAuthorName } from '../../utils/blogUtils';

/**
 * FeaturedPosts component for featured content carousel
 * @param {Object} props
 * @param {Array} props.posts - Array of post objects
 */
const FeaturedPosts = memo(({ posts = [] }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter featured posts (limit to 5)
  const featuredPosts = posts
    .filter((post) => post.featured || post.isFeatured)
    .slice(0, 5);

  if (featuredPosts.length === 0) {
    return null;
  }

  useEffect(() => {
    handleScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredPosts]);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Content</h2>
          <p className="text-gray-600">Handpicked articles, projects, and documentation</p>
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
        {featuredPosts.map((post, index) => {
          const authorName = formatAuthorName(post.author);
          const authorAvatar = typeof post.author === 'object' ? post.author.avatar : null;
          const readingTime = getReadingTime(post.content || post.excerpt || '');

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex-shrink-0 w-full sm:w-96"
            >
              <Link to={`/blog/${post.id}`}>
                <div className="relative">
                  {/* Featured Card */}
                  <div className="bg-white rounded-xl shadow-xl border-2 border-primary/20 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                    <div className="relative h-56 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-200/20 overflow-hidden">
                      {/* Featured Badge */}
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
                          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50"></div>
                          <span className="relative px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Featured
                          </span>
                        </motion.div>
                      </div>

                      {/* Featured Image */}
                      {post.featuredImage && (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                        />
                      )}

                      {/* Category Badge */}
                      {post.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary rounded-full text-xs font-semibold shadow-md">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {post.excerpt || post.content}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {authorAvatar ? (
                            <img
                              src={authorAvatar}
                              alt={authorName}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-semibold text-xs">
                                {authorName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="font-medium">{authorName}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{formatDate(post.createdAt || post.publishedAt, 'relative')}</span>
                          <span>•</span>
                          <span>{readingTime}</span>
                        </div>
                      </div>

                      {/* Engagement Metrics */}
                      <div className="flex items-center gap-4 pt-3 text-sm text-gray-600">
                        {(post.likes || 0) > 0 && (
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span>{post.likes}</span>
                          </div>
                        )}
                        {(post.comments?.length || post.commentCount || 0) > 0 && (
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4 text-blue-500" />
                            <span>{post.comments?.length || post.commentCount || 0}</span>
                          </div>
                        )}
                        {(post.views || 0) > 0 && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-gray-500" />
                            <span>{post.views}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
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

FeaturedPosts.displayName = 'FeaturedPosts';

export default FeaturedPosts;

