import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  Users,
  Calendar,
  Trophy,
  Share2,
  Code,
  Target,
  GraduationCap,
  Award,
  MapPin,
  DollarSign,
} from 'lucide-react';
import {
  getEventStatus,
  formatEventDate,
  getCountdown,
  formatCountdown,
  formatDuration,
  formatPrize,
  getEventTypeColors,
} from '../../utils/eventUtils';

/**
 * EventCard component with modern design, status badges, and quick actions
 * @param {Object} props
 * @param {Object} props.event - Event object
 * @param {number} props.index - Index for animation delay
 */
const EventCard = memo(({ event, index = 0 }) => {
  const [countdown, setCountdown] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(
    event.status || getEventStatus(event.startDate || event.date, event.endDate)
  );

  // Update countdown for upcoming events
  useEffect(() => {
    if (currentStatus === 'upcoming' && (event.startDate || event.date)) {
      const updateCountdown = () => {
        const cd = getCountdown(event.startDate || event.date);
        setCountdown(cd);
        
        // Update status if event has started
        if (cd.isExpired) {
          setCurrentStatus('live');
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStatus, event.startDate, event.date]);

  // Update status periodically
  useEffect(() => {
    if (event.startDate || event.date) {
      const status = getEventStatus(event.startDate || event.date, event.endDate);
      setCurrentStatus(status);
    }
  }, [event.startDate, event.date, event.endDate]);

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(url).then(() => {
      // TODO: Show toast notification
    });
  };

  const categories = Array.isArray(event.categories || event.category)
    ? (event.categories || event.category)
    : event.categories || event.category
    ? [event.categories || event.category]
    : [];

  const categoryNames = categories
    .map((cat) => (typeof cat === 'object' ? cat.name : cat))
    .filter(Boolean)
    .slice(0, 2);

  const typeColors = getEventTypeColors(event.type);
  const isFree = event.price === 0 || event.price === null || event.type === 'free' || !event.price;

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

  const getTypeIcon = () => {
    switch (event.type) {
      case 'hackathon':
        return <Code className="w-6 h-6" />;
      case 'challenge':
        return <Target className="w-6 h-6" />;
      case 'workshop':
        return <GraduationCap className="w-6 h-6" />;
      case 'competition':
        return <Award className="w-6 h-6" />;
      default:
        return <Calendar className="w-6 h-6" />;
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
              window.location.href = `/events/${event.id}`;
            }}
          >
            <Trophy className="w-4 h-4" />
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
              window.location.href = `/events/${event.id}`;
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
              window.location.href = `/events/${event.id}`;
            }}
          >
            <Trophy className="w-4 h-4" />
            <span>View Results</span>
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
      <Link to={`/events/${event.id}`} className="block">
        {/* Thumbnail/Header */}
        <div className={`relative h-48 bg-gradient-to-br ${typeColors.bg} overflow-hidden`}>
          {/* Type Icon */}
          <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md">
            <div className={typeColors.accent}>
              {getTypeIcon()}
            </div>
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
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeColors.badge}`}
            >
              {event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'Event'}
            </span>
          </div>

          {/* Pricing Badge */}
          <div className="absolute bottom-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                isFree
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-purple-100 text-purple-800 border-purple-200'
              }`}
            >
              {isFree ? 'Free' : event.price ? `$${event.price}` : 'Paid'}
            </span>
          </div>

          {/* Share Button */}
          <motion.button
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Share event"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {event.description}
          </p>

          {/* Meta Information */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {/* Organizer */}
            {(event.organizer || event.instructor) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="truncate">{event.organizer || event.instructor}</span>
              </div>
            )}

            {/* Date/Time */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>
                {currentStatus === 'upcoming' && countdown
                  ? `Starts ${formatCountdown(countdown)}`
                  : formatEventDate(event.startDate || event.date, true)}
              </span>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate">{event.location}</span>
              </div>
            )}

            {/* Duration */}
            {event.duration && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{formatDuration(event.duration)}</span>
              </div>
            )}

            {/* Participants */}
            {(event.participants?.length || event.participantCount) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                <span>
                  {event.participants?.length || event.participantCount || 0} participants
                </span>
              </div>
            )}

            {/* Prize/Reward */}
            {event.prize && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold text-yellow-600">
                  {formatPrize(event.prize)}
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

EventCard.displayName = 'EventCard';

export default EventCard;

