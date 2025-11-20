import { memo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, MessageSquare, Megaphone, Users, Calendar, FolderOpen } from 'lucide-react';

/**
 * CommunityTabs - Tab navigation component
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.onTabChange - Callback when tab changes
 * @param {Object} props.badges - Badge counts for tabs { chat, discussions, announcements }
 */
const CommunityTabs = memo(({ activeTab = 'chat', onTabChange, badges = {} }) => {
  const tabs = [
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageCircle,
      default: true,
    },
    {
      id: 'discussions',
      label: 'Discussions',
      icon: MessageSquare,
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone,
    },
    {
      id: 'members',
      label: 'Members',
      icon: Users,
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: FolderOpen,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-1 p-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          const badgeCount = badges[tab.id] || 0;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
              {badgeCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white text-primary' : 'bg-primary text-white'
                  }`}
                >
                  {badgeCount > 99 ? '99+' : badgeCount}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

CommunityTabs.displayName = 'CommunityTabs';

export default CommunityTabs;

