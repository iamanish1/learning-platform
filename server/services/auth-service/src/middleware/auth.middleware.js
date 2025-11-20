const { verifyAccessToken } = require('../utils/jwt');
const { findUserById } = require('../services/auth.service');
const { errorResponse } = require('../../../../shared/utils');

/**
 * Authenticate JWT token middleware
 * Verifies the access token from Authorization header
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token required', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return errorResponse(res, 'Invalid or expired token', 401);
    }

    // Get user from database
    const user = await findUserById(decoded.id);
    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    // Attach user to request object
    req.user = user;
    req.userId = decoded.id;

    next();
  } catch (error) {
    return errorResponse(res, 'Authentication failed', 401);
  }
};

/**
 * Optional authentication middleware
 * Verifies token if present, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = verifyAccessToken(token);
        const user = await findUserById(decoded.id);
        
        if (user) {
          req.user = user;
          req.userId = decoded.id;
        }
      } catch (error) {
        // Ignore token errors for optional auth
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

/**
 * Check if user is email verified
 */
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Authentication required', 401);
  }

  if (!req.user.emailVerified) {
    return errorResponse(res, 'Email verification required', 403);
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireEmailVerification,
};