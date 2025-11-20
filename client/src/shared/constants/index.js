// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  // Live Sessions
  SESSIONS: {
    LIST: '/sessions',
    DETAIL: (id) => `/sessions/${id}`,
    JOIN: (id) => `/sessions/${id}/join`,
    RECORDING: (id) => `/sessions/${id}/recording`,
    ATTENDANCE: (id) => `/sessions/${id}/attendance`,
  },
  // Events
  EVENTS: {
    LIST: '/events',
    DETAIL: (id) => `/events/${id}`,
    REGISTER: (id) => `/events/${id}/register`,
    TEAMS: (id) => `/events/${id}/teams`,
    PROJECTS: (id) => `/events/${id}/projects`,
    RESULTS: (id) => `/events/${id}/results`,
  },
  // Blog
  BLOG: {
    LIST: '/blog',
    DETAIL: (id) => `/blog/${id}`,
    CREATE: '/blog',
    UPDATE: (id) => `/blog/${id}`,
    DELETE: (id) => `/blog/${id}`,
    COMMENTS: (id) => `/blog/${id}/comments`,
  },
  // Community
  COMMUNITY: {
    LIST: '/communities',
    DETAIL: (id) => `/communities/${id}`,
    DISCUSSIONS: (id) => `/communities/${id}/discussions`,
    ANNOUNCEMENTS: (id) => `/communities/${id}/announcements`,
    MEMBERS: (id) => `/communities/${id}/members`,
  },
};

// Socket events
export const SOCKET_EVENTS = {
  // Live Sessions
  SESSION: {
    JOIN: 'session:join',
    LEAVE: 'session:leave',
    CHAT_MESSAGE: 'session:chat:message',
    SCREEN_SHARE: 'session:screen:share',
    ATTENDANCE: 'session:attendance',
  },
  // Events
  EVENT: {
    UPDATE: 'event:update',
    TEAM_COLLABORATION: 'event:team:collaboration',
  },
  // Community
  COMMUNITY: {
    CHAT_MESSAGE: 'community:chat:message',
    DISCUSSION_UPDATE: 'community:discussion:update',
    COLLABORATION: 'community:collaboration',
  },
};

// Community types
export const COMMUNITY_TYPES = {
  AI_ML: 'ai-ml',
  WEB_DEV: 'web-dev',
  CYBERSECURITY: 'cybersecurity',
  COLLEGE_CLUBS: 'college-clubs',
};

// Session types
export const SESSION_TYPES = {
  FREE: 'free',
  PAID: 'paid',
};

// Event status
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  PAST: 'past',
};

