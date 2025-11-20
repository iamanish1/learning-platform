import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const EventDetail = ({ event, onRegister }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="text-gray-600">{event.description}</p>
        <Button onClick={onRegister}>Register</Button>
      </div>
    </Card>
  );
};

export default EventDetail;

