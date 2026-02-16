/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  // Root is backend/; will discover **/*.test.js by default
  clearMocks: true,
  coverageProvider: 'v8',
  collectCoverage: true,
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/?(*.)+(test).js'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/*.test.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!config/**',
    '!config.js',
    '!jest.config.js',
    '!server.js',

  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/backend/config/',
    '<rootDir>/backend/config\\.js$',
    '<rootDir>/jest\\.config\\.js$',
    '<rootDir>/server\\.js$',
    '/node_modules/',
    '/coverage/',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov', 'json-summary'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};