// Jest setup file - runs before all tests
// Set NODE_ENV to 'test' to prevent server from listening on a port
process.env.NODE_ENV = 'test';

// Mock HOME directory to use test fixtures
// This makes project discovery read from /home/claude/manager/tests/fixtures/user/.claude.json
process.env.HOME = '/home/claude/manager/tests/fixtures/user';
