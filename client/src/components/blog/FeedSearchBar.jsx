import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';

/**
 * FeedSearchBar - Simplified search bar for feed layout
 * @param {Object} props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Callback when search changes
 * @param {Function} props.onFilterClick - Callback when filter button is clicked
 */
const FeedSearchBar = memo(({ searchQuery = '', onSearchChange, onFilterClick }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearchChange(localQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, searchQuery, onSearchChange]);

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
  };

  return (
    <div className="sticky top-4 z-10 mb-6">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search posts, projects, or docs..."
            className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 shadow-sm"
          />
          {localQuery && (
            <motion.button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>
        <motion.button
          onClick={onFilterClick}
          className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-center gap-2 shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="hidden sm:inline text-sm font-medium text-gray-700">Filters</span>
        </motion.button>
      </div>
    </div>
  );
});

FeedSearchBar.displayName = 'FeedSearchBar';

export default FeedSearchBar;

