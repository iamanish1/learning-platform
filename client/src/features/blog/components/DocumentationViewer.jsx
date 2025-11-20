import Card from '../../../shared/components/Card';

const DocumentationViewer = ({ documentation }) => {
  return (
    <Card>
      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold mb-6">{documentation.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: documentation.content }} />
      </div>
    </Card>
  );
};

export default DocumentationViewer;

