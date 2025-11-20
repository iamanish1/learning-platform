import { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { getUniqueCategories } from '../../utils/communityUtils';

/**
 * CommunityFilters - Comprehensive filtering component
 * @param {Object} props
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {Array} props.communities - All communities for category extraction
 */
const CommunityFilters = memo(({ filters, onFilterChange, communities = [] }) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const categories = getUniqueCategories(communities);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== (filters.search || '')) {
        onFilterChange({ search: searchQuery });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters.search, onFilterChange]);

  const handleCategoryChange = useCallback((category) => {
    const newCategory = filters.category === category ? 'all' : category;
    onFilterChange({ category: newCategory });
  }, [filters.category, onFilterChange]);

  const handleTypeChange = useCallback((type) => {
    onFilterChange({ type });
  }, [onFilterChange]);

  const handleSortByChange = useCallback((sortBy) => {
    onFilterChange({ sortBy });
  }, [onFilterChange]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    onFilterChange({ search: '' });
  }, [onFilterChange]);

  const handleClearAll = useCallback(() => {
    setSearchQuery('');
    onFilterChange({
      category: 'all',
      type: 'all',
      search: '',
      sortBy: 'popular',
    });
  }, [onFilterChange]);

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.search.trim() !== '' ||
    filters.sortBy !== 'popular';

  const typeTabs = [
    { value: 'all', label: 'All', icon: '🌐' },
    { value: 'public', label: 'Public', icon: '🌐' },
    { value: 'private', label: 'Private', icon: '🔒' },
    { value: 'invite-only', label: 'Invite Only', icon: '✉️' },
  ];

  const sortByOptions = [
    { value: 'popular', label: 'Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'most-active', label: 'Most Active' },
    { value: 'most-members', label: 'Most Members' },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search communities..."
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
        />
        {searchQuery && (
          <motion.button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Type Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mr-2">
          <Filter className="w-4 h-4" />
          <span>Type:</span>
        </div>
        {typeTabs.map((tab) => (
          <motion.button
            key={tab.value}
            onClick={() => handleTypeChange(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              filters.type === tab.value
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Category Filter Chips */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span>Categories:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    filters.category === category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Sort Dropdown */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Sort by:</span>
        </div>
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortByChange(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
        >
          {sortByOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClearAll}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Clear all filters</span>
        </motion.button>
      )}
    </div>
  );
});

CommunityFilters.displayName = 'CommunityFilters';

export default CommunityFilters;

