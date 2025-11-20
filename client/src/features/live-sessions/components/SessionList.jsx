import { Link } from 'react-router-dom';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const SessionList = ({ sessions }) => {
  return (
    <div className="space-y-6">
      {/* Filters would go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <Card key={session.id} hover>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{session.title}</h3>
              <p className="text-gray-600">{session.description}</p>
              <Link to={`/live-sessions/${session.id}`}>
                <Button className="w-full">View Details</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionList;

