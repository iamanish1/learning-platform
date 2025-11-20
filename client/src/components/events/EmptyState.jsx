import { memo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Trophy } from 'lucide-react';

/**
 * EmptyState component with contextual messaging
 * @param {Object} props
 * @param {Object} props.filters - Current active filters
 * @param {Function} props.onClearFilters - Callback to clear all filters
 */
const EmptyState = memo(({ filters, onClearFilters }) => {
  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.pricing !== 'all' ||
    (filters.search && filters.search.trim() !== '');

  const getMessage = () => {
    if (hasActiveFilters) {
      if (filters.search) {
        return `No events found matching "${filters.search}"`;
      }
      if (filters.status !== 'all') {
        return `No ${filters.status} events available`;
      }
      if (filters.type !== 'all') {
        return `No ${filters.type} events available`;
      }
      if (filters.category !== 'all') {
        return `No events found in "${filters.category}" category`;
      }
      if (filters.pricing !== 'all') {
        return `No ${filters.pricing} events available`;
      }
      return 'No events match your current filters';
    }
    return 'No events available at the moment';
  };

  const getSuggestions = () => {
    if (hasActiveFilters) {
      return [
        'Try adjusting your filters',
        'Clear all filters to see all events',
        'Check back later for new events',
      ];
    }
    return [
      'New events are added regularly',
      'Check back soon for upcoming events',
      'Browse other sections of the platform',
    ];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="max-w-md text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
        >
          {hasActiveFilters ? (
            <Search className="w-12 h-12 text-gray-400" />
          ) : (
            <Trophy className="w-12 h-12 text-gray-400" />
          )}
        </motion.div>

        {/* Message */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {hasActiveFilters ? 'No Results Found' : 'No Events Available'}
        </h3>
        <p className="text-gray-600 mb-6">{getMessage()}</p>

        {/* Suggestions */}
        <div className="space-y-2 mb-6">
          {getSuggestions().map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              <span>{suggestion}</span>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onClearFilters}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-4 h-4" />
            <span>Clear All Filters</span>
          </motion.button>
        )}

        {!hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.a
              href="/live-sessions"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-4 h-4" />
              <span>Browse Sessions</span>
            </motion.a>
            <motion.a
              href="/blog"
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trophy className="w-4 h-4" />
              <span>Read Blog</span>
            </motion.a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;

