/**
 * @module constants/firebase
 * Firebase-specific constants and API endpoints
 * Now uses environment variables for secure configuration
 */

// Import configuration system
const { getConfig } = require('../config/config');

// Get validated configuration
const config = getConfig();

module.exports = {
  // Firebase Auth API Endpoints
  API_ENDPOINTS: {
    SIGN_IN_WITH_PASSWORD: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
    REFRESH_TOKEN: 'https://securetoken.googleapis.com/v1/token',
  },

  // Environment-based Firebase Configuration (no hardcoded secrets)
  FIREBASE_CONFIG: config.firebase,
  
  // Token Configuration from environment
  TOKEN_EXPIRY_MINUTES: config.security.tokenExpiryMinutes,
  TOKEN_EXPIRY_SECONDS: config.security.tokenExpirySeconds,
  
  // Request Configuration
  RETURN_SECURE_TOKEN: config.security.returnSecureToken,

  // Environment identifier
  ENVIRONMENT: config.environment
};