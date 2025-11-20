const User = require('../models/user.model');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} = require('../utils/jwt');
const { hashToken } = require('../utils/token');
const { sanitizeUser } = require('../utils/user');
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  blacklistToken,
  isTokenBlacklisted,
} = require('../utils/email');
const config = require('../config');
const crypto = require('crypto');

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} password - User password
 * @returns {Promise<object>} - User object and tokens
 */
const registerUser = async (email, name, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const user = new User({
    email: email.toLowerCase(),
    name,
    password,
    emailVerified: false,
  });

  // Generate email verification token
  const verificationToken = user.generateEmailVerificationToken();

  // Save user
  await user.save();

  // Send verification email
  try {
    await sendVerificationEmail(user.email, verificationToken, user.name);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // Don't throw error - user is created, email can be resent
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token to user
  const hashedRefreshToken = hashToken(refreshToken);
  user.refreshToken = hashedRefreshToken;
  const refreshTokenExpires = new Date();
  refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7); // 7 days
  user.refreshTokenExpires = refreshTokenExpires;
  await user.save({ select: false });

  return {
    user: sanitizeUser(user),
    token: accessToken,
    refreshToken,
  };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} - User object and tokens
 */
const loginUser = async (email, password) => {
  // Find user with password field included
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token to user
  const hashedRefreshToken = hashToken(refreshToken);
  user.refreshToken = hashedRefreshToken;
  const refreshTokenExpires = new Date();
  refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7); // 7 days
  user.refreshTokenExpires = refreshTokenExpires;

  await user.save({ select: false });

  return {
    user: sanitizeUser(user),
    token: accessToken,
    refreshToken,
  };
};

/**
 * Logout user (invalidate refresh token)
 * @param {string} userId - User ID
 * @param {string} refreshToken - Refresh token to invalidate
 */
const logoutUser = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Hash the refresh token to compare
  const hashedToken = hashToken(refreshToken);

  // Check if token matches
  if (user.refreshToken === hashedToken) {
    // Clear refresh token from user
    user.refreshToken = undefined;
    user.refreshTokenExpires = undefined;
    await user.save({ select: false });
  }

  // Add token to blacklist
  const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
  blacklistToken(refreshToken, expiresIn);
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<object>} - New access token and refresh token
 */
const refreshAccessToken = async (refreshToken) => {
  // Check if token is blacklisted
  if (isTokenBlacklisted(refreshToken)) {
    throw new Error('Token has been revoked');
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }

  // Find user with refresh token
  const hashedToken = hashToken(refreshToken);
  const user = await User.findOne({
    _id: decoded.id,
    refreshToken: hashedToken,
  }).select('+refreshToken +refreshTokenExpires');

  if (!user) {
    throw new Error('Invalid refresh token');
  }

  // Check if refresh token is expired in database
  if (user.refreshTokenExpires && new Date() > user.refreshTokenExpires) {
    throw new Error('Refresh token has expired');
  }

  // Generate new tokens
  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // Update refresh token in database
  const newHashedToken = hashToken(newRefreshToken);
  user.refreshToken = newHashedToken;
  const refreshTokenExpires = new Date();
  refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7); // 7 days
  user.refreshTokenExpires = refreshTokenExpires;
  await user.save({ select: false });

  // Blacklist old refresh token
  blacklistToken(refreshToken, 7 * 24 * 60 * 60 * 1000);

  return {
    token: accessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Verify email using token
 * @param {string} token - Verification token
 * @returns {Promise<object>} - User object
 */
const verifyEmail = async (token) => {
  // Hash the token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with this verification token
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    throw new Error('Invalid or expired verification token');
  }

  // Update user
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ select: false });

  return sanitizeUser(user);
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<object>} - Success message
 */
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  
  // Don't reveal if email exists or not (security best practice)
  if (!user) {
    // Still return success to prevent email enumeration
    return { message: 'If an account exists, a password reset email has been sent' };
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save({ select: false });

  // Send password reset email
  try {
    await sendPasswordResetEmail(user.email, resetToken, user.name);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    // Reset the token fields if email fails
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ select: false });
    throw new Error('Failed to send password reset email');
  }

  return { message: 'If an account exists, a password reset email has been sent' };
};

/**
 * Reset password using token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<object>} - User object and tokens
 */
const resetPassword = async (token, newPassword) => {
  // Hash the token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with this reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires +password');

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  // Update password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // Invalidate all refresh tokens (force re-login)
  user.refreshToken = undefined;
  user.refreshTokenExpires = undefined;

  await user.save({ select: false });

  // Generate new tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token
  const hashedRefreshToken = hashToken(refreshToken);
  user.refreshToken = hashedRefreshToken;
  const refreshTokenExpires = new Date();
  refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7); // 7 days
  user.refreshTokenExpires = refreshTokenExpires;
  await user.save({ select: false });

  return {
    user: sanitizeUser(user),
    token: accessToken,
    refreshToken,
  };
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<object>} - User object
 */
const findUserByEmail = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  return user ? sanitizeUser(user) : null;
};

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Promise<object>} - User object
 */
const findUserById = async (id) => {
  const user = await User.findById(id);
  return user ? sanitizeUser(user) : null;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {object} updateData - Data to update
 * @returns {Promise<object>} - Updated user object
 */
const updateUserProfile = async (userId, updateData) => {
  // Allowed fields to update
  const allowedFields = ['name'];
  const updateFields = {};

  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key)) {
      updateFields[key] = updateData[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new Error('User not found');
  }

  return sanitizeUser(user);
};

/**
 * Generate tokens for user
 * @param {object} user - User object
 * @returns {object} - Access and refresh tokens
 */
const generateTokens = (user) => {
  return {
    token: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  findUserByEmail,
  findUserById,
  updateUserProfile,
  generateTokens,
};