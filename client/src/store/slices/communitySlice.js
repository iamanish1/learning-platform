import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  communities: [],
  activeCommunity: null,
  myCommunities: [], // Communities user has joined
  discussions: {}, // Discussions per community (keyed by communityId)
  activeDiscussion: null,
  announcements: {}, // Announcements per community (keyed by communityId)
  members: {}, // Members per community (keyed by communityId)
  chatMessages: {}, // Chat messages per community (keyed by communityId)
  memberRoles: {}, // User roles in each community (keyed by 'communityId_userId')
  communitySettings: null, // Settings for active community (owner/admin)
  loading: false,
  error: null,
  filters: {
    category: 'all', // Filter by category
    type: 'all', // Filter by privacy type (public/private/invite-only)
    search: '', // Search query
    sortBy: 'popular', // Sort by popular, newest, most-active, most-members
  },
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCommunities: (state, action) => {
      state.communities = action.payload;
    },
    addCommunity: (state, action) => {
      state.communities.push(action.payload);
    },
    updateCommunity: (state, action) => {
      const index = state.communities.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.communities[index] = { ...state.communities[index], ...action.payload };
      }
    },
    setActiveCommunity: (state, action) => {
      state.activeCommunity = action.payload;
    },
    clearActiveCommunity: (state) => {
      state.activeCommunity = null;
      state.discussions = {};
      state.announcements = {};
      state.members = {};
      state.chatMessages = {};
      state.communitySettings = null;
    },
    setMyCommunities: (state, action) => {
      state.myCommunities = action.payload;
    },
    addMyCommunity: (state, action) => {
      if (!state.myCommunities.find(c => c.id === action.payload.id)) {
        state.myCommunities.push(action.payload);
      }
    },
    removeMyCommunity: (state, action) => {
      state.myCommunities = state.myCommunities.filter(c => c.id !== action.payload);
    },
    setDiscussions: (state, action) => {
      const { communityId, discussions } = action.payload;
      state.discussions[communityId] = discussions;
    },
    addDiscussion: (state, action) => {
      const { communityId, discussion } = action.payload;
      if (!state.discussions[communityId]) {
        state.discussions[communityId] = [];
      }
      state.discussions[communityId].unshift(discussion);
    },
    updateDiscussion: (state, action) => {
      const { communityId, discussion } = action.payload;
      if (state.discussions[communityId]) {
        const index = state.discussions[communityId].findIndex(d => d.id === discussion.id);
        if (index !== -1) {
          state.discussions[communityId][index] = { ...state.discussions[communityId][index], ...discussion };
        }
      }
    },
    setActiveDiscussion: (state, action) => {
      state.activeDiscussion = action.payload;
    },
    clearActiveDiscussion: (state) => {
      state.activeDiscussion = null;
    },
    setAnnouncements: (state, action) => {
      const { communityId, announcements } = action.payload;
      state.announcements[communityId] = announcements;
    },
    addAnnouncement: (state, action) => {
      const { communityId, announcement } = action.payload;
      if (!state.announcements[communityId]) {
        state.announcements[communityId] = [];
      }
      state.announcements[communityId].unshift(announcement);
    },
    setMembers: (state, action) => {
      const { communityId, members } = action.payload;
      state.members[communityId] = members;
    },
    addMember: (state, action) => {
      const { communityId, member } = action.payload;
      if (!state.members[communityId]) {
        state.members[communityId] = [];
      }
      if (!state.members[communityId].find(m => m.id === member.id)) {
        state.members[communityId].push(member);
      }
    },
    removeMember: (state, action) => {
      const { communityId, memberId } = action.payload;
      if (state.members[communityId]) {
        state.members[communityId] = state.members[communityId].filter(m => m.id !== memberId);
      }
    },
    updateMemberRole: (state, action) => {
      const { communityId, userId, role } = action.payload;
      const roleKey = `${communityId}_${userId}`;
      state.memberRoles[roleKey] = role;
    },
    setChatMessages: (state, action) => {
      const { communityId, messages } = action.payload;
      state.chatMessages[communityId] = messages;
    },
    addChatMessage: (state, action) => {
      const { communityId, message } = action.payload;
      if (!state.chatMessages[communityId]) {
        state.chatMessages[communityId] = [];
      }
      state.chatMessages[communityId].push(message);
    },
    setCommunitySettings: (state, action) => {
      state.communitySettings = action.payload;
    },
    updateCommunitySettings: (state, action) => {
      state.communitySettings = { ...state.communitySettings, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  setLoading,
  setError,
  setCommunities,
  addCommunity,
  updateCommunity,
  setActiveCommunity,
  clearActiveCommunity,
  setMyCommunities,
  addMyCommunity,
  removeMyCommunity,
  setDiscussions,
  addDiscussion,
  updateDiscussion,
  setActiveDiscussion,
  clearActiveDiscussion,
  setAnnouncements,
  addAnnouncement,
  setMembers,
  addMember,
  removeMember,
  updateMemberRole,
  setChatMessages,
  addChatMessage,
  setCommunitySettings,
  updateCommunitySettings,
  setFilters,
} = communitySlice.actions;

export default communitySlice.reducer;

