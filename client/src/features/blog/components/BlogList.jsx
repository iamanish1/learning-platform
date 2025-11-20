import { Link } from 'react-router-dom';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const BlogList = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.id} hover>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-600">{post.excerpt || post.content}</p>
            <Link to={`/blog/${post.id}`}>
              <Button variant="outline" className="w-full">Read More</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BlogList;

