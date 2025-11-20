import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, MessageCircle, Grid, List, Crown, Shield, User, Circle } from 'lucide-react';
import { formatLastActivity } from '../../utils/communityUtils';

/**
 * MembersList - Member directory component
 * @param {Object} props
 * @param {Array} props.members - Array of member objects
 * @param {string} props.userId - Current user ID
 * @param {Function} props.onMessageMember - Callback to message a member
 */
const MembersList = memo(({ members = [], userId = null, onMessageMember }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'owner', 'moderator', 'member'

  const filteredMembers = members.filter((member) => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const name = (member.name || '').toLowerCase();
      const email = (member.email || '').toLowerCase();
      if (!name.includes(query) && !email.includes(query)) {
        return false;
      }
    }

    // Role filter
    if (roleFilter !== 'all' && member.role !== roleFilter) {
      return false;
    }

    return true;
  });

  const getRoleBadge = (role) => {
    const badges = {
      owner: {
        icon: Crown,
        label: 'Owner',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      moderator: {
        icon: Shield,
        label: 'Moderator',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
      },
      member: {
        icon: User,
        label: 'Member',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
      },
    };

    return badges[role] || badges.member;
  };

  const roles = ['all', 'owner', 'moderator', 'member'];
  const roleCounts = {
    all: members.length,
    owner: members.filter((m) => m.role === 'owner').length,
    moderator: members.filter((m) => m.role === 'moderator').length,
    member: members.filter((m) => m.role === 'member').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Members
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Grid className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <List className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Role:</span>
          <div className="flex gap-2">
            {roles.map((role) => (
              <motion.button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  roleFilter === role
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {role === 'all' ? 'All' : role} ({roleCounts[role]})
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Members Grid/List */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No members found</h4>
          <p className="text-gray-600">
            {searchQuery || roleFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'No members in this community yet.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMembers.map((member, index) => {
            const badge = getRoleBadge(member.role);
            const BadgeIcon = badge.icon;
            const isSelf = member.id === userId;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl font-semibold">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        member.name?.charAt(0) || 'U'
                      )}
                    </div>
                    {member.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-1">{member.name}</h4>
                  
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${badge.color} flex items-center gap-1 mb-2`}>
                    <BadgeIcon className="w-3 h-3" />
                    {badge.label}
                  </span>

                  <p className="text-xs text-gray-500 mb-3">
                    Joined {formatLastActivity(member.joinedAt || member.createdAt)}
                  </p>

                  {!isSelf && (
                    <motion.button
                      onClick={() => onMessageMember && onMessageMember(member.id)}
                      className="w-full px-3 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMembers.map((member, index) => {
            const badge = getRoleBadge(member.role);
            const BadgeIcon = badge.icon;
            const isSelf = member.id === userId;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        member.name?.charAt(0) || 'U'
                      )}
                    </div>
                    {member.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{member.name}</h4>
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${badge.color} flex items-center gap-1`}>
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Joined {formatLastActivity(member.joinedAt || member.createdAt)}
                    </p>
                  </div>

                  {!isSelf && (
                    <motion.button
                      onClick={() => onMessageMember && onMessageMember(member.id)}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
});

MembersList.displayName = 'MembersList';

export default MembersList;

