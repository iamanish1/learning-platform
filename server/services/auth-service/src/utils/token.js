const crypto = require('crypto');

/**
 * Generate a random token
 * @param {number} length - Token length in bytes (default: 32)
 * @returns {string} - Random hex token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash a token using SHA256
 * @param {string} token - Token to hash
 * @returns {string} - Hashed token
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateToken,
  hashToken,
};
