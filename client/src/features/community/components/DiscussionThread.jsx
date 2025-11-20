import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useApi } from '../../../shared/hooks/useApi';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const DiscussionThread = ({ discussion, communityId }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { post } = useApi();
  const [reply, setReply] = useState('');

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !isAuthenticated) return;

    const result = await post(`/communities/${communityId}/discussions/${discussion.id}/replies`, {
      content: reply.trim(),
    });

    if (result.success) {
      // Reload discussion
      setReply('');
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{discussion.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>By {discussion.author}</span>
            <span>•</span>
            <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-700">{discussion.content}</p>
        </div>

        {/* Replies */}
        <div className="space-y-4">
          <h3 className="font-semibold">Replies ({discussion.replies?.length || 0})</h3>
          {discussion.replies?.map((reply) => (
            <div key={reply.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold">{reply.author}</p>
                <span className="text-sm text-gray-500">
                  {new Date(reply.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{reply.content}</p>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        {isAuthenticated && (
          <form onSubmit={handleReply} className="space-y-4">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a reply..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit">Post Reply</Button>
          </form>
        )}
      </div>
    </Card>
  );
};

export default DiscussionThread;

