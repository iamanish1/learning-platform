import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, TrendingUp, MessageSquare, Activity } from 'lucide-react';
import {
  formatMemberCount,
  getCommunityType,
  getPrivacyBadge,
  formatLastActivity,
  isMember,
} from '../../utils/communityUtils';

/**
 * CommunityCard - Modern community card component
 * @param {Object} props
 * @param {Object} props.community - Community object
 * @param {number} props.index - Index for animation delay
 * @param {Array} props.myCommunities - User's joined communities
 */
const CommunityCard = memo(({ community, index = 0, myCommunities = [] }) => {
  const typeInfo = getCommunityType(community.type || community.category);
  const privacyInfo = getPrivacyBadge(community.privacy || community.privacyType || 'public');
  const memberCount = formatMemberCount(community.memberCount || 0);
  const isJoined = isMember(community.id, myCommunities);
  const lastActivity = formatLastActivity(community.lastActivityAt || community.createdAt);
  const TypeIcon = typeInfo.Icon;
  const PrivacyIcon = privacyInfo.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary hover:shadow-xl transition-all duration-300 group"
    >
      <Link to={`/community/${community.id}`} className="block">
        {/* Banner */}
        <div className="relative h-32 bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
          {community.banner ? (
            <img
              src={community.banner}
              alt={community.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${typeInfo.gradient} opacity-80`}></div>
          )}
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${typeInfo.color} backdrop-blur-sm flex items-center gap-1.5 shadow-sm`}>
              <TypeIcon className="w-3.5 h-3.5" />
              {typeInfo.label}
            </span>
          </div>

          {/* Privacy Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium border ${privacyInfo.color} backdrop-blur-sm flex items-center gap-1.5 shadow-sm`}>
              <PrivacyIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{privacyInfo.label}</span>
            </span>
          </div>

          {/* Logo/Avatar */}
          <div className="absolute -bottom-12 left-4">
            <div className={`w-24 h-24 rounded-2xl ${typeInfo.iconBg} border-4 border-white shadow-xl flex items-center justify-center overflow-hidden`}>
              {community.logo || community.avatar ? (
                <img
                  src={community.logo || community.avatar}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <TypeIcon className="w-10 h-10 text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 px-5 pb-5">
          {/* Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {community.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem] leading-relaxed">
            {community.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-gray-100 rounded">
                <Users className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <span className="font-semibold text-gray-900">{memberCount}</span>
              <span className="text-gray-500">members</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-gray-100 rounded">
                <Activity className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <span className="text-gray-500">{lastActivity}</span>
            </div>
          </div>

          {/* Quick Stats */}
          {(community.postsToday > 0 || community.newMembersThisWeek > 0) && (
            <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-lg">
              {community.postsToday > 0 && (
                <div className="flex items-center gap-1.5 text-primary">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{community.postsToday} posts today</span>
                </div>
              )}
              {community.newMembersThisWeek > 0 && (
                <div className="flex items-center gap-1.5 text-green-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">+{community.newMembersThisWeek} this week</span>
                </div>
              )}
            </div>
          )}

          {/* Join Button / Joined Badge */}
          <div className="pt-3 border-t border-gray-100">
            {isJoined ? (
              <div className="w-full px-4 py-2.5 bg-primary/10 text-primary rounded-lg font-semibold text-center text-sm flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Joined</span>
              </div>
            ) : (
              <motion.button
                className="w-full px-4 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                Join Community
              </motion.button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

CommunityCard.displayName = 'CommunityCard';

export default CommunityCard;

