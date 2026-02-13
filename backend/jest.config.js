/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  // Root is backend/; will discover **/*.test.js by default
  clearMocks: true,
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/?(*.)+(test).js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'controllers/**/**/*.js',
    '!**/__tests__/**',
    '!**/*.test.js'
  ],
  coverageDirectory: 'coverage',
  testTimeout: 10000
};