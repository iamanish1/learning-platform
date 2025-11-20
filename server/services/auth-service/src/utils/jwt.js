const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate JWT token
 * @param {object} payload - Token payload
 * @param {string} secret - JWT secret
 * @param {string} expiresIn - Expiration time (e.g., '15m', '7d')
 * @returns {string} - JWT token
 */
const generateJWT = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {object} - Decoded token payload
 */
const verifyJWT = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Generate access token
 * @param {object} user - User object
 * @returns {string} - Access token
 */
const generateAccessToken = (user) => {
  const payload = {
    id: user._id || user.id,
    email: user.email,
    type: 'access',
  };
  return generateJWT(payload, config.jwt.accessTokenSecret, config.jwt.accessTokenExpiresIn);
};

/**
 * Generate refresh token
 * @param {object} user - User object
 * @returns {string} - Refresh token
 */
const generateRefreshToken = (user) => {
  const payload = {
    id: user._id || user.id,
    email: user.email,
    type: 'refresh',
  };
  return generateJWT(payload, config.jwt.refreshTokenSecret, config.jwt.refreshTokenExpiresIn);
};

/**
 * Verify access token
 * @param {string} token - Access token
 * @returns {object} - Decoded token payload
 */
const verifyAccessToken = (token) => {
  return verifyJWT(token, config.jwt.accessTokenSecret);
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token
 * @returns {object} - Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return verifyJWT(token, config.jwt.refreshTokenSecret);
};

module.exports = {
  generateJWT,
  verifyJWT,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
