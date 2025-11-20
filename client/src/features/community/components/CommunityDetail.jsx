import Card from '../../../shared/components/Card';

const CommunityDetail = ({ community }) => {
  return (
    <Card>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">{community.name}</h1>
        <p className="text-gray-600">{community.description}</p>
      </div>
    </Card>
  );
};

export default CommunityDetail;

