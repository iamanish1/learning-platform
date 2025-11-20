import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessions: [],
  activeSession: null,
  recordings: [],
  chatMessages: [],
  participants: [],
  attendance: [],
  loading: false,
  error: null,
  filters: {
    type: 'all', // 'all', 'free', 'paid'
    status: 'all', // 'all', 'upcoming', 'live', 'past'
    category: 'all', // 'all' or specific category name
    search: '', // search query string
  },
};

const liveSessionsSlice = createSlice({
  name: 'liveSessions',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    addSession: (state, action) => {
      state.sessions.push(action.payload);
    },
    updateSession: (state, action) => {
      const index = state.sessions.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.sessions[index] = { ...state.sessions[index], ...action.payload };
      }
    },
    setActiveSession: (state, action) => {
      state.activeSession = action.payload;
    },
    clearActiveSession: (state) => {
      state.activeSession = null;
      state.chatMessages = [];
      state.participants = [];
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    setChatMessages: (state, action) => {
      state.chatMessages = action.payload;
    },
    addParticipant: (state, action) => {
      if (!state.participants.find(p => p.id === action.payload.id)) {
        state.participants.push(action.payload);
      }
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter(p => p.id !== action.payload);
    },
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
    setRecordings: (state, action) => {
      state.recordings = action.payload;
    },
    addRecording: (state, action) => {
      state.recordings.push(action.payload);
    },
    setAttendance: (state, action) => {
      state.attendance = action.payload;
    },
    updateAttendance: (state, action) => {
      const index = state.attendance.findIndex(a => a.userId === action.payload.userId);
      if (index !== -1) {
        state.attendance[index] = { ...state.attendance[index], ...action.payload };
      } else {
        state.attendance.push(action.payload);
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  setLoading,
  setError,
  setSessions,
  addSession,
  updateSession,
  setActiveSession,
  clearActiveSession,
  addChatMessage,
  setChatMessages,
  addParticipant,
  removeParticipant,
  setParticipants,
  setRecordings,
  addRecording,
  setAttendance,
  updateAttendance,
  setFilters,
} = liveSessionsSlice.actions;

export default liveSessionsSlice.reducer;

