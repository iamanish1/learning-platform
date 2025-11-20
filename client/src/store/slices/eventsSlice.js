import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  activeEvent: null,
  teams: [],
  projects: [],
  results: [],
  loading: false,
  error: null,
  filters: {
    status: 'all', // 'all', 'upcoming', 'live', 'past'
    type: 'all', // 'all', 'hackathon', 'challenge', 'workshop', 'competition'
    category: 'all', // 'all' or specific category name
    search: '', // search query string
    pricing: 'all', // 'all', 'free', 'paid'
  },
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...action.payload };
      }
    },
    setActiveEvent: (state, action) => {
      state.activeEvent = action.payload;
    },
    clearActiveEvent: (state) => {
      state.activeEvent = null;
      state.teams = [];
      state.projects = [];
    },
    setTeams: (state, action) => {
      state.teams = action.payload;
    },
    addTeam: (state, action) => {
      state.teams.push(action.payload);
    },
    updateTeam: (state, action) => {
      const index = state.teams.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.teams[index] = { ...state.teams[index], ...action.payload };
      }
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload };
      }
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  setLoading,
  setError,
  setEvents,
  addEvent,
  updateEvent,
  setActiveEvent,
  clearActiveEvent,
  setTeams,
  addTeam,
  updateTeam,
  setProjects,
  addProject,
  updateProject,
  setResults,
  setFilters,
} = eventsSlice.actions;

export default eventsSlice.reducer;

