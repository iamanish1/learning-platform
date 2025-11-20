import { Link } from 'react-router-dom';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const CommunityList = ({ communities }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {communities.map((community) => (
        <Card key={community.id} hover>
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">{community.name}</h3>
            <p className="text-gray-600">{community.description}</p>
            <Link to={`/community/${community.id}`}>
              <Button className="w-full">Join</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CommunityList;

