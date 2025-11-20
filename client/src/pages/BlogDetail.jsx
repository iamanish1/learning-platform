import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActivePost, setComments, setLoading } from '../store/slices/blogSlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import Card from '../shared/components/Card';
import Button from '../shared/components/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner';
import CommentSection from '../features/blog/components/CommentSection';

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activePost, comments, loading } = useSelector((state) => state.blog);
  const { get } = useApi();

  useEffect(() => {
    loadPost();
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadPost = async () => {
    dispatch(setLoading(true));
    const result = await get(API_ENDPOINTS.BLOG.DETAIL(id));
    if (result.success) {
      dispatch(setActivePost(result.data));
    }
    dispatch(setLoading(false));
  };

  const loadComments = async () => {
    const result = await get(API_ENDPOINTS.BLOG.COMMENTS(id));
    if (result.success) {
      dispatch(setComments(result.data));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!activePost) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Article not found</p>
        <Link to="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/blog">
        <Button variant="ghost">← Back</Button>
      </Link>

      <Card>
        <article className="space-y-6">
          <div>
            <div className="flex gap-2 mb-4">
              {activePost.tags?.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-bold mb-4">{activePost.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <span>By {activePost.author}</span>
              <span>•</span>
              <span>{new Date(activePost.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: activePost.content }} />
          </div>
        </article>
      </Card>

      <CommentSection postId={id} comments={comments} />
    </div>
  );
};

export default BlogDetail;

