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

  FIREBASE_CONFIG : {
    apiKey: "AIzaSyASSGSw-qf99uUdoMTtjqTxmYfQnKtJYfk",
    authDomain: "multi-product-viewer.firebaseapp.com",
    projectId: "multi-product-viewer",
    storageBucket: "multi-product-viewer.firebasestorage.app",
    messagingSenderId: "725574217788",
    appId: "1:725574217788:web:c6fd8e533c50bc6370d339"
  },
  
  // Token Configuration
  TOKEN_EXPIRY_MINUTES: 20,
  TOKEN_EXPIRY_SECONDS: 60 * 20, // 20 minutes
  
  // Request Configuration
  RETURN_SECURE_TOKEN: true
};