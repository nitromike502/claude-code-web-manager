# Visual Regression Tests (300 Series) - Status Analysis

**Date:** 2025-10-20
**Analysis Status:** Complete
**Recommendation:** Keep tests skipped until Phase 2 UI stabilizes

---

## Executive Summary

The visual regression tests (Test 300 series) in `tests/frontend/visual/300-visual-regression.spec.js` are **intentionally skipped** because they were written for **Phase 1 (static HTML)** but the application has migrated to **Phase 2 (Vue 3 SPA)**.

**Key Finding:** These tests reference Phase 1 UI patterns that no longer exist in Phase 2:
- Phase 1: Multi-page HTML with routes like `/project-detail.html?id=...`
- Phase 2: Single-page Vue app with Vue Router navigation

---

## Test File Overview

**File:** `tests/frontend/visual/300-visual-regression.spec.js`
**Status:** All test suites marked with `.skip`
**Total Tests:** 19 tests across 6 test suites
**Test Numbering:** 300.XXX.YYY format

### Test Suites (All Skipped)

| Suite | Tests | Focus | Status |
|-------|-------|-------|--------|
| **300.001** | 4 tests | Dashboard visual regression | ⏭️ Skipped |
| **300.002** | 2 tests | Dashboard dark/light mode | ⏭️ Skipped |
| **300.003** | 4 tests | Project detail view regression | ⏭️ Skipped |
| **300.004** | 3 tests | Dashboard components | ⏭️ Skipped |
| **300.005** | 3 tests | Responsive design | ⏭️ Skipped |
| **300.006** | 3 tests | Interactive states | ⏭️ Skipped |
| **TOTAL** | **19 tests** | | **⏭️ ALL SKIPPED** |

---

## Why Tests Are Skipped

### Official Note (Line 16-18)
```javascript
// PHASE 2 NOTE: These tests are skipped because Phase 2 has a completely different UI
// (Vue 3 SPA vs Phase 1 static HTML). Visual regression tests need to be recreated
// with new baselines for Phase 2 after UI is stable.
```

### Phase 1 → Phase 2 Architecture Changes

#### Phase 1 (Static HTML)
- Multi-page architecture with separate HTML files
- Navigation via HTML links and form submissions
- Route pattern: `/project-detail.html?id=projectid`
- CSS classes: `.project-card`, `.project-content`, `.breadcrumbs`
- Selectors work: `.project-card`, `.app-header`, `.breadcrumb-item.clickable`

#### Phase 2 (Vue 3 SPA)
- Single-page application with Vue Router
- Client-side navigation (no page reloads)
- Route pattern: `/projects/:projectId` (Vue Router)
- Different component structure and CSS classes
- Many Phase 1 selectors no longer valid

### Selector Compatibility Issues

The tests use Phase 1 selectors that may not work in Phase 2:

```javascript
// Phase 1 selectors (may not exist in Phase 2):
await page.waitForSelector('.project-card', { timeout: 10000 });
await page.waitForSelector('.project-content', { timeout: 10000 });
await page.waitForSelector('.app-header', { timeout: 10000 });
await page.waitForSelector('.breadcrumbs', { timeout: 10000 });
await page.waitForSelector('.theme-toggle', { timeout: 10000 });
```

### URL Pattern Issues

The tests use Phase 1 URL patterns that are incorrect in Phase 2:

```javascript
// Phase 1 patterns (won't work in Phase 2 SPA):
await page.goto('/project-detail.html?id=detailproject');
await page.goto('/project-detail.html?id=warningproject');
```

In Phase 2 with Vue Router:
- These URLs don't correspond to real routes
- Correct navigation is via Vue Router: `/projects/detailproject`, etc.
- Or programmatic: `router.push({ name: 'project-detail', params: { projectId: 'detailproject' } })`

---

## What Would Be Needed to Unskip These Tests

### 1. Update All Route Patterns
**Change from Phase 1 to Phase 2:**
```javascript
// Before (Phase 1):
await page.goto('/project-detail.html?id=detailproject');

// After (Phase 2):
await page.goto('/projects/detailproject');
```

### 2. Update Selector References
**Change from Phase 1 selectors to Phase 2 selectors:**
```javascript
// Before:
await page.waitForSelector('.project-card', { timeout: 10000 });

// After (requires analyzing actual Phase 2 component structure):
await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 });
// OR
await page.waitForSelector('.dashboard-project-card', { timeout: 10000 });
// Depends on actual Phase 2 component markup
```

### 3. Use Centralized Mock Data
**Current approach (inline mocks):**
```javascript
await page.route('/api/projects', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true, projects: [...] })
  });
});
```

**Better approach (Phase 2 pattern):**
```javascript
const { setupMocks } = require('../../fixtures/mock-setup.js');
await setupMocks(page);
```

