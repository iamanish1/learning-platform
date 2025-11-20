const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../../../../shared/utils');
const { asyncHandler } = require('../../../../shared/middleware');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const result = await authService.registerUser(email, name, password);
    
    // Format response to match frontend expectations (user and token at root level of data)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.message.includes('already exists')) {
      return errorResponse(res, 'User with this email already exists', 409);
    }
    throw error;
  }
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authService.loginUser(email, password);
    
    // Format response to match frontend expectations (user and token at root level of response.data)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    if (error.message.includes('Invalid email or password')) {
      return errorResponse(res, 'Invalid email or password', 401);
    }
    throw error;
  }
});

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const userId = req.userId || req.user?.id;

  if (!userId) {
    return errorResponse(res, 'Authentication required', 401);
  }

  try {
    await authService.logoutUser(userId, refreshToken);
    
    return successResponse(res, { message: 'Logged out successfully' }, 'Logout successful');
  } catch (error) {
    // Even if logout fails, return success (token may already be invalid)
    return successResponse(res, { message: 'Logged out successfully' }, 'Logout successful');
  }
});

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return errorResponse(res, 'Refresh token is required', 400);
  }

  try {
    const result = await authService.refreshAccessToken(refreshToken);
    
    return successResponse(
      res,
      {
        token: result.token,
        refreshToken: result.refreshToken,
      },
      'Token refreshed successfully'
    );
  } catch (error) {
    if (error.message.includes('expired') || error.message.includes('Invalid')) {
      return errorResponse(res, error.message || 'Invalid or expired refresh token', 401);
    }
    throw error;
  }
});

/**
 * Verify email
 * POST /api/auth/verify-email/:token
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    const user = await authService.verifyEmail(token);
    
    return successResponse(
      res,
      { user },
      'Email verified successfully'
    );
  } catch (error) {
    if (error.message.includes('Invalid') || error.message.includes('expired')) {
      return errorResponse(res, error.message || 'Invalid or expired verification token', 400);
    }
    throw error;
  }
});

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const result = await authService.requestPasswordReset(email);
    
    // Always return success to prevent email enumeration
    return successResponse(res, null, result.message || 'If an account exists, a password reset email has been sent');
  } catch (error) {
    // Even on error, return success message to prevent email enumeration
    return successResponse(res, null, 'If an account exists, a password reset email has been sent');
  }
});

/**
 * Reset password
 * POST /api/auth/reset-password/:token
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const result = await authService.resetPassword(token, password);
    
    // Format response to match frontend expectations
    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    if (error.message.includes('Invalid') || error.message.includes('expired')) {
      return errorResponse(res, error.message || 'Invalid or expired reset token', 400);
    }
    throw error;
  }
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.userId || req.user?.id;

  if (!userId) {
    return errorResponse(res, 'Authentication required', 401);
  }

  try {
    const user = await authService.findUserById(userId);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, { user }, 'Profile retrieved successfully');
  } catch (error) {
    throw error;
  }
});

/**
 * Update user profile
 * PUT /api/auth/me
 */
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.userId || req.user?.id;

  if (!userId) {
    return errorResponse(res, 'Authentication required', 401);
  }

  try {
    const user = await authService.updateUserProfile(userId, req.body);
    
    return successResponse(
      res,
      { user },
      'Profile updated successfully'
    );
  } catch (error) {
    if (error.message.includes('not found')) {
      return errorResponse(res, 'User not found', 404);
    }
    throw error;
  }
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
};