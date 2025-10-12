module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  testMatch: ['**/tests/backend/**/*.test.js'],
  collectCoverageFrom: [
    'src/backend/**/*.js',
    '!src/backend/server.js',
    '!**/node_modules/**'
  ],
  testTimeout: 10000,
  verbose: true,
  // Force exit after tests complete to prevent hanging
  forceExit: true,
  // Detect open handles that prevent Jest from exiting
  detectOpenHandles: false,
  // Set NODE_ENV to test for all Jest tests
  setupFiles: ['<rootDir>/tests/setup.js']
};
