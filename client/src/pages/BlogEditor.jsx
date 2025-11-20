import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPost, updatePost } from '../store/slices/blogSlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import Input from '../shared/components/Input';
import Button from '../shared/components/Button';
import Card from '../shared/components/Card';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { get, post, put } = useApi();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    category: 'tutorial',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      loadPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadPost = async () => {
    const result = await get(API_ENDPOINTS.BLOG.DETAIL(id));
    if (result.success) {
      setFormData({
        title: result.data.title,
        content: result.data.content,
        tags: result.data.tags?.join(', ') || '',
        category: result.data.category || 'tutorial',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    let result;
    if (id && id !== 'new') {
      result = await put(API_ENDPOINTS.BLOG.UPDATE(id), postData);
      if (result.success) {
        dispatch(updatePost(result.data));
      }
    } else {
      result = await post(API_ENDPOINTS.BLOG.CREATE, postData);
      if (result.success) {
        dispatch(addPost(result.data));
      }
    }

    setLoading(false);
    if (result.success) {
      navigate(`/blog/${result.data.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <h1 className="text-3xl font-bold mb-6">
          {id && id !== 'new' ? 'Edit Article' : 'Write New Article'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <Input
            label="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="react, javascript, tutorial"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="tutorial">Tutorial</option>
              <option value="guide">Guide</option>
              <option value="news">News</option>
              <option value="documentation">Documentation</option>
            </select>
          </div>
          <div className="flex gap-4">
            <Button type="submit" loading={loading}>
              {id && id !== 'new' ? 'Update' : 'Publish'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/blog')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BlogEditor;

