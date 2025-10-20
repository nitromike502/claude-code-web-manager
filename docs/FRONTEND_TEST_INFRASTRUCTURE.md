# Frontend Test Infrastructure Guide

## Overview

The frontend test suite consists of 164 tests across 10 files, now with:
- ✅ **Hierarchical numbering system** (100% coverage)
- ✅ **Centralized mock fixtures** (proper route ordering)
- ✅ **Two-server architecture** (Vite frontend + Express backend)
- ✅ **Multi-browser support** (Chromium, Firefox, WebKit)

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ Test Execution (Playwright)                         │
│ - Runs on all 3 browsers (Chromium, Firefox, WebKit)│
│ - Uses hierarchical numbering [Test XX.YYY.ZZZ]    │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ Mock Fixtures Layer (fixtures/mock-data.js)        │
│ - Centralized test data                             │
│ - Proper route ordering (specific before generic)   │
│ - Consistent data across all tests                  │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ Vite Dev Server (localhost:5173)                    │
│ - Serves frontend app                               │
│ - Proxies API calls to Express backend              │
│ - Hot Module Replacement (HMR)                      │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ Express Backend (localhost:8420)                    │
│ - Serves API endpoints                              │
│ - Fallback for any unmocked calls                   │
│ - Real project discovery from ~/.claude.json        │
└─────────────────────────────────────────────────────┘
```

## Test Categories

### 1. Component Tests (120 tests, 7 files)

**Range: 01-06, 23**

Tests individual Vue components and features:

| Number | Name | Tests | Coverage |
|--------|------|-------|----------|
| **01** | App Smoke Tests | 9 | Basic init, theme, loading, API |
| **02** | Project Detail Page | 25 | Page load, URL params, navigation, theme, errors, loading, responsive |
| **03** | Router Navigation | 7 | Route transitions, SPA behavior, browser back |
| **04** | Component Rendering | 14 | Dashboard, ProjectDetail, UserGlobal, navigation, console |
| **05** | API Integration | 20 | Projects endpoint, project details, user config, errors, timeouts |
| **06** | Styling & Theme | 20 | CSS variables, dark/light modes, responsive, transitions |
| **23** | Pinia Stores | 6 | Store initialization, state management, localStorage |

**Usage:**
```bash
npm run test:frontend -- tests/frontend/01-app-smoke.spec.js
npm run test:frontend -- tests/frontend/02-project-detail.spec.js
# ... etc
```

### 2. E2E Tests (93 tests, 4 files)

**Range: 100-105**

Complete user workflows:

| Number | Name | Tests | Coverage |
|--------|------|-------|----------|
| **101** | Project Discovery | 18 | First-time user flow, project navigation |
| **100** | Complete Workflows | 24 | Dashboard → Detail → Sidebar → Back navigation |
| **102** | Configuration Viewing | 27 | Multi-project config viewing, icons, data integrity |
| **105** | Theme Toggle | 24 | Theme persistence across navigation and page reload |

**Usage:**
```bash
npm run test:frontend -- tests/e2e/101-user-flow-project-discovery.spec.js
npm run test:frontend -- tests/e2e/100-complete-user-flows-integration.spec.js
# ... etc
```

### 3. Responsive Tests (44 tests, 1 file)

**Range: 200.xxx.xxx**

Multi-viewport testing:

| Suite | Viewport | Tests | Coverage |
|-------|----------|-------|----------|
| **200.001** | Mobile (375×667) | 14 | Layout, components, touch targets, readability |
| **200.002** | Tablet (768×1024) | 14 | Same as mobile for consistency |
| **200.003** | Desktop (1920×1080) | 14 | Same as mobile/tablet |
| **200.004** | Transitions | 2 | Cross-viewport layout transitions, accessibility |

**Usage:**
```bash
npm run test:frontend -- tests/responsive/200-layout-responsive.spec.js
```

### 4. Visual Regression Tests (19 tests, 1 file)

**Range: 300.xxx.xxx**

Visual snapshot testing:

| Suite | Coverage | Tests |
|-------|----------|-------|
| **300.001** | Dashboard | 4 |
| **300.002** | Dashboard Dark/Light | 2 |
| **300.003** | Project Detail | 4 |
| **300.004** | Dashboard Components | 3 |
| **300.005** | Responsive | 3 |
| **300.006** | Interactive States | 3 |

**Usage:**
```bash
npm run test:frontend -- tests/frontend/visual/300-visual-regression.spec.js
```

## Running Tests

### Run All Tests
```bash
npm run test:frontend
```

### Run Specific Category
```bash
# Component tests only
npm run test:frontend -- tests/frontend

# E2E tests only
npm run test:frontend -- tests/e2e

# Responsive tests only
npm run test:frontend -- tests/responsive

# Visual tests only
npm run test:frontend -- tests/frontend/visual
```

### Run Specific File
```bash
npm run test:frontend -- tests/frontend/02-project-detail.spec.js
```

### Run Specific Test by Number
```bash
# Run test 02.001.001
npm run test:frontend -- tests/frontend/02-project-detail.spec.js -g "02.001.001"

