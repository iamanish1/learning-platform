import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../../shared/hooks/useSocket';
import {
  addChatMessage,
  addParticipant,
  removeParticipant,
  setParticipants,
} from '../../../store/slices/liveSessionsSlice';
import { SOCKET_EVENTS } from '../../../shared/constants';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const VirtualClassroom = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activeSession, chatMessages, participants } = useSelector((state) => state.liveSessions);
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const chatEndRef = useRef(null);

  const { emit, socket } = useSocket({
    [SOCKET_EVENTS.SESSION.CHAT_MESSAGE]: (data) => {
      dispatch(addChatMessage(data));
    },
    [SOCKET_EVENTS.SESSION.JOIN]: (data) => {
      dispatch(addParticipant(data.user));
    },
    'session:leave': (data) => {
      dispatch(removeParticipant(data.userId));
    },
    'session:participants': (data) => {
      dispatch(setParticipants(data.participants));
    },
  });

  useEffect(() => {
    if (socket && id) {
      emit(SOCKET_EVENTS.SESSION.JOIN, { sessionId: id });
    }

    return () => {
      if (socket && id) {
        emit(SOCKET_EVENTS.SESSION.LEAVE, { sessionId: id });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      emit(SOCKET_EVENTS.SESSION.CHAT_MESSAGE, {
        sessionId: id,
        message: message.trim(),
      });
      setMessage('');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Emit mute/unmute event
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // Emit video on/off event
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // Emit screen share event
  };

  return (
    <div className="h-[calc(100vh-200px)] flex gap-4">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xl">Live Session: {activeSession?.title}</p>
            {isScreenSharing && <p className="mt-2 text-sm text-gray-400">Screen sharing active</p>}
          </div>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-4">
          <Button variant={isMuted ? 'danger' : 'secondary'} onClick={toggleMute}>
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>
          <Button variant={isVideoOn ? 'secondary' : 'outline'} onClick={toggleVideo}>
            {isVideoOn ? 'Video Off' : 'Video On'}
          </Button>
          <Button variant={isScreenSharing ? 'primary' : 'outline'} onClick={toggleScreenShare}>
            {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 flex flex-col gap-4">
        {/* Participants */}
        <Card className="flex-1">
          <h3 className="font-semibold mb-4">Participants ({participants.length})</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  {participant.name?.[0] || 'U'}
                </div>
                <span className="text-sm">{participant.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat */}
        <Card className="flex-1 flex flex-col">
          <h3 className="font-semibold mb-4">Chat</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-semibold text-primary">{msg.user}:</span>
                <span className="ml-2">{msg.message}</span>
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
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" size="sm">Send</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VirtualClassroom;

