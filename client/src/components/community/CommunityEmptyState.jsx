import { memo } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Plus } from 'lucide-react';

/**
 * CommunityEmptyState - Empty state component for communities
 * @param {Object} props
 * @param {Object} props.filters - Current active filters
 * @param {Function} props.onClearFilters - Callback to clear all filters
 * @param {boolean} props.isAuthenticated - Whether user is authenticated
 */
const CommunityEmptyState = memo(({ filters, onClearFilters, isAuthenticated = false }) => {
  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.search.trim() !== '';

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
            <Users className="w-12 h-12 text-gray-400" />
          )}
        </motion.div>

        {/* Message */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {hasActiveFilters ? 'No Communities Found' : 'No Communities Yet'}
        </h3>
        <p className="text-gray-600 mb-6">
          {hasActiveFilters
            ? 'Try adjusting your filters to find more communities.'
            : 'Be the first to create a community and start connecting!'}
        </p>

        {/* Actions */}
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onClearFilters}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-4 h-4" />
            <span>Clear All Filters</span>
          </motion.button>
        )}

        {!hasActiveFilters && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.a
              href="/community/create"
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Community</span>
            </motion.a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

CommunityEmptyState.displayName = 'CommunityEmptyState';

export default CommunityEmptyState;

