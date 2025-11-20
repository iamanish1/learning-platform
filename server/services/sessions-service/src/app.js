const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFound, logger } = require('../../../shared/middleware');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(logger);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'sessions-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/sessions', require('./routes/sessions.routes'));

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;

