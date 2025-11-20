import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  Heart,
  MessageCircle,
  Eye,
  Share2,
  Bookmark,
  FileText,
  Code,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import {
  formatDate,
  getReadingTime,
  extractExcerpt,
  getPostType,
  formatAuthorName,
} from '../../utils/blogUtils';

/**
 * BlogCard component with enhanced design and engagement features
 * @param {Object} props
 * @param {Object} props.post - Post object
 * @param {number} props.index - Index for animation delay
 * @param {boolean} props.isAuthenticated - Whether user is authenticated
 */
const BlogCard = memo(({ post, index = 0, isAuthenticated = false }) => {
  const postType = getPostType(post);
  const authorName = formatAuthorName(post.author);
  const authorAvatar = typeof post.author === 'object' ? post.author.avatar : null;
  const excerpt = extractExcerpt(post.excerpt || post.content, 120);
  const readingTime = getReadingTime(post.content || post.excerpt || '');

  const getTypeBadgeStyles = () => {
    switch (postType) {
      case 'article':
        return {
          bg: 'from-blue-500/20 via-indigo-500/20 to-blue-200/20',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: FileText,
        };
      case 'project':
        return {
          bg: 'from-purple-500/20 via-pink-500/20 to-purple-200/20',
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: Code,
        };
      case 'documentation':
        return {
          bg: 'from-green-500/20 via-emerald-500/20 to-green-200/20',
          badge: 'bg-green-100 text-green-800 border-green-200',
          icon: BookOpen,
        };
      case 'opinion':
        return {
          bg: 'from-orange-500/20 via-red-500/20 to-orange-200/20',
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: MessageSquare,
        };
      default:
        return {
          bg: 'from-gray-500/20 via-gray-400/20 to-gray-200/20',
          badge: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: FileText,
        };
    }
  };

  const typeStyles = getTypeBadgeStyles();
  const TypeIcon = typeStyles.icon;

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/blog/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      // TODO: Show toast notification
    });
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement bookmark functionality
  };

  const tags = (post.tags || []).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <Link to={`/blog/${post.id}`} className="block">
        {/* Thumbnail/Header */}
        <div className={`relative h-48 bg-gradient-to-br ${typeStyles.bg} overflow-hidden`}>
          {/* Type Icon */}
          <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md">
            <div className={typeStyles.badge.split(' ')[1]}>
              <TypeIcon className="w-6 h-6" />
            </div>
          </div>

          {/* Type Badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeStyles.badge}`}
            >
              {postType.charAt(0).toUpperCase() + postType.slice(1)}
            </span>
          </div>

          {/* Featured Image (if available) */}
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}

          {/* Share and Bookmark Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {isAuthenticated && (
              <motion.button
                onClick={handleBookmark}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md hover:bg-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Bookmark post"
              >
                <Bookmark className="w-5 h-5 text-gray-700" />
              </motion.button>
            )}
            <motion.button
              onClick={handleShare}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md hover:bg-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Share post"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Category and Tags */}
          <div className="flex flex-wrap gap-2 items-center">
            {post.category && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md">
                {post.category}
              </span>
            )}
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {typeof tag === 'object' ? tag.name : tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>

          {/* Meta Information */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {/* Author */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-xs font-semibold">
                    {authorName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="truncate">{authorName}</span>
            </div>

            {/* Date and Reading Time */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(post.createdAt || post.publishedAt, 'relative')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{readingTime}</span>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
              {(post.likes || 0) > 0 && (
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{post.likes}</span>
                </div>
              )}
              {(post.comments?.length || post.commentCount || 0) > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{post.comments?.length || post.commentCount || 0}</span>
                </div>
              )}
              {(post.views || 0) > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{post.views}</span>
                </div>
              )}
            </div>
          </div>

          {/* Read More Button */}
          <motion.div
            className="pt-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors">
              Read More
            </button>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;

