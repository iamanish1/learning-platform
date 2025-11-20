import { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, TrendingUp, Plus, Filter, Clock } from 'lucide-react';
import { formatLastActivity } from '../../utils/communityUtils';

/**
 * DiscussionThread - Discussion forum component
 * @param {Object} props
 * @param {Array} props.discussions - Array of discussion objects
 * @param {string} props.communityId - Community ID
 * @param {Function} props.onCreateDiscussion - Callback to create new discussion
 */
const DiscussionThread = memo(({ discussions = [], communityId, onCreateDiscussion }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const categories = ['all', ...new Set(discussions.map((d) => d.category).filter(Boolean))];

  const filteredDiscussions = discussions.filter((discussion) => {
    if (selectedCategory !== 'all' && discussion.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'most-liked':
        return (b.likes || 0) - (a.likes || 0);
      case 'most-commented':
        return (b.commentCount || b.comments?.length || 0) - (a.commentCount || a.comments?.length || 0);
      case 'trending':
        const aScore = (a.likes || 0) * 0.3 + (a.commentCount || a.comments?.length || 0) * 0.7;
        const bScore = (b.likes || 0) * 0.3 + (b.commentCount || b.comments?.length || 0) * 0.7;
        return bScore - aScore;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Discussions</h3>
          <p className="text-sm text-gray-600 mt-1">
            {discussions.length} {discussions.length === 1 ? 'discussion' : 'discussions'}
          </p>
        </div>
        <motion.button
          onClick={onCreateDiscussion}
          className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>New Discussion</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category === 'all' ? 'All' : category}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="latest">Latest</option>
            <option value="most-liked">Most Liked</option>
            <option value="most-commented">Most Commented</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>

      {/* Discussions List */}
      {sortedDiscussions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No discussions yet</h4>
          <p className="text-gray-600 mb-6">Start the first discussion in this community!</p>
          <motion.button
            onClick={onCreateDiscussion}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Create Discussion</span>
          </motion.button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDiscussions.map((discussion, index) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <Link to={`/community/${communityId}/discussion/${discussion.id}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {discussion.category && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md">
                            {discussion.category}
                          </span>
                        )}
                        {discussion.bestAnswer && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
                            ✓ Solved
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {discussion.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{discussion.content || discussion.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-semibold">
                          {discussion.author?.avatar ? (
                            <img
                              src={discussion.author.avatar}
                              alt={discussion.author.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            discussion.author?.name?.charAt(0) || 'U'
                          )}
                        </div>
                        <span className="font-medium">{discussion.author?.name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatLastActivity(discussion.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span className="font-medium">{discussion.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium">{discussion.commentCount || discussion.comments?.length || 0}</span>
                      </div>
                      {discussion.trending && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-medium">Trending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
});

DiscussionThread.displayName = 'DiscussionThread';

export default DiscussionThread;