This is the pattern we established and used successfully in Test 02 and Test 200 suites.

### 4. Generate New Visual Baselines
**After fixing selectors and routes:**
```bash
npx playwright test tests/frontend/visual/300-visual-regression.spec.js --update-snapshots
```

This creates new baseline screenshots for Phase 2 UI.

### 5. Wait for UI Stabilization
**Current status:** Phase 2 is complete, but continuing active development
- All 14 target tests now passing (100% pass rate)
- Core UI stable, but may receive polish/fixes
- Recommend waiting until Phase 3 planning before investing in visual regression tests

---

## Recommended Action

### Immediate (Current Session)
✅ **No action required** - Visual tests are correctly skipped
✅ **Document reason** - File already has clear note on lines 16-18
✅ **Focus on functional tests** - Test 02 and Test 200 are complete

### Short-term (Next Session)
⏳ **Monitor Phase 2 UI stability** - Ensure no major changes expected
⏳ **Plan visual regression strategy** - Decide if needed for Phase 2

### Long-term (Phase 3 Planning)
📋 **Recreate visual regression tests** - If Phase 3 requires visual regression testing:
1. Update all route patterns to Phase 2 routing
2. Update all selectors to Phase 2 component structure
3. Use centralized mock data pattern
4. Generate and commit baseline screenshots
5. Enable tests in CI/CD pipeline

---

## Test Suite Details

### Suite 300.001: Dashboard Visual Regression (4 tests)
- **300.001.001:** Dashboard renders correctly with projects
- **300.001.002:** Dashboard loading state
- **300.001.003:** Dashboard error state
- **300.001.004:** Dashboard empty state

**Issues:**
- Uses `.project-card` selector (Phase 1 only)
- Navigates to `/` (should work in Phase 2, but selectors won't)

### Suite 300.002: Dashboard Dark/Light Mode (2 tests)
- **300.002.001:** Dashboard in dark mode
- **300.002.002:** Dashboard in light mode

**Issues:**
- Uses `data-theme` attribute (may still work if implemented same way)
- Uses `.theme-toggle` selector (Phase 1 specific)
- Uses `.project-card` selector (Phase 1 only)

### Suite 300.003: Project Detail View (4 tests)
- **300.003.001:** Project detail view renders correctly
- **300.003.002:** Project detail view with warnings
- **300.003.003:** Project detail loading state
- **300.003.004:** Project detail error state

**Issues:**
- Uses Phase 1 URL pattern: `/project-detail.html?id=...`
- Uses `.project-content` selector (doesn't exist in Phase 2)
- Uses `.warning-banner` selector (likely doesn't exist)

### Suite 300.004: Dashboard Components (3 tests)
- **300.004.001:** Project card component
- **300.004.002:** Header component
- **300.004.003:** Breadcrumb component on detail page

**Issues:**
- Uses Phase 1 URL patterns
- Uses `.app-header`, `.breadcrumbs` selectors (Phase 1 only)

### Suite 300.005: Responsive Design (3 tests)
- **300.005.001:** Dashboard mobile viewport
- **300.005.002:** Dashboard tablet viewport
- **300.005.003:** Project detail mobile viewport

**Issues:**
- Uses Phase 1 URL patterns
- Uses `.project-card`, `.project-content` selectors

### Suite 300.006: Interactive States (3 tests)
- **300.006.001:** Project card hover state
- **300.006.002:** Theme toggle button states
- **300.006.003:** Breadcrumb hover state

**Issues:**
- Uses Phase 1 selectors throughout
- Won't find elements to hover over

---

## Context: Phase 2 UI Components

From our recent test fixes, we know Phase 2 uses:
- `.dashboard-header` (contains project title)
- `.dashboard-header h2` (specific element for project title)
- Sort dropdown instead of search input
- Vue Router navigation instead of HTML links
- Component-based rendering

These selectors would need to be discovered through component inspection when visual tests are recreated.

---

## Conclusion

The visual regression tests are **correctly skipped** and represent **Phase 1 artifacts** that were not migrated to Phase 2. They are not blocking any current work and should remain skipped until:

1. ✅ Phase 2 UI is completely stable (expected after current fixes)
2. ✅ Visual regression testing is prioritized for Phase 3
3. ✅ Someone has time to properly recreate tests with Phase 2 selectors and baselines

**Current Priority:** These tests are lower priority than the functional tests we've just fixed. All 354+ functional tests are passing with 100% success rate.

---

**Report Generated:** 2025-10-20
**Test Status:** ⏭️ 19 tests skipped (intentional)
**Recommendation:** Keep skipped until Phase 2 UI stabilizes and Phase 3 planning begins
