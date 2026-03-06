/**
 * @module config/serviceAccount
 * Secure service account configuration using environment variables
 */

/**
 * Get service account configuration from environment variables
 * @returns {Object} Service account configuration object
 */
function getServiceAccountConfig() {
  // Validate required environment variables
  const requiredEnvVars = [
    'GOOGLE_SERVICE_ACCOUNT_TYPE',
    'GOOGLE_SERVICE_ACCOUNT_PROJECT_ID',
    'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID',
    'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
    'GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL',
    'GOOGLE_SERVICE_ACCOUNT_CLIENT_ID',
    'GOOGLE_SERVICE_ACCOUNT_AUTH_URI',
    'GOOGLE_SERVICE_ACCOUNT_TOKEN_URI',
    'GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_CERT_URL',
    'GOOGLE_SERVICE_ACCOUNT_CLIENT_CERT_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required service account environment variables: ${missingVars.join(', ')}`);
  }

  // Process private key with proper newline handling
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  
  // Handle different newline formats
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }
  
  // Validate private key format
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
    throw new Error('Invalid private key format. Must include BEGIN and END markers.');
  }

  // Construct service account object from environment variables
  return {
    type: process.env.GOOGLE_SERVICE_ACCOUNT_TYPE,
    project_id: process.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
    private_key_id: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
    auth_uri: process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_URI,
    token_uri: process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_CERT_URL
  };
}

/**
 * Initialize Firebase Admin SDK with service account
 * @returns {Object} Initialized Firebase Admin instance
 */
function initializeFirebaseAdmin() {
  const admin = require('firebase-admin');
  
  if (!admin.apps.length) {
    const serviceAccount = getServiceAccountConfig();
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
    
    console.log('✅ Firebase Admin initialized with service account');
  }
  
  return admin;
}

module.exports = {
  getServiceAccountConfig,
  initializeFirebaseAdmin
};