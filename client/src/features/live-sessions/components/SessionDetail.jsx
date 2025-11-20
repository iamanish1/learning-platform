import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const SessionDetail = ({ session, onJoin }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{session.title}</h1>
        <p className="text-gray-600">{session.description}</p>
        <Button onClick={onJoin}>Join Session</Button>
      </div>
    </Card>
  );
};

export default SessionDetail;

