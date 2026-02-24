/**
 * @module constants/firebase
 * Firebase-specific constants and API endpoints
 */

module.exports = {
  // Firebase Auth API Endpoints
  API_ENDPOINTS: {
    SIGN_IN_WITH_PASSWORD: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
    REFRESH_TOKEN: 'https://securetoken.googleapis.com/v1/token',
  },
  
  // Token Configuration
  TOKEN_EXPIRY_MINUTES: 20,
  TOKEN_EXPIRY_SECONDS: 60 * 20, // 20 minutes
  
  // Request Configuration
  RETURN_SECURE_TOKEN: true
};