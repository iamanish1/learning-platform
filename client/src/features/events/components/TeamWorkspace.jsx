import { useState } from 'react';
import { useSocket } from '../../../shared/hooks/useSocket';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const TeamWorkspace = ({ team, eventId }) => {
  const [messages] = useState([]);
  const [message, setMessage] = useState('');
  const { emit } = useSocket({});

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      emit('event:team:collaboration', {
        eventId,
        teamId: team.id,
        message: message.trim(),
      });
      setMessage('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <h3 className="font-semibold mb-4">Team Collaboration</h3>
        <div className="space-y-2 mb-4 h-64 overflow-y-auto custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className="p-2 bg-gray-50 rounded">
              <p className="text-sm">{msg.message}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button type="submit" size="sm">Send</Button>
        </form>
      </Card>
      <Card>
        <h3 className="font-semibold mb-4">Team Members</h3>
        <div className="space-y-2">
          {team.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                {member.name?.[0] || 'M'}
              </div>
              <span className="text-sm">{member.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TeamWorkspace;

