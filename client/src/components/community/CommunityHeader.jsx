import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Settings, Share2, Calendar, Crown, Shield, User } from 'lucide-react';
import { formatMemberCount, getCommunityType, getPrivacyBadge, formatLastActivity, canManageCommunity } from '../../utils/communityUtils';

/**
 * CommunityHeader - Community header component
 * @param {Object} props
 * @param {Object} props.community - Community object
 * @param {string} props.userRole - User's role in community
 * @param {boolean} props.isMember - Whether user is a member
 * @param {Function} props.onJoin - Callback when joining
 * @param {Function} props.onLeave - Callback when leaving
 * @param {boolean} props.isLoading - Loading state for join/leave
 */
const CommunityHeader = memo(({ 
  community, 
  userRole = null, 
  isMember = false, 
  onJoin, 
  onLeave, 
  isLoading = false 
}) => {
  const [isSharing, setIsSharing] = useState(false);
  
  const typeInfo = getCommunityType(community.type || community.category);
  const privacyInfo = getPrivacyBadge(community.privacy || community.privacyType || 'public');
  const memberCount = formatMemberCount(community.memberCount || 0);
  const lastActivity = formatLastActivity(community.lastActivityAt || community.createdAt);
  const canManage = canManageCommunity(userRole);
  const TypeIcon = typeInfo.Icon;
  const PrivacyIcon = privacyInfo.Icon;

  const handleShare = async () => {
    const url = `${window.location.origin}/community/${community.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: community.name,
          text: community.description,
          url: url,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      setIsSharing(true);
      setTimeout(() => setIsSharing(false), 2000);
    }
  };

  const getRoleBadge = () => {
    if (!userRole) return null;
    
    const badges = {
      owner: {
        label: 'Owner',
        icon: Crown,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      moderator: {
        label: 'Moderator',
        icon: Shield,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
      },
      member: {
        label: 'Member',
        icon: User,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
      },
    };

    const badge = badges[userRole];
    if (!badge) return null;

    const IconComponent = badge.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.color} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
        {community.banner ? (
          <img
            src={community.banner}
            alt={community.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${typeInfo.gradient} opacity-80`}></div>
        )}
        <div className="absolute inset-0 bg-black/30"></div>

          {/* Logo/Avatar */}
          <div className="absolute -bottom-16 left-6">
            <div className={`w-32 h-32 rounded-2xl ${typeInfo.iconBg} border-4 border-white shadow-xl flex items-center justify-center overflow-hidden`}>
              {community.logo || community.avatar ? (
                <img
                  src={community.logo || community.avatar}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <TypeIcon className="w-12 h-12 text-white" />
              )}
            </div>
          </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <motion.button
            onClick={handleShare}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Share community"
          >
            <Share2 className={`w-5 h-5 ${isSharing ? 'text-green-600' : 'text-gray-700'}`} />
          </motion.button>
          {canManage && (
            <Link to={`/community/${community.id}/settings`}>
              <motion.button
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Community settings"
              >
                <Settings className="w-5 h-5 text-gray-700" />
              </motion.button>
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Left: Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
              {getRoleBadge()}
            </div>
            <p className="text-gray-600 mb-4">{community.description}</p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{memberCount}</span>
                <span>members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(community.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Last active {lastActivity}</span>
              </div>
            </div>

            {/* Privacy & Category */}
            <div className="flex items-center gap-2 mt-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${privacyInfo.color} flex items-center gap-1.5`}>
                <PrivacyIcon className="w-3.5 h-3.5" />
                {privacyInfo.label}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${typeInfo.color} flex items-center gap-1.5`}>
                <TypeIcon className="w-3.5 h-3.5" />
                {typeInfo.label}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {isMember ? (
              <motion.button
                onClick={onLeave}
                disabled={isLoading || canManage}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  canManage
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
                whileHover={!canManage ? { scale: 1.05 } : {}}
                whileTap={!canManage ? { scale: 0.95 } : {}}
              >
                {isLoading ? 'Leaving...' : 'Leave Community'}
              </motion.button>
            ) : (
              <motion.button
                onClick={onJoin}
                disabled={isLoading}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? 'Joining...' : 'Join Community'}
              </motion.button>
            )}
          </div>
        </div>

        {/* Owner Info */}
        {community.owner && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Created by</span>
              <span className="font-semibold text-gray-900">{community.owner.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

CommunityHeader.displayName = 'CommunityHeader';

export default CommunityHeader;

