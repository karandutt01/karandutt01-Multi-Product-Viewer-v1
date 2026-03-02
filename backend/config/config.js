/**
 * @module config/config
 * Centralized configuration management with environment-specific loading
 * 
 * PURPOSE:
 * 1. Environment Detection & Loading
 * 2. Configuration Validation
 * 3. Centralized Configuration Access
 * 4. Error Handling & Fallbacks
 */

const path = require('path');
const fs = require('fs');

/**
 * Load environment-specific configuration files
 * Automatically detects and loads the correct .env file based on NODE_ENV
 */
function loadEnvironmentConfig(environment = process.env.NODE_ENV || 'development') {
  const envFile = `.env.${environment}`;
  const envPath = path.join(__dirname, '..', envFile);
  
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`Loaded configuration for environment: ${environment}`);
  } else {
    // Fallback to default .env file
    require('dotenv').config();
    console.warn(`Environment file ${envFile} not found, using default .env`);
  }
}


/**
 * Validate service account private key format
 */
function validatePrivateKey(privateKey) {
  if (!privateKey) {
    throw new Error('Private key is required');
  }
  
  // Handle escaped newlines
  const processedKey = privateKey.replace(/\\n/g, '\n');
  
  // Check for required markers
  if (!processedKey.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('Private key must start with -----BEGIN PRIVATE KEY-----');
  }
  
  if (!processedKey.includes('-----END PRIVATE KEY-----')) {
    throw new Error('Private key must end with -----END PRIVATE KEY-----');
  }
  
  // Basic length check (RSA 2048-bit keys are typically ~1600+ chars)
  if (processedKey.length < 1000) {
    throw new Error('Private key appears to be too short or malformed');
  }
  
  return true;
}

/**
 * Validate that all required environment variables are present
 * Prevents application startup with missing critical configuration
 */
function validateEnvironmentVariables(requiredVars) {
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    throw new Error(`Configuration error: Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Validate private key format
  try {
    validatePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
    console.log('✅ Private key format validation passed');
  } catch (error) {
    console.error('❌ Private key validation failed:', error.message);
    throw new Error(`Private key validation error: ${error.message}`);
  }

  console.log('All required environment variables are present');
}

/**
 * Get typed and validated configuration object
 * Provides a single source of truth for all application configuration
 */
function getConfig() {
  const environment = process.env.NODE_ENV || 'development';
  
  return {
    // Environment information
    environment,
    isDevelopment: environment === 'development',
    isStaging: environment === 'staging',
    isProduction: environment === 'production',
    
    // Security settings with type conversion and defaults
    security: {
      tokenExpiryMinutes: parseInt(process.env.TOKEN_EXPIRY_MINUTES) || 20,
      tokenExpirySeconds: parseInt(process.env.TOKEN_EXPIRY_SECONDS) || 1200,
      returnSecureToken: process.env.RETURN_SECURE_TOKEN === 'true'
    },
    
    // Firebase configuration
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    },
    
    // Server configuration
    server: {
      port: parseInt(process.env.PORT) || 3000,
      host: process.env.HOST || 'localhost'
    }
  };
}

/**
 * Initialize configuration system
 * Call this at application startup before importing other modules
 */
function initializeConfig() {
  try {
    // Load environment-specific configuration
    loadEnvironmentConfig();
    
    // Validate required variables
    const requiredEnvVars = [

      // Firebase configuration
      'FIREBASE_API_KEY',
      'FIREBASE_AUTH_DOMAIN',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_STORAGE_BUCKET',
      'FIREBASE_MESSAGING_SENDER_ID',
      'FIREBASE_APP_ID',

      // Service account configuration
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
    
    validateEnvironmentVariables(requiredEnvVars);
    
    console.log('🚀 Configuration system initialized successfully');
    return getConfig();
  } catch (error) {
    console.error('💥 Configuration initialization failed:', error.message);
    process.exit(1);
  }
}

module.exports = {
  loadEnvironmentConfig,
  validateEnvironmentVariables,
  validatePrivateKey,
  getConfig,
  initializeConfig
};