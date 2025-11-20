const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { errorHandler, notFound } = require('../../shared/middleware');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Service URLs from environment variables
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  sessions: process.env.SESSIONS_SERVICE_URL || 'http://localhost:3002',
  events: process.env.EVENTS_SERVICE_URL || 'http://localhost:3003',
  blog: process.env.BLOG_SERVICE_URL || 'http://localhost:3004',
  community: process.env.COMMUNITY_SERVICE_URL || 'http://localhost:3005',
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
  });
});

// Proxy routes for each service
app.use('/api/auth', createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/auth',
  },
  onError: (err, req, res) => {
    res.status(503).json({
      success: false,
      error: {
        message: 'Auth service is unavailable',
      },
    });
  },
}));

app.use('/api/sessions', createProxyMiddleware({
  target: services.sessions,
  changeOrigin: true,
  pathRewrite: {
    '^/api/sessions': '/api/sessions',
  },
  onError: (err, req, res) => {
    res.status(503).json({
      success: false,
      error: {
        message: 'Sessions service is unavailable',
      },
    });
  },
}));

app.use('/api/events', createProxyMiddleware({
  target: services.events,
  changeOrigin: true,
  pathRewrite: {
    '^/api/events': '/api/events',
  },
  onError: (err, req, res) => {
    res.status(503).json({
      success: false,
      error: {
        message: 'Events service is unavailable',
      },
    });
  },
}));

app.use('/api/blog', createProxyMiddleware({
  target: services.blog,
  changeOrigin: true,
  pathRewrite: {
    '^/api/blog': '/api/blog',
  },
  onError: (err, req, res) => {
    res.status(503).json({
      success: false,
      error: {
        message: 'Blog service is unavailable',
      },
    });
  },
}));

app.use('/api/communities', createProxyMiddleware({
  target: services.community,
  changeOrigin: true,
  pathRewrite: {
    '^/api/communities': '/api/communities',
  },
  onError: (err, req, res) => {
    res.status(503).json({
      success: false,
      error: {
        message: 'Community service is unavailable',
      },
    });
  },
}));

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;

