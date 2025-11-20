import { Link } from 'react-router-dom';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const EventList = ({ events }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} hover>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <p className="text-gray-600">{event.description}</p>
            <Link to={`/events/${event.id}`}>
              <Button className="w-full">View Details</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EventList;

