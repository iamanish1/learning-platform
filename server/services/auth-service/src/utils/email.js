const nodemailer = require('nodemailer');
const config = require('../config');

// In-memory token blacklist (for MVP, use Redis in production)
const tokenBlacklist = new Map();

/**
 * Create email transporter based on configuration
 */
const createTransporter = () => {
  // If SendGrid API key is provided, use SendGrid
  if (config.email.sendGridApiKey) {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: config.email.sendGridApiKey,
      },
    });
  }

  // Otherwise use SMTP configuration
  if (config.email.service === 'smtp' && config.email.host) {
    return nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: config.email.auth.user
        ? {
            user: config.email.auth.user,
            pass: config.email.auth.pass,
          }
        : undefined,
    });
  }

  // Default to Gmail if email user is configured
  if (config.email.auth?.user) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass,
      },
    });
  }

  // Development: create test account if no email config
  if (config.nodeEnv === 'development' || config.nodeEnv === 'test') {
    console.warn('⚠️  No email configuration found. Email sending will be disabled.');
    return null;
  }

  throw new Error('Email configuration is required in production');
};

const transporter = createTransporter();

/**
 * Send email
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} options.text - Email text content (optional)
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    console.log('📧 Email would be sent (email service not configured):');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${text || html}`);
    return { success: true, message: 'Email service not configured - logged to console' };
  }

  try {
    const info = await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send email verification email
 * @param {string} email - User email
 * @param {string} token - Verification token
 * @param {string} name - User name
 */
const sendVerificationEmail = async (email, token, name) => {
  const verificationUrl = `${config.frontendUrl}/verify-email/${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Verify Your Email</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hi ${name},</p>
          <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      </body>
    </html>
  `;

  const text = `Hi ${name},\n\nThank you for signing up! Please verify your email address by visiting:\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, you can safely ignore this email.`;

  return await sendEmail({
    to: email,
    subject: 'Verify Your Email Address',
    html,
    text,
  });
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} token - Reset token
 * @param {string} name - User name
 */
const sendPasswordResetEmail = async (email, token, name) => {
  const resetUrl = `${config.frontendUrl}/reset-password/${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Reset Your Password</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hi ${name || 'there'},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #f5576c;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      </body>
    </html>
  `;

  const text = `Hi ${name || 'there'},\n\nWe received a request to reset your password. Visit this link to reset it:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, you can safely ignore this email.`;

  return await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    html,
    text,
  });
};

/**
 * Add token to blacklist (for logout)
 * @param {string} token - Token to blacklist
 * @param {number} expiresIn - Expiration time in milliseconds
 */
const blacklistToken = (token, expiresIn) => {
  const expiresAt = Date.now() + expiresIn;
  tokenBlacklist.set(token, expiresAt);

  // Clean up expired tokens periodically
  setTimeout(() => {
    tokenBlacklist.delete(token);
  }, expiresIn);
};

/**
 * Check if token is blacklisted
 * @param {string} token - Token to check
 * @returns {boolean} - True if token is blacklisted
 */
const isTokenBlacklisted = (token) => {
  const expiresAt = tokenBlacklist.get(token);
  if (!expiresAt) return false;

  // If expired, remove and return false
  if (Date.now() > expiresAt) {
    tokenBlacklist.delete(token);
    return false;
  }

  return true;
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  blacklistToken,
  isTokenBlacklisted,
};
