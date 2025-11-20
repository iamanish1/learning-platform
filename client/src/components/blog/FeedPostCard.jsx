import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Clock,
  Eye,
  ExternalLink,
  Github,
  Code,
  FileText,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { formatDate, getReadingTime, extractExcerpt, getPostType, formatAuthorName } from '../../utils/blogUtils';

/**
 * FeedPostCard - Social media style post card for blog feed
 * @param {Object} props
 * @param {Object} props.post - Post object
 * @param {number} props.index - Index for animation delay
 * @param {boolean} props.isAuthenticated - Whether user is authenticated
 */
const FeedPostCard = memo(({ post, index = 0, isAuthenticated = false }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  const postType = getPostType(post);
  const authorName = formatAuthorName(post.author);
  const authorAvatar = typeof post.author === 'object' ? post.author.avatar : null;
  const excerpt = extractExcerpt(post.excerpt || post.content, 200);
  const readingTime = getReadingTime(post.content || post.excerpt || '');

  const getTypeIcon = () => {
    switch (postType) {
      case 'article':
        return FileText;
      case 'project':
        return Code;
      case 'documentation':
        return BookOpen;
      case 'opinion':
        return MessageSquare;
      default:
        return FileText;
    }
  };

  const getTypeColor = () => {
    switch (postType) {
      case 'article':
        return 'bg-blue-100 text-blue-700';
      case 'project':
        return 'bg-purple-100 text-purple-700';
      case 'documentation':
        return 'bg-green-100 text-green-700';
      case 'opinion':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const TypeIcon = getTypeIcon();

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount((prev) => (prev + (isLiked ? -1 : 1)));
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/blog/${post.id}`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: excerpt,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      // TODO: Show toast notification
    }
  };

  const categories = Array.isArray(post.categories || post.category)
    ? (post.categories || post.category)
    : post.categories || post.category
    ? [post.categories || post.category]
    : [];

  const categoryNames = categories
    .map((cat) => (typeof cat === 'object' ? cat.name : cat))
    .filter(Boolean)
    .slice(0, 2);

  const tags = (post.tags || []).slice(0, 3);
  const comments = post.comments || [];
  const recentComments = comments.slice(0, 2);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden"
    >
      <Link to={`/blog/${post.id}`} className="block">
        {/* Author Header */}
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-3">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 truncate">{authorName}</h3>
                {post.featured && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{formatDate(post.publishedAt || post.createdAt, 'relative')}</span>
                <span>•</span>
                <span>{readingTime}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTypeColor()}`}>
              <TypeIcon className="inline-block w-3 h-3 mr-1" />
              {postType.charAt(0).toUpperCase() + postType.slice(1)}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
            {post.title}
          </h2>

          {/* Categories & Tags */}
          {(categoryNames.length > 0 || tags.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {categoryNames.map((category, idx) => (
                <span
                  key={`cat-${idx}`}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
                >
                  {category}
                </span>
              ))}
              {tags.map((tag, idx) => (
                <span
                  key={`tag-${idx}`}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt */}
          <p className="text-gray-700 leading-relaxed mb-3 line-clamp-3">{excerpt}</p>

          {/* Project Links (if project) */}
          {postType === 'project' && (post.liveUrl || post.githubUrl) && (
            <div className="flex gap-2 mb-3">
              {post.liveUrl && (
                <a
                  href={post.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
              {post.githubUrl && (
                <a
                  href={post.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}
            </div>
          )}

          {/* Thumbnail (if available) */}
          {post.thumbnail && (
            <div className="rounded-lg overflow-hidden mb-3">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}
        </div>

        {/* Engagement Bar */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleLike}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'group-hover:fill-red-500/20'}`}
              />
              <span className="text-sm font-medium">{likesCount}</span>
            </motion.button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowComments(!showComments);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.commentCount || comments.length || 0}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>

            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Eye className="w-4 h-4" />
              <span>{post.views || 0}</span>
            </div>
          </div>

          {isAuthenticated && (
            <button
              onClick={handleBookmark}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bookmark
                className={`w-5 h-5 ${isBookmarked ? 'fill-primary text-primary' : 'text-gray-500'}`}
              />
            </button>
          )}
        </div>

        {/* Comments Preview */}
        <AnimatePresence>
          {showComments && comments.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 bg-gray-50"
            >
              <div className="p-4 space-y-3">
                {recentComments.map((comment, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-600">
                        {comment.author?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {comment.author || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt, 'relative')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {comments.length > 2 && (
                  <Link
                    to={`/blog/${post.id}#comments`}
                    className="block text-sm text-primary hover:text-primary-dark font-medium"
                  >
                    View all {comments.length} comments
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.article>
  );
});

FeedPostCard.displayName = 'FeedPostCard';

export default FeedPostCard;

