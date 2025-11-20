import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addComment } from '../../../store/slices/blogSlice';
import { useApi } from '../../../shared/hooks/useApi';
import { API_ENDPOINTS } from '../../../shared/constants';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const CommentSection = ({ postId, comments }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { post } = useApi();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !isAuthenticated) return;

    setLoading(true);
    const result = await post(API_ENDPOINTS.BLOG.COMMENTS(postId), {
      content: comment.trim(),
    });

    if (result.success) {
      dispatch(addComment(result.data));
      setComment('');
    }
    setLoading(false);
  };

  const renderComments = (commentList, parentId = null) => {
    return commentList
      .filter((c) => c.parentId === parentId)
      .map((comment) => (
        <div key={comment.id} className="ml-4 space-y-2">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{comment.author}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
          {renderComments(commentList, comment.id)}
        </div>
      ));
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
      
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="space-y-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" loading={loading}>
              Post Comment
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          renderComments(comments)
        )}
      </div>
    </Card>
  );
};

export default CommentSection;

