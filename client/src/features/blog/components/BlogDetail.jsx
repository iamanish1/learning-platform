import Card from '../../../shared/components/Card';

const BlogDetail = ({ post }) => {
  return (
    <Card>
      <article>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </Card>
  );
};

export default BlogDetail;

