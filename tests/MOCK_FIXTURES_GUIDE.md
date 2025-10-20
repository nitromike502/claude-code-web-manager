# Test Mock Fixtures Guide

## Overview

The `fixtures/mock-data.js` file provides centralized, reusable mock data for all frontend tests. This ensures:

- **Consistent test data** across all test files
- **Proper mock route ordering** (specific routes before generic wildcards)
- **No API call conflicts** when tests run in parallel
- **Reduced test setup code** duplication

## Why This Matters

**Problem:** Frontend tests were setting up mocks individually in each test, leading to:
- Route ordering issues (generic wildcards catching specific calls)
- Data inconsistencies between tests
- Backend fallback when mocks failed
- Tests conflicting when running in parallel

**Solution:** Centralized fixtures with proper route ordering ensure all tests use consistent, mocked data.

## Usage

### Basic Setup

```javascript
const { setupMocks } = require('../fixtures/mock-data');

test('my test', async ({ page }) => {
  // Setup ALL mocks BEFORE navigating
  await setupMocks(page);

  // Now navigate - all API calls will be mocked
  await page.goto('/');

  // Test assertions here
});
```

### With Custom Projects

```javascript
const { setupMocks, mockProjects } = require('../fixtures/mock-data');

test('custom projects test', async ({ page }) => {
  const customProjects = [
    { id: 'custom1', name: 'Custom Project', stats: { agents: 5, commands: 10, hooks: 2, mcp: 1 } }
  ];

  await setupMocks(page, { projects: customProjects });
  await page.goto('/');
});
```

### Get Specific Project Data

```javascript
const { getProject, getProjectDetails } = require('../fixtures/mock-data');

const project = getProject('configproject');
const details = getProjectDetails('configproject');

console.log(project.stats); // { agents: 5, commands: 12, hooks: 3, mcp: 2 }
console.log(details.agents); // Array of agents for this project
```

## Available Fixtures

### Mock Projects

14 pre-configured projects for testing:

- `homeusertestproject` - Basic test project (3 agents, 5 commands, 2 hooks, 1 mcp)
- `testproject` - Empty project (0 of everything)
- `myproject` - Medium project (2 agents, 3 commands, 1 hook)
- `configproject` - Large project (5 agents, 12 commands, 3 hooks, 2 mcp)
- `emptyproject` - No configurations
- And 9 more for various test scenarios

### Mock User Configuration

Global user-level configurations (agents, commands, hooks, MCP servers).

### Mock Project Details

Preconfigured detail responses for each project covering:
- Agents list
- Commands list
- Hooks list
- MCP servers list

## Route Setup Order (Critical!)

The `setupMocks()` function sets routes in this order:

1. **User config endpoints** (`/api/user/*`) - Set first
2. **Specific project detail endpoints** (`/api/projects/:id/*`) - Set for each project
3. **Projects list endpoint** (`/api/projects`) - Set last (most general)

**Why this order matters:**

Playwright route matching is **first-match-wins**. If you set generic routes before specific ones, the generic route catches everything:

```javascript
// ❌ BAD ORDER - Generic catches specific calls
await page.route('**/api/projects*', () => { /* projects list mock */ });
await page.route('**/api/projects/configproject/agents', () => { /* detail mock */ });
// The first route matches "/api/projects/configproject/agents"
// and returns projects list instead of agents!

// ✅ GOOD ORDER - Specific routes matched first
await page.route('**/api/projects/configproject/agents', () => { /* detail mock */ });
await page.route('**/api/projects*', () => { /* projects list mock */ });
// Specific route is checked first
```

The `setupMocks()` function handles this automatically.

## Backend Server Status

### Current Recommendation

**Keep the backend server running** (`npm run dev:backend`)

**Why:**
- Tests use mocks for most API calls
- Backend provides real fallback for any unmocked calls
- Integrates with Vite proxy configuration
- No changes to test infrastructure needed

### If Migrating to 100% Mocked Tests

To eventually run tests without backend:

1. Ensure all `setupMocks(page)` calls are present before navigation
2. Add any custom projects needed for specific tests
3. Run: `npm run test:frontend -- --no-servers` (future feature)

## Migrating Existing Tests

### Before Migration

```javascript
test('example', async ({ page }) => {
  await page.route('**/api/projects*', (route) => {
    route.fulfill({ status: 200, body: JSON.stringify({ success: true, projects: [...] }) });
  });

  await page.route('**/api/projects/testproject/agents', (route) => {
    route.fulfill({ status: 200, body: JSON.stringify({ success: true, agents: [...] }) });
  });

  // More mock setups...
  await page.goto('/project/testproject');
});
```

### After Migration

```javascript
const { setupMocks } = require('../fixtures/mock-data');

test('example', async ({ page }) => {
  await setupMocks(page);
  await page.goto('/project/testproject');
});
```

## Adding New Test Projects

To add a new project for testing:

1. Add entry to `mockProjects` array in `fixtures/mock-data.js`
2. (Optional) Add detail data to `mockProjectDetails` object
3. Use in tests: `await setupMocks(page);`

Example:

```javascript
// In fixtures/mock-data.js
const mockProjects = [
  // ... existing projects
  {
    id: 'mynewproject',
    name: 'My New Project',
    path: '/my/new/project',
    stats: { agents: 2, commands: 4, hooks: 1, mcp: 0 }
  }
];

mockProjectDetails.mynewproject = {
  agents: [{ id: 'a1', name: 'Agent 1' }],
  commands: [{ id: 'c1', name: 'Command 1' }],
  hooks: [{ id: 'h1', name: 'Hook 1' }],
  mcp: []
};

// In your test file
test('my test', async ({ page }) => {
  await setupMocks(page);
  await page.goto('/project/mynewproject');
  // Test with mynewproject fixtures automatically!
});
```

## Performance Notes

- `setupMocks()` sets up route handlers (fast, < 50ms)
- Route matching happens on each API call (negligible overhead)
- Mocked responses return instantly (no network latency)
- Tests should run faster with mocks than with real backend

## Troubleshooting

### Tests still hitting real backend

**Problem:** Tests are calling real backend instead of mocks

**Solution:**
1. Verify `setupMocks(page)` is called BEFORE `page.goto()`
2. Check console for "API call not mocked" warnings
3. Add missing route mock to `setupMocks()` function
4. Ensure backend is running as fallback

### Route not matching

**Problem:** Specific project mock not matching

**Solution:**
1. Verify project ID in route matches actual project ID being tested
2. Check that route was set in `setupMocks()` (should show 20+ routes)
3. Ensure `setupMocks()` called before any API calls

### Data inconsistency between tests

**Problem:** Different tests get different project data

**Solution:**
- Both tests call `setupMocks(page)` with default mockProjects
- If custom data needed, pass via options: `setupMocks(page, { projects: custom })`

## Future Improvements

- [ ] Add `mockScenarios` for common test workflows
- [ ] Add `createMockProject()` helper for dynamic project creation
- [ ] Add warning logs when unmocked routes are called
- [ ] Add test reporter showing mock vs. real API calls
- [ ] Migrate all frontend tests to use centralized fixtures
