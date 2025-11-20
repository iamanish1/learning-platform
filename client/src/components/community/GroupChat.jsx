import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../shared/hooks/useSocket';
import { addChatMessage, setChatMessages } from '../../store/slices/communitySlice';
import { SOCKET_EVENTS } from '../../shared/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Paperclip, Search, ChevronDown, X, Image as ImageIcon, File } from 'lucide-react';
// Date formatting utility (using native Date methods instead of date-fns)

/**
 * Enhanced GroupChat - Modern chat interface with rich features
 * @param {Object} props
 * @param {string} props.communityId - Community ID
 */
const GroupChat = memo(({ communityId }) => {
  const dispatch = useDispatch();
  const { chatMessages, members } = useSelector((state) => state.community);
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOnlineMembers, setShowOnlineMembers] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get messages for this community
  const communityMessages = chatMessages[communityId] || [];
  const communityMembers = members[communityId] || [];
  const onlineMembers = communityMembers.filter((m) => m.isOnline).slice(0, 10);

  const { emit, socket } = useSocket({
    [SOCKET_EVENTS.COMMUNITY.CHAT_MESSAGE]: (data) => {
      if (data.communityId === communityId) {
        dispatch(addChatMessage({
          communityId,
          message: {
            id: data.id || Date.now().toString(),
            userId: data.userId,
            userName: data.userName,
            userAvatar: data.userAvatar,
            message: data.message,
            timestamp: data.timestamp || new Date().toISOString(),
            type: data.type || 'text',
            attachments: data.attachments || [],
          },
        }));
      }
    },
    [SOCKET_EVENTS.COMMUNITY.TYPING]: (data) => {
      if (data.communityId === communityId && data.userId !== user?.id) {
        setTypingUsers((prev) => {
          const filtered = prev.filter((u) => u.userId !== data.userId);
          return [...filtered, { userId: data.userId, userName: data.userName }];
        });

        // Remove typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
        }, 3000);
      }
    },
    [SOCKET_EVENTS.COMMUNITY.MEMBER_JOINED]: (data) => {
      if (data.communityId === communityId) {
        // Handle member joined
      }
    },
  });

  useEffect(() => {
    if (socket && communityId) {
      socket.emit(SOCKET_EVENTS.COMMUNITY.JOIN, { communityId });
    }

    return () => {
      if (socket && communityId) {
        socket.emit(SOCKET_EVENTS.COMMUNITY.LEAVE, { communityId });
      }
    };
  }, [socket, communityId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [communityMessages]);

  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      emit(SOCKET_EVENTS.COMMUNITY.CHAT_MESSAGE, {
        communityId,
        message: message.trim(),
        userId: user?.id,
        userName: user?.name || 'Anonymous',
        userAvatar: user?.avatar,
        timestamp: new Date().toISOString(),
      });
      setMessage('');
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [message, socket, communityId, user, emit]);

  const handleTyping = useCallback(() => {
    if (!isTyping && socket) {
      setIsTyping(true);
      emit(SOCKET_EVENTS.COMMUNITY.TYPING, {
        communityId,
        userId: user?.id,
        userName: user?.name,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }, [isTyping, socket, communityId, user, emit]);

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    if (diffMins < 1440) {
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const groupMessagesByDate = (messages) => {
    const grouped = [];
    let currentDate = null;

    messages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp);
      const dateKey = msgDate.toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      let dateLabel = `${months[msgDate.getMonth()]} ${msgDate.getDate()}, ${msgDate.getFullYear()}`;
      if (dateKey === today) dateLabel = 'Today';
      if (dateKey === yesterday) dateLabel = 'Yesterday';

      if (dateKey !== currentDate) {
        grouped.push({ type: 'date', label: dateLabel, key: dateKey });
        currentDate = dateKey;
      }
      grouped.push({ type: 'message', ...msg });
    });

    return grouped;
  };

  const filteredMessages = searchQuery
    ? communityMessages.filter((msg) =>
        msg.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : communityMessages;

  const groupedMessages = groupMessagesByDate(filteredMessages);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Group Chat</h3>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-5 h-5 text-gray-600" />
          </motion.button>
          <motion.button
            onClick={() => setShowOnlineMembers(!showOnlineMembers)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-medium text-gray-600">{onlineMembers.length} online</span>
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2 border-b border-gray-200"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden flex">
        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
        >
          {groupedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            </div>
          ) : (
            groupedMessages.map((item, idx) => {
              if (item.type === 'date') {
                return (
                  <div key={item.key} className="flex items-center justify-center my-4">
                    <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                      {item.label}
                    </div>
                  </div>
                );
              }

              const isOwnMessage = item.userId === user?.id;
              const showAvatar = idx === 0 || 
                groupedMessages[idx - 1]?.type === 'date' ||
                groupedMessages[idx - 1]?.userId !== item.userId ||
                new Date(item.timestamp) - new Date(groupedMessages[idx - 1]?.timestamp || 0) > 300000; // 5 minutes

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                >
                  {showAvatar && !isOwnMessage && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {item.userAvatar ? (
                        <img src={item.userAvatar} alt={item.userName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        item.userName?.charAt(0) || 'U'
                      )}
                    </div>
                  )}
                  {showAvatar && isOwnMessage && <div className="w-8 flex-shrink-0"></div>}
                  {!showAvatar && <div className="w-8 flex-shrink-0"></div>}
                  <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    {showAvatar && (
                      <span className="text-xs font-semibold text-gray-700 mb-1 px-1">
                        {item.userName}
                      </span>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{item.message}</p>
                      <span
                        className={`text-xs mt-1 block ${
                          isOwnMessage ? 'text-white/70' : 'text-gray-500'
                        }`}
                      >
                        {formatMessageTime(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}

          {/* Typing Indicator */}
          <AnimatePresence>
            {typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {typingUsers.map((u) => u.userName).join(', ')} typing...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={chatEndRef} />
        </div>

        {/* Online Members Sidebar */}
        <AnimatePresence>
          {showOnlineMembers && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto"
            >
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Online Members</h4>
              <div className="space-y-2">
                {onlineMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-semibold">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          member.name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700 truncate">{member.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll to Bottom Button */}
      {communityMessages.length > 5 && (
        <motion.button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-4 p-2 bg-primary text-white rounded-full shadow-lg"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <div className="flex-1 flex items-end gap-2">
            <motion.button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </motion.button>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none max-h-32"
            />
            <motion.button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Smile className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
          <motion.button
            type="submit"
            disabled={!message.trim()}
            className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: message.trim() ? 1.05 : 1 }}
            whileTap={{ scale: message.trim() ? 0.95 : 1 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
});

GroupChat.displayName = 'GroupChat';

export default GroupChat;

