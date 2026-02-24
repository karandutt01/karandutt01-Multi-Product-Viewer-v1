/**
 * @module constants/messages
 * Standardized response messages for consistent user experience
 */

module.exports = {
  // Success Messages
  SUCCESS: {
    USER_REGISTERED: 'User registered successfully',
    LOGIN_SUCCESSFUL: 'Login successful',
    LOGOUT_SUCCESSFUL: 'Logout successful',
    PASSWORD_UPDATED: 'Password updated successfully',
    PROFILE_UPDATED: 'Profile updated successfully'
  },
  
  // Error Messages
  ERROR: {
    // Authentication
    INVALID_CREDENTIALS: 'Invalid email or password',
    LOGIN_FAILED: 'Login failed',
    TOKEN_EXPIRED: 'Authentication token has expired',
    TOKEN_INVALID: 'Invalid authentication token',
    ACCESS_DENIED: 'Access denied. Insufficient permissions',
    
    // User Management
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User with this email already exists',
    USER_REGISTRATION_FAILED: 'User registration failed',
    USER_DATA_INVALID: 'User data is not valid',
    
    // Validation
    REQUIRED_FIELD_MISSING: 'Required field is missing',
    INVALID_EMAIL_FORMAT: 'Invalid email format',
    PASSWORD_TOO_WEAK: 'Password must be at least 8 characters long',
    INVALID_INPUT: 'Invalid input provided',
    
    // General
    INTERNAL_ERROR: 'An internal server error occurred',
    RESOURCE_NOT_FOUND: 'Requested resource not found',
    INVALID_REQUEST: 'Invalid request format',
    NETWORK_ERROR: 'Network error occurred',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable'
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