import { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

/**
 * TrendingTags component for displaying trending topics
 * @param {Object} props
 * @param {Array} props.tags - Array of trending tag objects { name, count }
 * @param {Function} props.onTagClick - Callback when tag is clicked
 * @param {string} props.selectedTag - Currently selected tag
 */
const TrendingTags = memo(({ tags = [], onTagClick, selectedTag = 'all' }) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {tags.map((tag, index) => {
          const isSelected = selectedTag === tag.name;
          const isHot = index < 5; // Top 5 are "hot"

          return (
            <motion.button
              key={tag.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onTagClick(tag.name)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                relative flex items-center gap-2
                ${
                  isSelected
                    ? 'bg-primary text-white shadow-md'
                    : isHot
                    ? 'bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isHot && !isSelected && (
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
                />
              )}
              <span>{tag.name}</span>
              <span className={`text-xs ${isSelected ? 'text-white/80' : 'opacity-75'}`}>
                ({tag.count})
              </span>
            </motion.button>
          );
        })}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
});

TrendingTags.displayName = 'TrendingTags';

export default TrendingTags;

