import { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';
import { getUniqueCategories } from '../../utils/eventUtils';

/**
 * EventFilters component with tab-based filtering, search, and category chips
 * @param {Object} props
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {Array} props.events - All events for category extraction
 */
const EventFilters = memo(({ filters, onFilterChange, events = [] }) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showCategories, setShowCategories] = useState(false);
  const categories = getUniqueCategories(events);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== (filters.search || '')) {
        onFilterChange({ search: searchQuery });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters.search, onFilterChange]);

  const handleStatusChange = useCallback((status) => {
    onFilterChange({ status });
  }, [onFilterChange]);

  const handleTypeChange = useCallback((type) => {
    onFilterChange({ type });
  }, [onFilterChange]);

  const handleCategoryChange = useCallback((category) => {
    const newCategory = filters.category === category ? 'all' : category;
    onFilterChange({ category: newCategory });
  }, [filters.category, onFilterChange]);

  const handlePricingChange = useCallback((pricing) => {
    onFilterChange({ pricing });
  }, [onFilterChange]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    onFilterChange({ search: '' });
  }, [onFilterChange]);

  const handleClearAll = useCallback(() => {
    setSearchQuery('');
    onFilterChange({ status: 'all', type: 'all', category: 'all', search: '', pricing: 'all' });
  }, [onFilterChange]);

  const hasActiveFilters = filters.status !== 'all' || 
                          filters.type !== 'all' || 
                          filters.category !== 'all' || 
                          filters.pricing !== 'all' ||
                          searchQuery.trim() !== '';

  const statusTabs = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'live', label: 'Live' },
    { value: 'past', label: 'Past' },
  ];

  const typeTabs = [
    { value: 'all', label: 'All Types' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'challenge', label: 'Challenge' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'competition', label: 'Competition' },
  ];

  const pricingTabs = [
    { value: 'all', label: 'All Pricing' },
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' },
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
          placeholder="Search events by title, organizer, or topic..."
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mr-2">
          <Filter className="w-4 h-4" />
          <span>Status:</span>
        </div>
        {statusTabs.map((tab) => (
          <motion.button
            key={tab.value}
            onClick={() => handleStatusChange(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filters.status === tab.value
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mr-2">
          <span>Type:</span>
        </div>
        {typeTabs.map((tab) => (
          <motion.button
            key={tab.value}
            onClick={() => handleTypeChange(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filters.type === tab.value
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Pricing Tabs */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mr-2">
          <span>Pricing:</span>
        </div>
        {pricingTabs.map((tab) => (
          <motion.button
            key={tab.value}
            onClick={() => handlePricingChange(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filters.pricing === tab.value
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Category Chips */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span>Topics:</span>
            </div>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              {showCategories ? 'Show Less' : `Show All (${categories.length})`}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            <AnimatePresence>
              {(showCategories ? categories : categories.slice(0, 5)).map((category, index) => (
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

EventFilters.displayName = 'EventFilters';

export default EventFilters;