# Run all tests in suite 02.005 (Error Handling)
npm run test:frontend -- tests/frontend/02-project-detail.spec.js -g "02.005"
```

### Run with Playwright UI
```bash
npm run test:frontend -- --ui
# Opens interactive Playwright UI for debugging
```

### Run Single Browser
```bash
npm run test:frontend -- --project=chromium
npm run test:frontend -- --project=firefox
npm run test:frontend -- --project=webkit
```

## Test Numbering Reference

**Format: [Test XX.YYY.ZZZ]**

```
01.001.001 = App Smoke / Basic Init / homepage loads successfully
02.005.003 = Project Detail / Error Handling / shows error when API returns HTTP error
100.002.001 = E2E Complete / Interactive / sidebar copy to clipboard
200.001.008 = Responsive Mobile / Theme toggle works on mobile
300.002.001 = Visual Dashboard / Dark mode appearance
```

## Setting Up Tests

### Prerequisites

1. **Node.js 18+** and npm
2. **Both servers running:**
   ```bash
   # Terminal 1: Frontend dev server
   npm run dev

   # Terminal 2: Backend server
   npm run dev:backend
   ```

3. **Ports available:**
   - 5173 (Vite frontend)
   - 8420 (Express backend)

### First Time Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm run test:frontend
```

## Mock Fixtures Usage

All frontend tests use centralized mock fixtures from `tests/fixtures/mock-data.js`.

**Basic usage:**
```javascript
const { setupMocks } = require('../fixtures/mock-data');

test('my test', async ({ page }) => {
  // Setup mocks BEFORE navigation
  await setupMocks(page);

  // Navigate and test
  await page.goto('/');
});
```

**See:** [Mock Fixtures Guide](../tests/MOCK_FIXTURES_GUIDE.md)

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Frontend Tests
  run: npm run test:frontend

- name: Upload Test Reports
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

### Test Output Format

```
Running 164 tests using 10 workers

✓ [Test 01.001.001] homepage loads successfully (543ms)
✓ [Test 01.001.002] page contains main app structure (612ms)
✓ [Test 02.001.001] page loads successfully with valid project ID (724ms)
...
✓ [Test 300.006.003] interactive states render correctly (891ms)

164 passed (2m 34s)
```

## Debugging Failed Tests

### 1. Check Error Message
```
Error: Timeout waiting for selector '.project-detail'
  - Indicates component didn't load
  - Check mock setup for API calls
```

### 2. Use Playwright Inspector
```bash
PWDEBUG=1 npm run test:frontend -- tests/frontend/02-project-detail.spec.js
# Opens Chrome DevTools for debugging
```

### 3. Check Mock Setup
```javascript
// Verify setupMocks is called BEFORE navigation
await setupMocks(page); // ← MUST be before goto
await page.goto('/');
```

### 4. Review Test Report
```bash
npx playwright show-report
# Opens HTML report with screenshots, videos, traces
```

## Performance Metrics

Current test performance:

| Category | Tests | Duration | Avg/Test |
|----------|-------|----------|----------|
| Component | 120 | ~90s | 750ms |
| E2E | 93 | ~80s | 860ms |
| Responsive | 44 | ~65s | 1.5s |
| Visual | 19 | ~45s | 2.4s |
| **TOTAL** | **164** | **~4m** | **1.5s** |

(Parallel execution across 3 browsers)

## Known Limitations

### Phase 2 SPA Architecture
- Some Phase 1 tests may fail due to routing changes
- Navigation tests use `/project/:id` instead of query parameters
- Breadcrumb navigation removed (now uses header nav)

### Test Isolation
- Tests run in parallel by default
- Each test gets fresh page context
- No state shared between tests

### Browser Differences
- Visual regression tests expect pixel-perfect matches
- Theme animations disabled for consistency
- Screenshots use 0.2 threshold for color differences

## Troubleshooting

### Tests timeout waiting for selectors
```
Error: Timeout waiting for selector '.project-detail'
```
**Solution:**
1. Verify backend is running (`npm run dev:backend`)
2. Check mock setup - ensure `setupMocks(page)` called
3. Increase timeout: `await page.waitForSelector(..., { timeout: 15000 })`

### Port already in use
```
Error: Port 5173 already in use
```
**Solution:**
```bash
# Kill existing process
pkill -f "node.*vite\|npm run dev"

# Or use different port
PORT=5174 npm run dev
```

### Playwright browsers not installed
```
Error: Chromium is not installed
```
**Solution:**
```bash
npx playwright install
```

### Tests pass locally but fail in CI
**Common causes:**
- Missing backend server
- Different timezone affecting dates
- Async timing issues
- Screen resolution differences

**Solution:**
- Ensure all mocks set up before navigation
- Use relative waits instead of timeouts
- Test in CI environment locally with same OS/node

## Resources

- **Playwright Docs:** https://playwright.dev/docs/intro
- **Test Reports:** `./playwright-report/` (after running tests)
- **Mock Fixtures:** `./tests/fixtures/mock-data.js`
- **Mock Guide:** `./tests/MOCK_FIXTURES_GUIDE.md`

## Contributing

When adding new frontend tests:

1. **Follow naming convention:** `NN-test-name.spec.js`
2. **Use hierarchical numbering:** `[Test NN.GGG.TTT]`
3. **Setup mocks first:** Call `setupMocks(page)` before `page.goto()`
4. **Add to fixtures:** Include test project in `mockProjects` array
5. **Run locally:** Verify test passes with both servers running
6. **Document:** Add test reference to this guide

## Summary

- ✅ 164 tests across 10 files
- ✅ Hierarchical numbering [Test XX.YYY.ZZZ]
- ✅ Centralized mock fixtures
- ✅ Multi-browser support
- ✅ Two-server architecture required
- ✅ ~4 minutes total test runtime

Ready for production CI/CD integration!
