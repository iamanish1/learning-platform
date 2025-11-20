import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  setActiveCommunity,
  setLoading,
  setDiscussions,
  setAnnouncements,
  setMembers,
  setChatMessages,
  addMyCommunity,
  removeMyCommunity,
  updateMemberRole,
  addMember,
  removeMember,
} from '../store/slices/communitySlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import CommunityHeader from '../components/community/CommunityHeader';
import CommunityTabs from '../components/community/CommunityTabs';
import GroupChat from '../components/community/GroupChat';
import DiscussionThread from '../components/community/DiscussionThread';
import AnnouncementsList from '../components/community/AnnouncementsList';
import MembersList from '../components/community/MembersList';
import { getMemberRole, isMember } from '../utils/communityUtils';
import { mockCommunities } from '../data/mockCommunities';

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeCommunity, loading, discussions, announcements, members, chatMessages, myCommunities, memberRoles } = useSelector(
    (state) => state.community
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { get, post } = useApi();
  const [activeTab, setActiveTab] = useState('chat');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    loadCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadCommunity = async () => {
    dispatch(setLoading(true));
    
    // TODO: Replace with actual API call once backend is connected
    // For now, use mock data
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Find community in mock data
      const community = mockCommunities.find((c) => c.id === id);
      
      if (!community) {
        navigate('/community');
        return;
      }

      dispatch(setActiveCommunity(community));

      // Load discussions (mock)
      const mockDiscussions = [
        {
          id: '1',
          title: 'Getting Started with React Hooks',
          content: 'I\'m new to React Hooks. Can someone explain the basics?',
          category: 'Q&A',
          author: { id: 'user1', name: 'John Doe', avatar: null },
          likes: 12,
          commentCount: 5,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          comments: [],
        },
        {
          id: '2',
          title: 'Best Practices for State Management',
          content: 'What are your favorite state management patterns?',
          category: 'Discussion',
          author: { id: 'user2', name: 'Jane Smith', avatar: null },
          likes: 8,
          commentCount: 3,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          comments: [],
        },
      ];
      dispatch(setDiscussions({ communityId: id, discussions: mockDiscussions }));

      // Load announcements (mock)
      const mockAnnouncements = [
        {
          id: '1',
          title: 'Welcome to Our Community!',
          content: 'We\'re excited to have you here. Please read the community guidelines.',
          pinned: true,
          author: { id: community.owner.id, name: community.owner.name },
          authorRole: 'owner',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      dispatch(setAnnouncements({ communityId: id, announcements: mockAnnouncements }));

      // Load members (mock)
      const mockMembers = [
        {
          id: community.owner.id,
          name: community.owner.name,
          avatar: community.owner.avatar,
          role: 'owner',
          isOnline: true,
          joinedAt: community.createdAt,
        },
        {
          id: 'user1',
          name: 'John Doe',
          avatar: null,
          role: 'member',
          isOnline: true,
          joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'user2',
          name: 'Jane Smith',
          avatar: null,
          role: 'member',
          isOnline: false,
          joinedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      dispatch(setMembers({ communityId: id, members: mockMembers }));

      // Load chat messages (mock)
      const mockMessages = [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          message: 'Hello everyone! Excited to be here.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Jane Smith',
          message: 'Welcome! Feel free to ask any questions.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
      ];
      dispatch(setChatMessages({ communityId: id, messages: mockMessages }));

      // Set user role (mock - in real app, fetch from API)
      if (user?.id === community.owner.id) {
        dispatch(updateMemberRole({ communityId: id, userId: user.id, role: 'owner' }));
      } else if (mockMembers.find((m) => m.id === user?.id)) {
        dispatch(updateMemberRole({ communityId: id, userId: user.id, role: 'member' }));
      }

      // Uncomment below when API is ready:
      // const result = await get(API_ENDPOINTS.COMMUNITY.DETAIL(id));
      // if (result.success) {
      //   dispatch(setActiveCommunity(result.data));
      // }
      // const discussionsResult = await get(API_ENDPOINTS.COMMUNITY.DISCUSSIONS(id));
      // if (discussionsResult.success) {
      //   dispatch(setDiscussions({ communityId: id, discussions: discussionsResult.data }));
      // }
      // Similar for announcements, members, chat messages
    } catch (error) {
      console.error('Error loading community:', error);
      navigate('/community');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleJoin = useCallback(async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsJoining(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      dispatch(addMyCommunity(activeCommunity));
      dispatch(updateMemberRole({ communityId: id, userId: user.id, role: 'member' }));
      
      // Add user to members list
      dispatch(addMember({
        communityId: id,
        member: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: 'member',
          isOnline: true,
          joinedAt: new Date().toISOString(),
        },
      }));

      // Uncomment below when API is ready:
      // const result = await post(API_ENDPOINTS.COMMUNITY.JOIN(id));
      // if (result.success) {
      //   dispatch(addMyCommunity(activeCommunity));
      // }
    } catch (error) {
      console.error('Error joining community:', error);
    } finally {
      setIsJoining(false);
    }
  }, [isAuthenticated, navigate, dispatch, activeCommunity, id, user]);

  const handleLeave = useCallback(async () => {
    setIsJoining(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      dispatch(removeMyCommunity(id));
      dispatch(removeMember({ communityId: id, memberId: user.id }));

      // Uncomment below when API is ready:
      // const result = await post(API_ENDPOINTS.COMMUNITY.LEAVE(id));
      // if (result.success) {
      //   dispatch(removeMyCommunity(id));
      // }
    } catch (error) {
      console.error('Error leaving community:', error);
    } finally {
      setIsJoining(false);
    }
  }, [dispatch, id, user]);

  const userRole = useMemo(() => {
    if (!user?.id || !id) return null;
    return getMemberRole(id, user.id, memberRoles);
  }, [id, user, memberRoles]);

  const isUserMember = useMemo(() => {
    if (!user?.id) return false;
    return isMember(id, myCommunities);
  }, [id, myCommunities, user]);

  const communityDiscussions = discussions[id] || [];
  const communityAnnouncements = announcements[id] || [];
  const communityMembers = members[id] || [];

  const handleCreateDiscussion = useCallback(() => {
    // TODO: Open create discussion modal or navigate to create page
    console.log('Create discussion');
  }, []);

  const handleCreateAnnouncement = useCallback(() => {
    // TODO: Open create announcement modal
    console.log('Create announcement');
  }, []);

  const handleMessageMember = useCallback((memberId) => {
    // TODO: Open direct message modal or navigate to chat
    console.log('Message member:', memberId);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 animate-pulse">
          <div className="h-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!activeCommunity) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Community not found</p>
        <button
          onClick={() => navigate('/community')}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Back to Communities
        </button>
      </div>
    );
  }

  const tabBadges = {
    chat: 0, // Unread messages count
    discussions: 0,
    announcements: communityAnnouncements.filter((a) => !a.read).length,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Community Header */}
      <CommunityHeader
        community={activeCommunity}
        userRole={userRole}
        isMember={isUserMember}
        onJoin={handleJoin}
        onLeave={handleLeave}
        isLoading={isJoining}
      />

      {/* Tabs */}
      <CommunityTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badges={tabBadges}
      />

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'chat' && (
          <GroupChat communityId={id} />
        )}
        {activeTab === 'discussions' && (
          <DiscussionThread
            discussions={communityDiscussions}
            communityId={id}
            onCreateDiscussion={handleCreateDiscussion}
          />
        )}
        {activeTab === 'announcements' && (
          <AnnouncementsList
            announcements={communityAnnouncements}
            userRole={userRole}
            onCreateAnnouncement={handleCreateAnnouncement}
          />
        )}
        {activeTab === 'members' && (
          <MembersList
            members={communityMembers}
            userId={user?.id}
            onMessageMember={handleMessageMember}
          />
        )}
        {activeTab === 'events' && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Community events coming soon!</p>
          </div>
        )}
        {activeTab === 'resources' && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Community resources coming soon!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CommunityDetail;
