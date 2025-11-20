import { useSelector } from 'react-redux';
import Card from '../shared/components/Card';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <p className="text-lg">{user?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="text-lg">{user?.email || 'N/A'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;

