import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../../shared/hooks/useSocket';
import { addChatMessage } from '../../../store/slices/communitySlice';
import { SOCKET_EVENTS } from '../../../shared/constants';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const GroupChat = ({ communityId }) => {
  const dispatch = useDispatch();
  const { chatMessages } = useSelector((state) => state.community);
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);
  const { emit, socket } = useSocket({
    [SOCKET_EVENTS.COMMUNITY.CHAT_MESSAGE]: (data) => {
      if (data.communityId === communityId) {
        dispatch(addChatMessage(data));
      }
    },
  });

  useEffect(() => {
    if (socket && communityId) {
      socket.emit('community:join', { communityId });
    }

    return () => {
      if (socket && communityId) {
        socket.emit('community:leave', { communityId });
      }
    };
  }, [socket, communityId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      emit(SOCKET_EVENTS.COMMUNITY.CHAT_MESSAGE, {
        communityId,
        message: message.trim(),
        userId: user?.id,
        userName: user?.name,
      });
      setMessage('');
    }
  };

  return (
    <Card>
      <h3 className="font-semibold mb-4">Group Chat</h3>
      <div className="flex flex-col h-96">
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-4">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg ${
                msg.userId === user?.id
                  ? 'bg-primary text-white ml-auto max-w-xs'
                  : 'bg-gray-100 max-w-xs'
              }`}
            >
              <p className="text-sm font-semibold mb-1">{msg.userName}</p>
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" size="sm">Send</Button>
        </form>
      </div>
    </Card>
  );
};

export default GroupChat;

