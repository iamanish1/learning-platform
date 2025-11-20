/**
 * Validation utilities
 * Common validation functions
 */

/**
 * Validate required fields
 */
const validateRequired = (data, requiredFields) => {
  const missing = [];
  
  requiredFields.forEach((field) => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      missing.push(field);
    }
  });

  if (missing.length > 0) {
    return {
      isValid: false,
      errors: missing.map((field) => `${field} is required`),
    };
  }

  return { isValid: true };
};

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
const validatePassword = (password, minLength = 8) => {
  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters long`,
    };
  }

  return { isValid: true };
};

module.exports = {
  validateRequired,
  validateEmail,
  validatePassword,
};

