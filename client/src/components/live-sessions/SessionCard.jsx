import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  Users,
  User,
  Play,
  Calendar,
  BookOpen,
  Video,
  Share2,
  ArrowRight,
} from 'lucide-react';
import {
  getSessionStatus,
  formatSessionDate,
  getCountdown,
  formatCountdown,
  formatDuration,
} from '../../utils/sessionUtils';

/**
 * SessionCard component with modern design, status badges, and quick actions
 * @param {Object} props
 * @param {Object} props.session - Session object
 * @param {number} props.index - Index for animation delay
 */
const SessionCard = memo(({ session, index = 0 }) => {
  const [countdown, setCountdown] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(
    session.status || getSessionStatus(session.startDate || session.date, session.endDate)
  );

  // Update countdown for upcoming sessions
  useEffect(() => {
    if (currentStatus === 'upcoming' && (session.startDate || session.date)) {
      const updateCountdown = () => {
        const cd = getCountdown(session.startDate || session.date);
        setCountdown(cd);
        
        // Update status if session has started
        if (cd.isExpired) {
          setCurrentStatus('live');
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStatus, session.startDate, session.date]);

  // Update status periodically
  useEffect(() => {
    if (session.startDate || session.date) {
      const status = getSessionStatus(session.startDate || session.date, session.endDate);
      setCurrentStatus(status);
    }
  }, [session.startDate, session.date, session.endDate]);

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/live-sessions/${session.id}`;
    navigator.clipboard.writeText(url).then(() => {
      // TODO: Show toast notification
    });
  };

  const categories = Array.isArray(session.categories || session.category)
    ? (session.categories || session.category)
    : session.categories || session.category
    ? [session.categories || session.category]
    : [];

  const categoryNames = categories
    .map((cat) => (typeof cat === 'object' ? cat.name : cat))
    .filter(Boolean)
    .slice(0, 2);

  const getStatusBadgeStyles = () => {
    switch (currentStatus) {
      case 'live':
        return 'bg-red-500 text-white animate-pulse';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'past':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getTypeBadgeStyles = () => {
    switch (session.type) {
      case 'free':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paid':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionButton = () => {
    switch (currentStatus) {
      case 'live':
        return (
          <motion.button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/live-sessions/${session.id}/classroom`;
            }}
          >
            <Play className="w-4 h-4" />
            <span>Join Now</span>
          </motion.button>
        );
      case 'upcoming':
        return (
          <motion.button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/live-sessions/${session.id}`;
            }}
          >
            <Calendar className="w-4 h-4" />
            <span>Register</span>
          </motion.button>
        );
      case 'past':
        return (
          <motion.button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/live-sessions/${session.id}`;
            }}
          >
            <Video className="w-4 h-4" />
            <span>Watch Recording</span>
          </motion.button>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <Link to={`/live-sessions/${session.id}`} className="block">
        {/* Thumbnail/Header */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-purple-200/20 overflow-hidden">
          {/* Category Icon */}
          <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-md ${getStatusBadgeStyles()}`}
            >
              {currentStatus === 'live' && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Live
                </span>
              )}
              {currentStatus === 'upcoming' && 'Upcoming'}
              {currentStatus === 'past' && 'Past'}
            </span>
          </div>

          {/* Type Badge */}
          <div className="absolute bottom-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeStyles()}`}
            >
              {session.type === 'free' ? 'Free' : 'Paid'}
            </span>
          </div>

          {/* Share Button */}
          <motion.button
            className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Share session"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
            {session.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {session.description}
          </p>

          {/* Meta Information */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {/* Instructor */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4 text-gray-400" />
              <span className="truncate">{session.instructor || 'TBA'}</span>
            </div>

            {/* Date/Time */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>
                {currentStatus === 'upcoming' && countdown
                  ? `Starts ${formatCountdown(countdown)}`
                  : formatSessionDate(session.startDate || session.date, true)}
              </span>
            </div>

            {/* Duration */}
            {session.duration && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Video className="w-4 h-4 text-gray-400" />
                <span>{formatDuration(session.duration)}</span>
              </div>
            )}

            {/* Participants */}
            {(session.participants?.length || session.participantCount) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                <span>
                  {session.participants?.length || session.participantCount || 0} participants
                </span>
              </div>
            )}
          </div>

          {/* Category Tags */}
          {categoryNames.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {categoryNames.map((category, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">{getActionButton()}</div>
        </div>
      </Link>
    </motion.div>
  );
});

SessionCard.displayName = 'SessionCard';

export default SessionCard;

