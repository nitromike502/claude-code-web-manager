# Testing Documentation

This directory contains all testing infrastructure and documentation for the Claude Code Manager project.

## Quick Start

### Run Tests

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run tests in watch mode (development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Testing Infrastructure

### Backend Testing (Jest + Supertest)

**Framework:** Jest 30.2.0 + Supertest 7.1.4
**Status:** Phase 1 Complete - Infrastructure set up and smoke tests passing
**Test Location:** `/home/claude/manager/tests/backend/`

**Current Test Coverage:**
- 8 smoke tests covering major API endpoints
- Health check endpoint validation
- Project listing endpoints
- User configuration endpoints
- Error handling (404 responses)

### Frontend Testing (Playwright)

**Framework:** Playwright
**Status:** Not yet implemented
**Test Location:** `/home/claude/manager/tests/frontend/` (future)

## Test Reports

All test execution reports are saved in `/home/claude/manager/docs/testing/test-reports/`

**Latest Report:** `jest-setup-report-20251012-000422.md`

## Configuration Files

- `/home/claude/manager/jest.config.js` - Jest configuration
- `/home/claude/manager/tests/setup.js` - Jest setup file (sets NODE_ENV=test)
- `/home/claude/manager/playwright.config.js` - Playwright configuration (future)

## Phase 1 Status (COMPLETE)

- [x] Jest infrastructure set up
- [x] Supertest integrated for API testing
- [x] Test directory structure created
- [x] Server modified for testability
- [x] 8 smoke tests passing
- [x] Test scripts added to package.json
- [x] Documentation complete

## Phase 2 Roadmap (Next Steps)

### High Priority
1. Create test fixtures (mock data for testing)
2. Individual endpoint tests (comprehensive coverage)
3. Regression tests for BUG-001 and BUG-002

### Medium Priority
4. Parser unit tests (subagent, command, hook, MCP parsers)
5. Error handling tests (malformed files, missing files, etc.)

### Low Priority
6. Integration tests (full workflow testing)
7. Cross-platform path handling tests

## Test Development Guidelines

### Backend Tests (Jest)

**File naming:** `{feature}.test.js`
**Location:** `/home/claude/manager/tests/backend/`

**Example:**
```javascript
const request = require('supertest');
const app = require('../../src/backend/server');

describe('Feature Name', () => {
  test('should do something', async () => {
    const response = await request(app).get('/api/endpoint');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});
```

### Frontend Tests (Playwright)

**File naming:** `{feature}.spec.js`
**Location:** `/home/claude/manager/tests/frontend/` (future)

**Status:** Not yet implemented

## Automated Quality Gate

Per the project workflow, **all tests must pass before creating Pull Requests**.

**Workflow:**
1. Developer implements feature
2. test-automation-engineer runs tests
   - If pass → Proceed to PR creation
   - If fail → Return to developer to fix
3. git-workflow-specialist creates PR (only after tests pass)
4. Code review and merge

**Hard Block:** PRs cannot be created if tests fail.

## Test Fixtures

**Location:** `/home/claude/manager/tests/fixtures/`
**Status:** Directory created, no fixtures yet (Phase 2)

**Planned Fixtures:**
- Sample project directory structures
- Valid/invalid agent markdown files
- Valid/invalid command files
- Sample settings.json files
- Sample .mcp.json files

## Troubleshooting

### Tests Won't Run

```bash
# Check Jest is installed
npx jest --version

# List all test files
npx jest --listTests

# Run with verbose output
npx jest --verbose
```

### Port Conflicts

If you see "EADDRINUSE" errors, ensure:
1. No other server is running on port 8420
2. `NODE_ENV=test` is set in tests (handled by setup.js)

### Test Hangs

Jest has `forceExit: true` in config to prevent hanging. If tests still hang:
```bash
npx jest --detectOpenHandles
```

## Contributing

When adding new tests:
1. Follow existing test structure and naming conventions
2. Write descriptive test names that explain what's being tested
3. Use Arrange-Act-Assert pattern
4. One assertion per test when possible
5. Update this README if adding new test categories

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [Playwright Documentation](https://playwright.dev/) (for future frontend tests)

---

**Last Updated:** 2025-10-12
**Status:** Phase 1 Complete, Phase 2 Ready to Start
