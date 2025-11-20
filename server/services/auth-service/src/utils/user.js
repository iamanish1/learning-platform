/**
 * Sanitize user object - remove sensitive fields
 * @param {object} user - User object
 * @returns {object} - Sanitized user object
 */
const sanitizeUser = (user) => {
  if (!user) return null;

  // Convert Mongoose document to plain object if needed
  const userObj = user.toObject ? user.toObject() : user;

  // Remove sensitive fields
  const {
    password,
    refreshToken,
    emailVerificationToken,
    passwordResetToken,
    __v,
    ...sanitized
  } = userObj;

  return sanitized;
};

module.exports = {
  sanitizeUser,
};
