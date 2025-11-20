import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  activePost: null,
  comments: [],
  drafts: [],
  projects: [],
  documentation: [],
  trendingTags: [],
  featuredPosts: [],
  authors: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    tag: 'all',
    search: '',
    type: 'all', // 'all', 'article', 'project', 'documentation', 'opinion'
    sortBy: 'latest', // 'latest', 'trending', 'popular', 'most_commented'
    author: 'all',
  },
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...action.payload };
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(p => p.id !== action.payload);
    },
    setActivePost: (state, action) => {
      state.activePost = action.payload;
    },
    clearActivePost: (state) => {
      state.activePost = null;
      state.comments = [];
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    addComment: (state, action) => {
      state.comments.push(action.payload);
    },
    updateComment: (state, action) => {
      const index = state.comments.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.comments[index] = { ...state.comments[index], ...action.payload };
      }
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(c => c.id !== action.payload);
    },
    setDrafts: (state, action) => {
      state.drafts = action.payload;
    },
    addDraft: (state, action) => {
      state.drafts.push(action.payload);
    },
    updateDraft: (state, action) => {
      const index = state.drafts.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.drafts[index] = { ...state.drafts[index], ...action.payload };
      }
    },
    deleteDraft: (state, action) => {
      state.drafts = state.drafts.filter(d => d.id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setDocumentation: (state, action) => {
      state.documentation = action.payload;
    },
    setTrendingTags: (state, action) => {
      state.trendingTags = action.payload;
    },
    setFeaturedPosts: (state, action) => {
      state.featuredPosts = action.payload;
    },
    setAuthors: (state, action) => {
      state.authors = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setPosts,
  addPost,
  updatePost,
  deletePost,
  setActivePost,
  clearActivePost,
  setComments,
  addComment,
  updateComment,
  deleteComment,
  setDrafts,
  addDraft,
  updateDraft,
  deleteDraft,
  setFilters,
  setProjects,
  setDocumentation,
  setTrendingTags,
  setFeaturedPosts,
  setAuthors,
} = blogSlice.actions;

export default blogSlice.reducer;

