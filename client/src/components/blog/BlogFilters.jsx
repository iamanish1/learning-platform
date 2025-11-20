import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, SortAsc } from 'lucide-react';
import { getTrendingTags, getUniqueCategories } from '../../utils/blogUtils';

/**
 * BlogFilters component with comprehensive filtering options
 * @param {Object} props
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {Array} props.posts - All posts for category/tag extraction
 */
const BlogFilters = memo(({ filters, onFilterChange, posts = [] }) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showCategories, setShowCategories] = useState(false);
  const [showTags, setShowTags] = useState(false);
  
  // Extract unique categories from posts
  const categories = useMemo(() => {
    const categoriesSet = new Set();
    (posts || []).forEach((post) => {
      if (post.category) {
        categoriesSet.add(post.category);
      }
    });
    return Array.from(categoriesSet).sort();
  }, [posts]);
  
  const trendingTags = getTrendingTags(posts || [], 15);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== (filters.search || '')) {
        onFilterChange({ search: searchQuery });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters.search, onFilterChange]);

  const handleTypeChange = useCallback((type) => {
    onFilterChange({ type });
  }, [onFilterChange]);

  const handleCategoryChange = useCallback((category) => {
    const newCategory = filters.category === category ? 'all' : category;
    onFilterChange({ category: newCategory });
  }, [filters.category, onFilterChange]);

  const handleTagChange = useCallback((tag) => {
    const newTag = filters.tag === tag ? 'all' : tag;
    onFilterChange({ tag: newTag });
  }, [filters.tag, onFilterChange]);

  const handleSortChange = useCallback((sortBy) => {
    onFilterChange({ sortBy });
  }, [onFilterChange]);

  const handleAuthorChange = useCallback((author) => {
    onFilterChange({ author });
  }, [onFilterChange]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    onFilterChange({ search: '' });
  }, [onFilterChange]);

  const handleClearAll = useCallback(() => {
    setSearchQuery('');
    onFilterChange({ 
      status: 'all', 
      type: 'all', 
      category: 'all', 
      tag: 'all',
      search: '', 
      sortBy: 'latest',
      author: 'all',
    });
  }, [onFilterChange]);

  const hasActiveFilters = 
    filters.type !== 'all' || 
    filters.category !== 'all' || 
    filters.tag !== 'all' ||
    filters.sortBy !== 'latest' ||
    filters.author !== 'all' ||
    searchQuery.trim() !== '';

  const typeTabs = [
    { value: 'all', label: 'All' },
    { value: 'article', label: 'Articles' },
    { value: 'project', label: 'Projects' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'opinion', label: 'Opinions' },
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'trending', label: 'Trending' },
    { value: 'popular', label: 'Popular' },
    { value: 'most_commented', label: 'Most Commented' },
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
          placeholder="Search articles, projects, documentation..."
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

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mr-2">
          <Filter className="w-4 h-4" />
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

      {/* Sort and Category Row */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-gray-500" />
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-sm font-medium"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Categories:</span>
            <div className="flex flex-wrap gap-2">
              {(showCategories ? categories : categories.slice(0, 5)).map((category) => (
                <motion.button
                  key={category}
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
              {categories.length > 5 && (
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  {showCategories ? 'Show Less' : `+${categories.length - 5} More`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trending Tags */}
      {trendingTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span>Trending Topics:</span>
            </div>
            <button
              onClick={() => setShowTags(!showTags)}
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              {showTags ? 'Show Less' : `Show All (${trendingTags.length})`}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            <AnimatePresence>
              {(showTags ? trendingTags : trendingTags.slice(0, 8)).map((tag, index) => {
                const isTrending = index < 5; // Top 5 are trending
                const isSelected = filters.tag === tag.name;
                
                return (
                  <motion.button
                    key={tag.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleTagChange(tag.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 relative ${
                      isSelected
                        ? 'bg-primary text-white shadow-md'
                        : isTrending
                        ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isTrending && !isSelected && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    )}
                    {tag.name}
                    {isTrending && (
                      <span className="ml-1 text-[10px] opacity-75">({tag.count})</span>
                    )}
                  </motion.button>
                );
              })}
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

BlogFilters.displayName = 'BlogFilters';

export default BlogFilters;

