import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  BookOpen,
  Code,
  FileText,
  Hash,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { formatAuthorName } from '../../utils/blogUtils';

/**
 * BlogSidebar - Community sidebar with trending topics, top authors, and quick links
 * @param {Object} props
 * @param {Array} props.trendingTags - Array of trending tag objects { name, count }
 * @param {Array} props.topAuthors - Array of top author objects
 * @param {Array} props.documentation - Array of documentation objects
 * @param {Object} props.stats - Statistics object
 * @param {Function} props.onTagClick - Callback when tag is clicked
 */
const BlogSidebar = memo(({ trendingTags = [], topAuthors = [], documentation = [], stats = {}, onTagClick }) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Community Stats
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>Posts</span>
            </div>
            <span className="font-semibold text-gray-900">{stats.total || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>Authors</span>
            </div>
            <span className="font-semibold text-gray-900">{stats.totalAuthors || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Code className="w-4 h-4" />
              <span>Projects</span>
            </div>
            <span className="font-semibold text-gray-900">{stats.projects || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>Documentation</span>
            </div>
            <span className="font-semibold text-gray-900">{stats.documentation || 0}</span>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      {trendingTags.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Trending Topics
          </h3>
          <div className="space-y-2">
            {trendingTags.slice(0, 8).map((tag, index) => (
              <motion.button
                key={tag.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onTagClick && onTagClick(tag.name)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate group-hover:text-primary transition-colors">
                    {tag.name}
                  </span>
                  {index < 3 && (
                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold rounded-full flex-shrink-0">
                      Hot
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{tag.count}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Top Authors */}
      {topAuthors.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Top Contributors
          </h3>
          <div className="space-y-3">
            {topAuthors.slice(0, 5).map((author, index) => (
              <Link
                key={author.id}
                to={`/blog/author/${author.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={formatAuthorName(author)}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold">
                    {formatAuthorName(author).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                    {formatAuthorName(author)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {author.postCount || 0} posts
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Documentation Links */}
      {documentation.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            Quick Docs
          </h3>
          <div className="space-y-2">
            {documentation.slice(0, 5).map((doc) => (
              <a
                key={doc.id}
                href={doc.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-sm text-gray-700 group-hover:text-primary transition-colors truncate flex-1">
                  {doc.title}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors ml-2 flex-shrink-0" />
              </a>
            ))}
          </div>
          <Link
            to="/blog?type=documentation"
            className="block mt-3 text-sm text-primary hover:text-primary-dark font-medium text-center"
          >
            View All Documentation →
          </Link>
        </div>
      )}

      {/* Write Post CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-6 text-white"
      >
        <h3 className="font-bold text-lg mb-2">Share Your Knowledge</h3>
        <p className="text-sm text-white/90 mb-4">
          Write articles, showcase projects, or share your thoughts with the community.
        </p>
        <Link to="/blog/new">
          <motion.button
            className="w-full px-4 py-2 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Post
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
});

BlogSidebar.displayName = 'BlogSidebar';

export default BlogSidebar;

