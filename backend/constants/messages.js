/**
 * @module constants/messages
 * Standardized response messages for consistent user experience
 */

module.exports = {
  // Success Messages
  SUCCESS: {
    USER_REGISTERED: 'User registered successfully',
    LOGIN_SUCCESSFUL: 'Login successful',
  },
  
  // Error Messages
  ERROR: {
    // Authentication
    INVALID_CREDENTIALS: 'Invalid email or password',
    LOGIN_FAILED: 'Login failed',
    TOKEN_EXPIRED: 'Authentication token has expired',
    TOKEN_INVALID: 'Invalid authentication token',
    
    // User Management
    USER_DATA_INVALID: 'User data is not valid',
  },

  // Validation Messages
  VALIDATION: {
    // Required Fields
    FIRST_NAME_REQUIRED: 'First name is required',
    LAST_NAME_REQUIRED: 'Last name is required',
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    
    // Length Validations
    FIRST_NAME_LENGTH: 'First name must be 1-50 characters',
    LAST_NAME_LENGTH: 'Last name must be 1-50 characters',
    PASSWORD_LENGTH: 'Password must be 8-128 characters',
    
    // Format Validations
    EMAIL_INVALID: 'Email must be a valid email address',
    PASSWORD_STRING: 'Password must be a string'
  }
};