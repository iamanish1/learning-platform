import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPosts, setLoading, setFilters } from '../store/slices/blogSlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import Card from '../shared/components/Card';
import Button from '../shared/components/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner';

const Blog = () => {
  const dispatch = useDispatch();
  const { posts, loading, filters } = useSelector((state) => state.blog);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { get } = useApi();

  const loadPosts = useCallback(async () => {
    dispatch(setLoading(true));
    const result = await get(API_ENDPOINTS.BLOG.LIST);
    if (result.success) {
      dispatch(setPosts(result.data));
    }
    dispatch(setLoading(false));
  }, [dispatch, get]);

  useEffect(() => {
    loadPosts();
  }, [filters, loadPosts]);

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const filteredPosts = posts.filter((post) => {
    if (filters.category !== 'all' && post.category !== filters.category) return false;
    if (filters.search && !post.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog & Documentation</h1>
        {isAuthenticated && (
          <Link to="/blog/new">
            <Button>Write Article</Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search articles..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Categories</option>
          <option value="tutorial">Tutorial</option>
          <option value="guide">Guide</option>
          <option value="news">News</option>
          <option value="documentation">Documentation</option>
        </select>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">No articles found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} hover>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-gray-600 line-clamp-3">{post.excerpt || post.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <Link to={`/blog/${post.id}`}>
                  <Button variant="outline" className="w-full">Read More</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;

