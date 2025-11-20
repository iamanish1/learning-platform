/**
 * Utility functions for community-related operations
 */

import {
  Bot,
  Code,
  Shield,
  GraduationCap,
  Zap,
  Star,
  Users,
  Brain,
  Database,
  Smartphone,
  Globe,
  Gamepad2,
  Mail,
} from 'lucide-react';

/**
 * Format member count with K/M suffixes
 * @param {number} count - Member count
 * @returns {string} - Formatted count (e.g., "1.2K", "5M")
 */
export const formatMemberCount = (count) => {
  if (!count || count === 0) return '0';
  if (count < 1000) return count.toString();
  if (count < 1000000) {
    const k = (count / 1000).toFixed(1);
    return k.endsWith('.0') ? `${k.slice(0, -2)}K` : `${k}K`;
  }
  const m = (count / 1000000).toFixed(1);
  return m.endsWith('.0') ? `${m.slice(0, -2)}M` : `${m}M`;
};

/**
 * Get community type information (label, icon component, color)
 * @param {string} type - Community type
 * @returns {Object} - Type information with icon component
 */
export const getCommunityType = (type) => {
  const types = {
    'ai-ml': {
      label: 'AI/ML',
      Icon: Bot,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-500',
      gradient: 'from-purple-500 to-pink-500',
    },
    'web-dev': {
      label: 'Web Development',
      Icon: Code,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-500',
      gradient: 'from-blue-500 to-cyan-500',
    },
    'cybersecurity': {
      label: 'Cybersecurity',
      Icon: Shield,
      color: 'bg-red-100 text-red-700 border-red-200',
      iconBg: 'bg-red-500',
      gradient: 'from-red-500 to-orange-500',
    },
    'college-clubs': {
      label: 'College Club',
      Icon: GraduationCap,
      color: 'bg-green-100 text-green-700 border-green-200',
      iconBg: 'bg-green-500',
      gradient: 'from-green-500 to-emerald-500',
    },
    'tech': {
      label: 'Tech',
      Icon: Zap,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      iconBg: 'bg-yellow-500',
      gradient: 'from-yellow-500 to-orange-500',
    },
    'interest-groups': {
      label: 'Interest Group',
      Icon: Star,
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      iconBg: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-purple-500',
    },
    'data-science': {
      label: 'Data Science',
      Icon: Brain,
      color: 'bg-teal-100 text-teal-700 border-teal-200',
      iconBg: 'bg-teal-500',
      gradient: 'from-teal-500 to-cyan-500',
    },
    'mobile-dev': {
      label: 'Mobile Development',
      Icon: Smartphone,
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      iconBg: 'bg-pink-500',
      gradient: 'from-pink-500 to-rose-500',
    },
  };

  return types[type] || {
    label: 'Community',
    Icon: Users,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    iconBg: 'bg-gray-500',
    gradient: 'from-gray-500 to-gray-600',
  };
};

/**
 * Get member role in community
 * @param {string} communityId - Community ID
 * @param {string} userId - User ID
 * @param {Object} memberRoles - Member roles object
 * @returns {string} - Role (owner, moderator, member, or null)
 */
export const getMemberRole = (communityId, userId, memberRoles = {}) => {
  const roleKey = `${communityId}_${userId}`;
  return memberRoles[roleKey] || null;
};

/**
 * Check if user can manage community
 * @param {string} role - User role
 * @returns {boolean} - True if can manage
 */
export const canManageCommunity = (role) => {
  return role === 'owner' || role === 'moderator';
};

/**
 * Filter communities based on filters
 * @param {Array} communities - Array of communities
 * @param {Object} filters - Filter object
 * @returns {Array} - Filtered communities
 */
export const filterCommunities = (communities, filters) => {
  let filtered = [...communities];

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((community) => {
      const category = community.category || community.type || '';
      return category.toLowerCase() === filters.category.toLowerCase();
    });
  }

  // Filter by privacy type
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter((community) => {
      const privacy = community.privacy || community.privacyType || 'public';
      return privacy.toLowerCase() === filters.type.toLowerCase();
    });
  }

  // Filter by search query
  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase().trim();
    filtered = filtered.filter((community) => {
      const name = (community.name || '').toLowerCase();
      const description = (community.description || '').toLowerCase();
      const category = (community.category || community.type || '').toLowerCase();
      return (
        name.includes(searchLower) ||
        description.includes(searchLower) ||
        category.includes(searchLower)
      );
    });
  }

  return filtered;
};

/**
 * Sort communities
 * @param {Array} communities - Array of communities
 * @param {string} sortBy - Sort criteria
 * @returns {Array} - Sorted communities
 */
export const sortCommunities = (communities, sortBy = 'popular') => {
  const sorted = [...communities];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        // Sort by member count
        return (b.memberCount || 0) - (a.memberCount || 0);
      case 'newest':
        // Sort by created date
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'most-active':
        // Sort by activity (last activity time, message count, etc.)
        const aActivity = a.lastActivityAt || a.createdAt || 0;
        const bActivity = b.lastActivityAt || b.createdAt || 0;
        return new Date(bActivity) - new Date(aActivity);
      case 'most-members':
        return (b.memberCount || 0) - (a.memberCount || 0);
      default:
        return 0;
    }
  });

  return sorted;
};

/**
 * Calculate community statistics
 * @param {Object} community - Community object
 * @returns {Object} - Statistics
 */
export const getCommunityStats = (community) => {
  return {
    members: community.memberCount || 0,
    posts: community.postCount || community.discussionCount || 0,
    messages: community.messageCount || 0,
    announcements: community.announcementCount || 0,
    activity: community.lastActivityAt || community.createdAt,
  };
};

/**
 * Format last activity time
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted time
 */
export const formatLastActivity = (date) => {
  if (!date) return 'Never';
  
  const activityDate = new Date(date);
  const now = new Date();
  const diffMs = now - activityDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Active now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return activityDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Get privacy badge information
 * @param {string} privacy - Privacy type
 * @returns {Object} - Badge info with icon component
 */
export const getPrivacyBadge = (privacy) => {
  const badges = {
    public: {
      label: 'Public',
      color: 'bg-green-100 text-green-700 border-green-200',
      Icon: Globe,
    },
    private: {
      label: 'Private',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      Icon: Shield,
    },
    'invite-only': {
      label: 'Invite Only',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      Icon: Mail,
    },
  };

  return badges[privacy] || badges.public;
};

/**
 * Check if user is member of community
 * @param {string} communityId - Community ID
 * @param {Array} myCommunities - User's communities
 * @returns {boolean} - True if member
 */
export const isMember = (communityId, myCommunities = []) => {
  return myCommunities.some((c) => c.id === communityId || c === communityId);
};

/**
 * Get unique categories from communities
 * @param {Array} communities - Array of communities
 * @returns {Array} - Unique categories
 */
export const getUniqueCategories = (communities) => {
  const categoriesSet = new Set();
  communities.forEach((community) => {
    const category = community.category || community.type;
    if (category) {
      categoriesSet.add(category);
    }
  });
  return Array.from(categoriesSet).sort();
};

