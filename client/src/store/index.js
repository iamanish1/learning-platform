import { configureStore } from '@reduxjs/toolkit';
import liveSessionsReducer from './slices/liveSessionsSlice';
import eventsReducer from './slices/eventsSlice';
import blogReducer from './slices/blogSlice';
import communityReducer from './slices/communitySlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    liveSessions: liveSessionsReducer,
    events: eventsReducer,
    blog: blogReducer,
    community: communityReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/connect'],
      },
    }),
});

