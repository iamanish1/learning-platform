const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../../../shared/middleware');
const { successResponse } = require('../../../../shared/utils');

// Middleware
const {
  authenticateToken,
  optionalAuth,
} = require('../middleware/auth.middleware');
const {
  authLimiter,
  passwordResetLimiter,
  generalLimiter,
} = require('../middleware/rateLimiter');
const {
  validateRegister,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateRefreshToken,
  validateLogout,
  validateEmailVerification,
  validateProfileUpdate,
} = require('../middleware/validation');

// Controllers
const {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
} = require('../controllers/auth.controller');

// Health check route
router.get('/', asyncHandler(async (req, res) => {
  return successResponse(res, { message: 'Auth service is running' }, 'Auth service endpoint');
}));

// Public routes
// Register - POST /api/auth/register
router.post('/register', authLimiter, validateRegister, register);

// Login - POST /api/auth/login
router.post('/login', authLimiter, validateLogin, login);

// Refresh token - POST /api/auth/refresh
router.post('/refresh', generalLimiter, validateRefreshToken, refreshToken);

// Verify email - POST /api/auth/verify-email/:token
router.post('/verify-email/:token', generalLimiter, validateEmailVerification, verifyEmail);

// Forgot password - POST /api/auth/forgot-password
router.post('/forgot-password', passwordResetLimiter, validatePasswordResetRequest, requestPasswordReset);

// Reset password - POST /api/auth/reset-password/:token
router.post('/reset-password/:token', passwordResetLimiter, validatePasswordReset, resetPassword);

// Protected routes
// Logout - POST /api/auth/logout
router.post('/logout', authenticateToken, validateLogout, logout);

// Get profile - GET /api/auth/me
router.get('/me', authenticateToken, getProfile);

// Update profile - PUT /api/auth/me
router.put('/me', authenticateToken, validateProfileUpdate, updateProfile);

module.exports = router;

