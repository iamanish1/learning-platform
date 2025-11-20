import { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { setPosts, setLoading, setFilters, setTrendingTags, setFeaturedPosts, setDocumentation, setAuthors } from '../store/slices/blogSlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import FeedPostCard from '../components/blog/FeedPostCard';
import BlogSidebar from '../components/blog/BlogSidebar';
import FeedSearchBar from '../components/blog/FeedSearchBar';
import BlogFilters from '../components/blog/BlogFilters';
import BlogEmptyState from '../components/blog/BlogEmptyState';
import BlogSkeleton from '../components/blog/BlogSkeleton';
import { filterPosts, sortPosts, getPostStats, getTrendingTags, getPostType, formatAuthorName } from '../utils/blogUtils';
import { FileText, Plus, Sparkles } from 'lucide-react';
import { mockBlogPosts } from '../data/mockBlogPosts';

const Blog = () => {
  const dispatch = useDispatch();
  const { posts, loading, filters, trendingTags, featuredPosts, documentation } = useSelector((state) => state.blog);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { get } = useApi();
  const [showFilters, setShowFilters] = useState(false);
  const [feedType, setFeedType] = useState('latest'); // 'latest', 'trending', 'following'

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPosts = async () => {
    dispatch(setLoading(true));
    
    // TODO: Replace with actual API call once backend is connected
    // For now, use mock data
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Use mock data
      dispatch(setPosts(mockBlogPosts));
      
      // Extract and set trending tags
      const tags = getTrendingTags(mockBlogPosts, 15);
      dispatch(setTrendingTags(tags));
      
      // Extract featured posts
      const featured = mockBlogPosts.filter((post) => post.featured || post.isFeatured);
      dispatch(setFeaturedPosts(featured));

      // Extract documentation
      const docs = mockBlogPosts.filter((post) => getPostType(post) === 'documentation');
      dispatch(setDocumentation(docs));

      // Extract unique authors for sidebar
      const uniqueAuthors = Array.from(
        new Set(mockBlogPosts.map(post => typeof post.author === 'object' ? post.author.id : post.author))
      ).map(authorId => {
        const authorPosts = mockBlogPosts.filter(
          post => (typeof post.author === 'object' ? post.author.id : post.author) === authorId
        );
        const authorPost = authorPosts[0];
        return {
          id: authorId,
          name: formatAuthorName(authorPost.author),
          avatar: typeof authorPost.author === 'object' ? authorPost.author.avatar : null,
          postCount: authorPosts.length,
        };
      }).sort((a, b) => b.postCount - a.postCount); // Sort by post count
      
      dispatch(setAuthors(uniqueAuthors));

    } catch (error) {
      console.error('Error loading blog posts:', error);
      // Fallback to mock data on error
      dispatch(setPosts(mockBlogPosts));
      dispatch(setTrendingTags(getTrendingTags(mockBlogPosts, 15)));
      dispatch(setFeaturedPosts(mockBlogPosts.filter((post) => post.featured || post.isFeatured)));
      dispatch(setDocumentation(mockBlogPosts.filter((post) => getPostType(post) === 'documentation')));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFilterChange = useCallback(
    (newFilters) => {
      dispatch(setFilters({ ...filters, ...newFilters }));
    },
    [dispatch, filters]
  );

  const handleSearchChange = useCallback(
    (search) => {
      handleFilterChange({ search });
    },
    [handleFilterChange]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(setFilters({ 
      type: 'all', 
      category: 'all', 
      tag: 'all', 
      search: '', 
      sortBy: 'latest',
      author: 'all',
    }));
  }, [dispatch]);

  const handleTagClick = useCallback((tag) => {
    handleFilterChange({ tag, type: 'all' });
  }, [handleFilterChange]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = filterPosts(posts, filters);
    
    // Apply feed type sorting
    if (feedType === 'trending') {
      filtered = sortPosts(filtered, 'trending');
    } else if (feedType === 'latest') {
      filtered = sortPosts(filtered, 'latest');
    } else {
      filtered = sortPosts(filtered, filters.sortBy);
    }
    
    return filtered;
  }, [posts, filters, feedType]);

  // Calculate statistics
  const stats = useMemo(() => getPostStats(posts), [posts]);

  // Get top authors (from Redux state or calculate)
  const topAuthors = useSelector((state) => state.blog.authors || []);

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.tag !== 'all' ||
    filters.search.trim() !== '' ||
    filters.author !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Community Feed
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Discover, share, and learn from the community
              </p>
            </div>
            {isAuthenticated && (
              <Link to="/blog/new">
                <motion.button
                  className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Create Post</span>
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24">
              <BlogSidebar
                trendingTags={trendingTags}
                topAuthors={topAuthors}
                documentation={documentation}
                stats={stats}
                onTagClick={handleTagClick}
              />
            </div>
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-3 space-y-6">
            {/* Feed Type Selector */}
            <div className="flex items-center gap-2 bg-white rounded-xl p-2 border border-gray-200">
              <motion.button
                onClick={() => setFeedType('latest')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  feedType === 'latest'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Latest
              </motion.button>
              <motion.button
                onClick={() => setFeedType('trending')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  feedType === 'trending'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="inline-block w-4 h-4 mr-1" />
                Trending
              </motion.button>
            </div>

            {/* Search Bar */}
            <FeedSearchBar
              searchQuery={filters.search || ''}
              onSearchChange={handleSearchChange}
              onFilterClick={() => setShowFilters(!showFilters)}
            />

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <BlogFilters
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      posts={posts}
                      trendingTags={trendingTags}
                      authors={topAuthors}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Featured Post Banner (if any) */}
            {!loading && featuredPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Featured Post</h3>
                    <p className="text-white/90 text-sm mb-3">
                      {featuredPosts[0].title}
                    </p>
                    <Link to={`/blog/${featuredPosts[0].id}`}>
                      <motion.button
                        className="px-4 py-2 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Read Now
                      </motion.button>
                    </Link>
                  </div>
                  <FileText className="w-16 h-16 text-white/20" />
                </div>
              </motion.div>
            )}

            {/* Posts Feed */}
            {loading ? (
              <BlogSkeleton count={5} />
            ) : filteredPosts.length === 0 ? (
              <BlogEmptyState
                filters={filters}
                onClearFilters={handleClearFilters}
                isAuthenticated={isAuthenticated}
              />
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredPosts.map((post, index) => (
                  <FeedPostCard
                    key={post.id}
                    post={post}
                    index={index}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </motion.div>
            )}

            {/* Load More Button */}
            {!loading && filteredPosts.length > 0 && (
              <div className="text-center py-6">
                <motion.button
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Load More Posts
                </motion.button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Blog;
