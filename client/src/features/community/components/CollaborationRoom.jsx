import { useState } from 'react';
import { useSocket } from '../../../shared/hooks/useSocket';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const CollaborationRoom = ({ roomId }) => {
  const [code, setCode] = useState('');
  const { emit } = useSocket({});

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    emit('collaboration:code:change', { roomId, code: newCode });
  };

  return (
    <Card>
      <h3 className="font-semibold mb-4">Collaboration Room</h3>
      <div className="space-y-4">
        <textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="Start coding together..."
          rows={20}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2">
          <Button size="sm">Run Code</Button>
          <Button variant="outline" size="sm">Save</Button>
        </div>
      </div>
    </Card>
  );
};

export default CollaborationRoom;

