import { memo } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Pin, Plus, Crown, Shield, Clock } from 'lucide-react';
import { formatLastActivity, canManageCommunity } from '../../utils/communityUtils';

/**
 * AnnouncementsList - Announcements section component
 * @param {Object} props
 * @param {Array} props.announcements - Array of announcement objects
 * @param {string} props.userRole - User's role in community
 * @param {Function} props.onCreateAnnouncement - Callback to create new announcement
 */
const AnnouncementsList = memo(({ announcements = [], userRole = null, onCreateAnnouncement }) => {
  const canManage = canManageCommunity(userRole);
  
  // Separate pinned and regular announcements
  const pinnedAnnouncements = announcements.filter((a) => a.pinned).sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
  const regularAnnouncements = announcements.filter((a) => !a.pinned).sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  const getAuthorBadge = (authorRole) => {
    if (authorRole === 'owner') {
      return {
        icon: Crown,
        label: 'Owner',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      };
    }
    if (authorRole === 'moderator') {
      return {
        icon: Shield,
        label: 'Moderator',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
      };
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-primary" />
            Announcements
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {announcements.length} {announcements.length === 1 ? 'announcement' : 'announcements'}
          </p>
        </div>
        {canManage && (
          <motion.button
            onClick={onCreateAnnouncement}
            className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>New Announcement</span>
          </motion.button>
        )}
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No announcements yet</h4>
          <p className="text-gray-600">
            {canManage
              ? 'Create the first announcement to share important updates with the community.'
              : 'Check back later for community updates.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pinned Announcements */}
          {pinnedAnnouncements.length > 0 && (
            <div className="space-y-4">
              {pinnedAnnouncements.map((announcement, index) => {
                const badge = getAuthorBadge(announcement.authorRole);
                const BadgeIcon = badge?.icon;

                return (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Pin className="w-5 h-5 text-yellow-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{announcement.title}</h4>
                          {badge && (
                            <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${badge.color} flex items-center gap-1`}>
                              <BadgeIcon className="w-3 h-3" />
                              {badge.label}
                            </span>
                          )}
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                        </div>
                        {announcement.image && (
                          <div className="mt-4 rounded-lg overflow-hidden">
                            <img
                              src={announcement.image}
                              alt={announcement.title}
                              className="w-full h-auto max-h-64 object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatLastActivity(announcement.createdAt)}</span>
                          </div>
                          <span>by {announcement.author?.name || 'Community Admin'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Regular Announcements */}
          {regularAnnouncements.length > 0 && (
            <div className="space-y-4">
              {regularAnnouncements.map((announcement, index) => {
                const badge = getAuthorBadge(announcement.authorRole);
                const BadgeIcon = badge?.icon;

                return (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (pinnedAnnouncements.length + index) * 0.05 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{announcement.title}</h4>
                          {badge && (
                            <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${badge.color} flex items-center gap-1`}>
                              <BadgeIcon className="w-3 h-3" />
                              {badge.label}
                            </span>
                          )}
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                        </div>
                        {announcement.image && (
                          <div className="mt-4 rounded-lg overflow-hidden">
                            <img
                              src={announcement.image}
                              alt={announcement.title}
                              className="w-full h-auto max-h-64 object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatLastActivity(announcement.createdAt)}</span>
                          </div>
                          <span>by {announcement.author?.name || 'Community Admin'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

AnnouncementsList.displayName = 'AnnouncementsList';

export default AnnouncementsList;

