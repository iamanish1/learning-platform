import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  communities: [],
  activeCommunity: null,
  discussions: [],
  activeDiscussion: null,
  announcements: [],
  members: [],
  chatMessages: [],
  loading: false,
  error: null,
  filters: {
    type: 'all', // 'all', 'ai-ml', 'web-dev', 'cybersecurity', 'college-clubs'
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
      state.discussions = [];
      state.announcements = [];
      state.members = [];
      state.chatMessages = [];
    },
    setDiscussions: (state, action) => {
      state.discussions = action.payload;
    },
    addDiscussion: (state, action) => {
      state.discussions.unshift(action.payload);
    },
    updateDiscussion: (state, action) => {
      const index = state.discussions.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.discussions[index] = { ...state.discussions[index], ...action.payload };
      }
    },
    setActiveDiscussion: (state, action) => {
      state.activeDiscussion = action.payload;
    },
    clearActiveDiscussion: (state) => {
      state.activeDiscussion = null;
    },
    setAnnouncements: (state, action) => {
      state.announcements = action.payload;
    },
    addAnnouncement: (state, action) => {
      state.announcements.unshift(action.payload);
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    addMember: (state, action) => {
      if (!state.members.find(m => m.id === action.payload.id)) {
        state.members.push(action.payload);
      }
    },
    removeMember: (state, action) => {
      state.members = state.members.filter(m => m.id !== action.payload);
    },
    setChatMessages: (state, action) => {
      state.chatMessages = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
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
  setChatMessages,
  addChatMessage,
  setFilters,
} = communitySlice.actions;

export default communitySlice.reducer;

