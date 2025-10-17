# Frontend Test Bug Tickets

**Created:** 2025-10-17
**Current Status:** 30 test failures (81% pass rate - 126/156 passing)
**Previous Status:** 47 test failures (70% pass rate) - 17 fixes applied
**Target:** 100% pass rate (156/156 passing)

---

## Overview

This document tracks all outstanding frontend test failures requiring resolution. Tests are categorized by action type:

- **REMOVE** (4 tickets): Tests reference UI elements removed in BUG-003/PR #35
- **FIX** (26 tickets): Legitimate test failures requiring debugging and fixes

**Priority Levels:**
- **Critical**: Blocks core functionality testing
- **High**: Affects multiple test scenarios or key user flows
- **Medium**: Isolated test issues
- **Low**: Edge cases or test quality improvements

---

## Category 1: Tests to Remove (Obsolete)

These tests reference the `.btn-user` header button that was removed in BUG-003 (PR #35). The User card is now always visible on the dashboard, eliminating the need for a toggle button.

### BUG-007: Obsolete Test - User Navigation Flow

**Status**: Open
**Priority**: High
**Category**: Test Infrastructure
**Assigned To**: test-automation-engineer
**Created**: 2025-10-17

#### Description
Test references removed `.btn-user` header button that no longer exists in the UI. The button was removed in BUG-003/PR #35 as part of simplifying the user configuration access pattern.

#### Location
- File: `/home/claude/manager/tests/e2e/complete-user-flows-integration.spec.js`
- Test Name: "user can navigate between project and user views seamlessly"
- Line Number: ~253-284 (describe block starting at 250)

#### Root Cause
Test was written before BUG-003 changes. The user button was removed and replaced with a permanent User card on the dashboard.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/complete-user-flows-integration.spec.js:253 --project=chromium
```

#### Expected Behavior
Test should not exist - this navigation pattern is no longer part of the UI.

#### Actual Behavior
Test fails looking for `.btn-user` selector that doesn't exist.

#### Proposed Solution
**REMOVE this test entirely.** Delete lines ~253-284 (the entire describe block for this test).

The functionality is already covered by:
- User card is always visible on dashboard
- Tests in `complete-user-flows-integration.spec.js` line 147 ("user can access user configurations and view details in sidebar")

#### Related Issues
- Related to: BUG-008, BUG-009, BUG-010 (all reference same removed button)
- Caused by: BUG-003 (PR #35) - User button removal

#### Notes
This is a quick win - simple deletion, no complex debugging required.

---

### BUG-008: Obsolete Test - Theme Toggle Cross-View

**Status**: Open
**Priority**: High
**Category**: Test Infrastructure
**Assigned To**: test-automation-engineer
**Created**: 2025-10-17

#### Description
Test references removed `.btn-user` header button in theme toggle persistence test across project and user views.

#### Location
- File: `/home/claude/manager/tests/e2e/complete-user-flows-integration.spec.js`
- Test Name: "theme toggle persists across all views and page reloads"
- Line Number: ~408 (within describe block at 407)

#### Root Cause
Test attempts to navigate to user view using `.btn-user` button that was removed in BUG-003/PR #35.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/complete-user-flows-integration.spec.js:408 --project=chromium
```

#### Expected Behavior
Test should not rely on removed UI element.

#### Actual Behavior
Test fails looking for `.btn-user` selector that doesn't exist.

#### Proposed Solution
**REMOVE this test entirely.** The theme toggle persistence is already tested in:
- `tests/e2e/user-flow-theme-toggle.spec.js` - comprehensive theme persistence tests
- Tests don't need to use the removed user button

#### Related Issues
- Related to: BUG-007, BUG-009, BUG-010
- Caused by: BUG-003 (PR #35)

#### Notes
Another quick win - simple deletion.

---

### BUG-009: Obsolete Test - Complete User Flow API Calls

**Status**: Open
**Priority**: High
**Category**: Test Infrastructure
**Assigned To**: test-automation-engineer
**Created**: 2025-10-17

#### Description
Test validates API calls during user navigation flow but relies on removed `.btn-user` button.

#### Location
- File: `/home/claude/manager/tests/e2e/complete-user-flows-integration.spec.js`
- Test Name: "complete user flow triggers all expected API calls"
- Line Number: ~578 (within describe block starting at 527)

#### Root Cause
Test uses removed `.btn-user` button to navigate to user view. Button removed in BUG-003/PR #35.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/complete-user-flows-integration.spec.js:578 --project=chromium
```

#### Expected Behavior
Test should not rely on removed UI element.

#### Actual Behavior
Test fails looking for `.btn-user` selector.

#### Proposed Solution
**REMOVE this test entirely.** API integration is already validated by:
- Individual API endpoint tests in `tests/frontend/project-detail.spec.js`
- Other E2E flows that test API calls without the removed button

#### Related Issues
- Related to: BUG-007, BUG-008, BUG-010
- Caused by: BUG-003 (PR #35)

#### Notes
Quick win - simple deletion.

---

### BUG-010: Obsolete Test - Console Errors During User Flow

**Status**: Open
**Priority**: Medium
**Category**: Test Infrastructure
**Assigned To**: test-automation-engineer
**Created**: 2025-10-17

#### Description
Test checks for console errors during complete user flow but relies on removed `.btn-user` button.

#### Location
- File: `/home/claude/manager/tests/e2e/complete-user-flows-integration.spec.js`
- Test Name: "no console errors occur during complete user flow"
- Line Number: Location uncertain (within E2E integration tests)

#### Root Cause
Test uses removed `.btn-user` button to navigate. Button removed in BUG-003/PR #35.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/complete-user-flows-integration.spec.js --grep "no console errors" --project=chromium
```

#### Expected Behavior
Test should not rely on removed UI element.

#### Actual Behavior
Test fails looking for `.btn-user` selector.

#### Proposed Solution
**REMOVE this test entirely.** Console error checking is already covered by:
- `tests/e2e/user-flow-configuration-viewing.spec.js:440` - "no console errors during configuration viewing flow"
- Other tests that monitor console errors without the removed button

#### Related Issues
- Related to: BUG-007, BUG-008, BUG-009
- Caused by: BUG-003 (PR #35)

#### Notes
Quick win - simple deletion. Lower priority than others since console error checking is well-covered by other tests.

---

## Category 2: Timeout Issues (22 Failures)

These tests exceed the 12-13 second timeout while waiting for elements or navigation. Requires systematic investigation with Playwright trace viewer.

### BUG-011: E2E Integration Timeout - Project Navigation

**Status**: Open
**Priority**: Critical
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
E2E integration test times out while waiting for project detail page to load after clicking project card.

#### Location
- File: `/home/claude/manager/tests/e2e/complete-user-flows-integration.spec.js`
- Test Name: "user can navigate from dashboard to project and view config details in sidebar"
- Line Number: 24

#### Root Cause
**Unknown** - Requires Playwright trace investigation.

Potential causes:
1. API mock routes not intercepting requests properly
2. Vue component mounting delay
3. Selector timing issues
4. Race condition between navigation and element rendering

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/complete-user-flows-integration.spec.js:24 --project=chromium --trace=on
npx playwright show-trace test-results/[test-name]/trace.zip
```

#### Expected Behavior
- Dashboard loads within 1-2 seconds
- Project card click navigates to detail page within 1-2 seconds
- All elements visible within 5 seconds total

#### Actual Behavior
Test exceeds 12-13 second timeout waiting for elements to appear.

#### Proposed Solution
1. **Investigation Phase:**
   - Run test with trace viewer
   - Identify which selector/wait is timing out
   - Check API mock interception timing
   - Analyze network waterfall for delays

2. **Likely Fixes:**
   - Increase specific timeout for slow element (not global timeout)
   - Add intermediate wait states
   - Improve selector specificity
   - Fix race condition with `waitForLoadState()`

#### Related Issues
- Blocks: BUG-012 through BUG-032 (similar timeout pattern)
- Pattern seen across 22 tests total

#### Notes
**This is the primary blocker.** Fixing the root cause here will likely resolve many related timeout issues.

---

### BUG-012: E2E Integration Timeout - User Configuration Access

**Status**: Open
**Priority**: Critical
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
E2E integration test times out when navigating to user configuration view and opening sidebar.

#### Location
- File: `/home/claude/manager/tests/e2e/complete-user-flows-integration.spec.js`
- Test Name: "user can access user configurations and view details in sidebar"
- Line Number: 147

#### Root Cause
**Unknown** - Requires Playwright trace investigation.

Similar pattern to BUG-011, suggesting shared root cause.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/complete-user-flows-integration.spec.js:147 --project=chromium --trace=on
npx playwright show-trace test-results/[test-name]/trace.zip
```

#### Expected Behavior
- User card click navigates to user view within 1-2 seconds
- User configuration loads within 2-3 seconds
- Sidebar opens within 1 second of button click

#### Actual Behavior
Test exceeds 12-13 second timeout.

#### Proposed Solution
Same investigation approach as BUG-011. Likely shares root cause.

#### Related Issues
- Related to: BUG-011 (similar timeout pattern)
- Blocks: Confidence in user configuration navigation

#### Notes
Critical for validating user-level configuration access.

---

### BUG-013: E2E Integration Timeout - Sidebar Copy to Clipboard

**Status**: Open
**Priority**: High
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while attempting to test sidebar copy to clipboard functionality.

#### Location
- File: `/home/claude/manager/tests/e2e/complete-user-flows-integration.spec.js`
- Test Name: "sidebar copy to clipboard functionality works in all contexts"
- Line Number: 254

#### Root Cause
**Unknown** - Requires Playwright trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/complete-user-flows-integration.spec.js:254 --project=chromium --trace=on
```

#### Expected Behavior
- Navigate to project detail
- Open sidebar
- Click copy button
- Verify clipboard content
All within 8-10 seconds.

#### Actual Behavior
Test exceeds 12-13 second timeout.

#### Proposed Solution
Investigate sidebar open timing and clipboard API interaction delays.

#### Related Issues
- Related to: BUG-011, BUG-012

#### Notes
Copy to clipboard is a key user feature - important to validate.

---

### BUG-014: E2E Integration Timeout - Keyboard Shortcuts

**Status**: Open
**Priority**: Medium
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while testing sidebar keyboard shortcuts (Escape key).

#### Location
- File: `/home/claude/manager/tests/e2e/complete-user-flows-integration.spec.js`
- Test Name: "sidebar responds to keyboard shortcuts across all views"
- Line Number: 338

#### Root Cause
**Unknown** - Requires Playwright trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/complete-user-flows-integration.spec.js:338 --project=chromium --trace=on
```

#### Expected Behavior
- Navigate to project
- Open sidebar
- Press Escape
- Sidebar closes
All within 8-10 seconds.

#### Actual Behavior
Test exceeds 12-13 second timeout.

#### Proposed Solution
Investigate keyboard event handling timing and sidebar close animation delays.

#### Related Issues
- Related to: BUG-013 (sidebar timing)

#### Notes
Keyboard shortcuts are accessibility-critical.

---

### BUG-015: E2E Integration Timeout - Warning Display

**Status**: Open
**Priority**: High
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while verifying warning banner display on project detail page.

#### Location
- File: `/home/claude/manager/tests/e2e/complete-user-flows-integration.spec.js`
- Test Name: "warnings from API are displayed correctly in all views"
- Line Number: 413

#### Root Cause
**Unknown** - Likely warning banner not appearing or appearing too slowly.

Possible causes:
1. Warning API response not being mocked correctly
2. Warning banner component not mounting
3. CSS visibility issues

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/complete-user-flows-integration.spec.js:413 --project=chromium --trace=on
```

#### Expected Behavior
- Navigate to project with warnings
- Warning banner appears within 2 seconds
- Warning messages visible

#### Actual Behavior
Test times out waiting for `.warning-banner` element (5 second timeout).

#### Proposed Solution
1. Verify warning API mock is providing warnings correctly
2. Check warning banner render logic in frontend
3. Verify CSS doesn't hide warning banner
4. Add debug logging to see if warnings are received

#### Related Issues
- Blocks: Confidence in error/warning UX

#### Notes
Warning display is critical for user feedback about configuration issues.

---

### BUG-016: E2E Integration Timeout - Empty State Display

**Status**: Open
**Priority**: Medium
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while verifying empty state messages for configurations.

#### Location
- File: `/home/claude/manager/tests/e2e/complete-user-flows-integration.spec.js`
- Test Name: "empty states display correctly across all configuration types"
- Line Number: 468

#### Root Cause
**Unknown** - Requires Playwright trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/complete-user-flows-integration.spec.js:468 --project=chromium --trace=on
```

#### Expected Behavior
- Navigate to project with no configurations
- Empty state messages visible in all 4 cards within 3 seconds

#### Actual Behavior
Test times out waiting for empty state elements.

#### Proposed Solution
Investigate empty state rendering timing and selector accuracy.

#### Related Issues
- Related to: BUG-011 (general timeout pattern)

#### Notes
Empty states are important for first-time user experience.

---

### BUG-017: E2E Integration Timeout - API Failure Recovery

**Status**: Open
**Priority**: High
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while testing network failure recovery with retry button.

#### Location
- File: `/home/claude/manager/tests/e2e/complete-user-flows-integration.spec.js`
- Test Name: "application handles API failures and provides recovery options"
- Line Number: 531

#### Root Cause
**Unknown** - Likely error state or retry logic timing issue.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/complete-user-flows-integration.spec.js:531 --project=chromium --trace=on
```

#### Expected Behavior
- API fails on first call
- Error state displayed
- Retry button clicked
- Success on second call
All within 10 seconds.

#### Actual Behavior
Test exceeds 12-13 second timeout.

#### Proposed Solution
Investigate error state rendering and retry mechanism timing.

#### Related Issues
- Critical for error handling UX validation

#### Notes
Error recovery is essential for robust user experience.

---

### BUG-018: E2E Integration Timeout - Invalid Project ID

**Status**: Open
**Priority**: Medium
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while testing invalid project ID error handling.

#### Location
- File: `/home/claude/manager/tests/e2e/complete-user-flows-integration.spec.js`
- Test Name: "application handles invalid project ID gracefully"
- Line Number: 582

#### Root Cause
**Unknown** - Requires Playwright trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/complete-user-flows-integration.spec.js:582 --project=chromium --trace=on
```

#### Expected Behavior
- Navigate with invalid project ID
- Error state displayed within 2-3 seconds
- Can navigate back to dashboard

#### Actual Behavior
Test exceeds timeout waiting for error state.

#### Proposed Solution
Investigate error state rendering for invalid project IDs.

#### Related Issues
- Related to: BUG-017 (error handling)

#### Notes
Edge case but important for robustness.

---

### BUG-019: Configuration Viewing Timeout - Project Navigation Structure

**Status**: Open
**Priority**: High
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while navigating through project detail view structure.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-configuration-viewing.spec.js`
- Test Name: "user navigates through project detail view structure"
- Line Number: 24

#### Root Cause
**Unknown** - Similar timeout pattern to BUG-011.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-configuration-viewing.spec.js:24 --project=chromium --trace=on
```

#### Expected Behavior
- Navigate from dashboard to project detail
- All configuration cards visible
- Breadcrumbs working
All within 8-10 seconds.

#### Actual Behavior
Test exceeds 12-13 second timeout.

#### Proposed Solution
Same investigation approach as BUG-011. Likely shares root cause.

#### Related Issues
- Related to: BUG-011, BUG-020

#### Notes
Fundamental navigation test - critical to fix.

---

### BUG-020: Configuration Viewing Timeout - Multiple Projects

**Status**: Open
**Priority**: High
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while viewing multiple projects sequentially.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-configuration-viewing.spec.js`
- Test Name: "project detail view displays correct statistics for multiple projects"
- Line Number: 105

#### Root Cause
**Unknown** - Compounds timeout issue across multiple navigations.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-configuration-viewing.spec.js:105 --project=chromium --trace=on
```

#### Expected Behavior
- View first project
- Return to dashboard
- View second project
All within 12-15 seconds.

#### Actual Behavior
Test exceeds timeout (likely on second navigation).

#### Proposed Solution
Fix underlying navigation timeout (BUG-011), which will likely resolve this test.

#### Related Issues
- Blocked by: BUG-011, BUG-019

#### Notes
Tests data persistence across navigation - important for data integrity.

---

### BUG-021: Configuration Viewing Timeout - Zero Configurations

**Status**: Open
**Priority**: Medium
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out when viewing project with zero configurations.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-configuration-viewing.spec.js`
- Test Name: "project with zero configurations displays correctly"
- Line Number: 171

#### Root Cause
**Unknown** - Similar to BUG-016 (empty state timing).

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-configuration-viewing.spec.js:171 --project=chromium --trace=on
```

#### Expected Behavior
- Navigate to empty project
- Empty state messages visible within 3 seconds

#### Actual Behavior
Test times out waiting for elements.

#### Proposed Solution
Investigate empty state rendering and selector timing.

#### Related Issues
- Related to: BUG-016

#### Notes
Edge case but affects new project experience.

---

### BUG-022: Configuration Viewing Timeout - Search Functionality

**Status**: Open
**Priority**: Low
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while testing search input on detail page.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-configuration-viewing.spec.js`
- Test Name: "search functionality exists on detail page for future config filtering"
- Line Number: 213

#### Root Cause
**Unknown** - Requires Playwright trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-configuration-viewing.spec.js:213 --project=chromium --trace=on
```

#### Expected Behavior
- Navigate to project detail
- Search input visible and functional within 2 seconds

#### Actual Behavior
Test times out.

#### Proposed Solution
Check search input selector and visibility timing.

#### Related Issues
- Related to: General navigation timeouts

#### Notes
Low priority - search is placeholder for Phase 2.

---

### BUG-023: Configuration Viewing Timeout - Data Integrity

**Status**: Open
**Priority**: Medium
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while verifying data integrity across navigation.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-configuration-viewing.spec.js`
- Test Name: "project detail view maintains data integrity across navigation"
- Line Number: 249

#### Root Cause
**Unknown** - Multiple navigation cycles compound timeout issues.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-configuration-viewing.spec.js:249 --project=chromium --trace=on
```

#### Expected Behavior
- Navigate to project, capture data
- Return to dashboard
- Navigate to project again
- Verify data matches
All within 12-15 seconds.

#### Actual Behavior
Test exceeds timeout (likely on second navigation).

#### Proposed Solution
Fix underlying navigation timeout (BUG-011).

#### Related Issues
- Blocked by: BUG-011, BUG-019, BUG-020

#### Notes
Important for cache/state management validation.

---

### BUG-024: Configuration Viewing Timeout - Icon Display

**Status**: Open
**Priority**: Low
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while verifying configuration type icons display.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-configuration-viewing.spec.js`
- Test Name: "configuration icons display correctly for each type"
- Line Number: 300

#### Root Cause
**Unknown** - Requires Playwright trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-configuration-viewing.spec.js:300 --project=chromium --trace=on
```

#### Expected Behavior
- Navigate to project
- All 4 configuration card icons visible within 3 seconds

#### Actual Behavior
Test times out waiting for icon elements.

#### Proposed Solution
Check icon selector accuracy and FontAwesome loading timing.

#### Related Issues
- Related to: General navigation timeouts

#### Notes
Visual polish validation - lower priority.

---

### BUG-025: Configuration Viewing Timeout - Large Configuration Counts

**Status**: Open
**Priority**: Low
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out when viewing project with large configuration counts (99+ items).

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-configuration-viewing.spec.js`
- Test Name: "project detail view handles large configuration counts"
- Line Number: 341

#### Root Cause
**Unknown** - May be legitimate performance issue with large datasets.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-configuration-viewing.spec.js:341 --project=chromium --trace=on
```

#### Expected Behavior
- Navigate to project with 99 agents, 250 commands
- Page renders within 5 seconds

#### Actual Behavior
Test times out.

#### Proposed Solution
1. Investigate if this is a real performance issue
2. If so, may need to implement pagination/virtualization (Phase 2)
3. If not, fix test timing expectations

#### Related Issues
- May reveal: Real performance issue
- May be: Test timing issue like others

#### Notes
Edge case but could reveal real performance problem.

---

### BUG-026: Configuration Viewing Timeout - Responsive Viewports

**Status**: Open
**Priority**: Medium
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while testing detail view across different viewport sizes (mobile, tablet, desktop).

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-configuration-viewing.spec.js`
- Test Name: "detail view works correctly on different viewport sizes"
- Line Number: 383

#### Root Cause
**Unknown** - Multiple viewport switches and navigations compound timeout issues.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-configuration-viewing.spec.js:383 --project=chromium --trace=on
```

#### Expected Behavior
- Test mobile (375x667)
- Test tablet (768x1024)
- Test desktop (1920x1080)
All within 15-20 seconds.

#### Actual Behavior
Test exceeds timeout.

#### Proposed Solution
Fix underlying navigation timeout (BUG-011), then verify viewport-specific timing.

#### Related Issues
- Blocked by: BUG-011
- Related to: Responsive design validation

#### Notes
Critical for mobile user experience validation.

---

### BUG-027: Configuration Viewing Timeout - Console Errors

**Status**: Open
**Priority**: High
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while monitoring for console errors during configuration viewing flow.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-configuration-viewing.spec.js`
- Test Name: "no console errors during configuration viewing flow"
- Line Number: 440

#### Root Cause
**Unknown** - Requires Playwright trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-configuration-viewing.spec.js:440 --project=chromium --trace=on
```

#### Expected Behavior
- Navigate through full flow
- Toggle theme
- Use search
- Navigate back
All within 12 seconds with no console errors.

#### Actual Behavior
Test exceeds timeout.

#### Proposed Solution
Fix underlying navigation timeout (BUG-011), then verify console error monitoring doesn't impact timing.

#### Related Issues
- Blocked by: BUG-011
- Related to: BUG-028 (console error filtering)

#### Notes
Important for catching JavaScript errors in production.

---

### BUG-028: Error Handling Timeout - Network Failure Test 1

**Status**: Open
**Priority**: High
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test times out while testing error handling for network failures.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-error-handling.spec.js`
- Test Name: Unknown (1 of 3 failures in this file)
- Line Number: Unknown

#### Root Cause
**Unknown** - Requires file inspection and trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-error-handling.spec.js --project=chromium --trace=on
```

#### Expected Behavior
- Simulate network failure
- Error state displayed
- Recovery action available

#### Actual Behavior
Test times out.

#### Proposed Solution
1. Identify specific test by running full file
2. Investigate error state rendering timing
3. Check error recovery mechanism

#### Related Issues
- Related to: BUG-017 (API failure recovery)
- Related to: BUG-029, BUG-030

#### Notes
Critical for error handling validation.

---

### BUG-029: Error Handling Timeout - Network Failure Test 2

**Status**: Open
**Priority**: High
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Second test timing out in error handling test file.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-error-handling.spec.js`
- Test Name: Unknown (2 of 3 failures)
- Line Number: Unknown

#### Root Cause
**Unknown** - Requires file inspection and trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-error-handling.spec.js --project=chromium --trace=on
```

#### Expected Behavior
Test completes within timeout.

#### Actual Behavior
Test times out.

#### Proposed Solution
Same investigation approach as BUG-028.

#### Related Issues
- Related to: BUG-028, BUG-030

---

### BUG-030: Error Handling Timeout - Network Failure Test 3

**Status**: Open
**Priority**: High
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Third test timing out in error handling test file.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-error-handling.spec.js`
- Test Name: Unknown (3 of 3 failures)
- Line Number: Unknown

#### Root Cause
**Unknown** - Requires file inspection and trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-error-handling.spec.js --project=chromium --trace=on
```

#### Expected Behavior
Test completes within timeout.

#### Actual Behavior
Test times out.

#### Proposed Solution
Same investigation approach as BUG-028.

#### Related Issues
- Related to: BUG-028, BUG-029

---

### BUG-031: Theme Toggle Timeout - Test 1

**Status**: Open
**Priority**: Medium
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Test timing out in theme toggle test file.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-theme-toggle.spec.js`
- Test Name: Unknown (1 of 2 failures)
- Line Number: Unknown

#### Root Cause
**Unknown** - Requires file inspection and trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-theme-toggle.spec.js --project=chromium --trace=on
```

#### Expected Behavior
Theme toggle works correctly and test completes within timeout.

#### Actual Behavior
Test times out.

#### Proposed Solution
1. Identify specific test by running full file
2. Investigate theme toggle timing
3. Check localStorage persistence delays

#### Related Issues
- Related to: BUG-032

#### Notes
Theme toggle is a key UX feature.

---

### BUG-032: Theme Toggle Timeout - Test 2

**Status**: Open
**Priority**: Medium
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Second test timing out in theme toggle test file.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-theme-toggle.spec.js`
- Test Name: Unknown (2 of 2 failures)
- Line Number: Unknown

#### Root Cause
**Unknown** - Requires file inspection and trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-theme-toggle.spec.js --project=chromium --trace=on
```

#### Expected Behavior
Test completes within timeout.

#### Actual Behavior
Test times out.

#### Proposed Solution
Same investigation approach as BUG-031.

#### Related Issues
- Related to: BUG-031

---

### BUG-033 through BUG-036: Search Filter Timeouts (4 Failures)

**Status**: Open
**Priority**: Medium
**Category**: E2E Test
**Assigned To**: Unassigned
**Created**: 2025-10-17

#### Description
Four tests timing out in search filter test file.

#### Location
- File: `/home/claude/manager/tests/e2e/user-flow-search-filter.spec.js`
- Test Names: Unknown (4 failures)
- Line Numbers: Unknown

#### Root Cause
**Unknown** - Requires file inspection and trace investigation.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/e2e/user-flow-search-filter.spec.js --project=chromium --trace=on
```

#### Expected Behavior
Search filter tests complete within timeout.

#### Actual Behavior
Tests time out.

#### Proposed Solution
1. Run full file to identify specific failing tests
2. Investigate search input timing and filtering delays
3. Check if search triggers re-renders that slow down tests

#### Related Issues
- Related to: General navigation timeouts

#### Notes
Search is a key usability feature on dashboard.

---

## Category 3: Console Error Detection Test (1 Failure)

### BUG-037: Console Error Test Too Strict

**Status**: Open
**Priority**: Low
**Category**: Unit Test
**Assigned To**: test-automation-engineer
**Created**: 2025-10-17

#### Description
Test fails because it detects console errors that are expected during development/testing (from mocked API routes and test infrastructure).

#### Location
- File: `/home/claude/manager/tests/frontend/project-detail.spec.js`
- Test Name: "page loads without console errors"
- Line Number: 892

#### Root Cause
Test expects zero console errors, but test infrastructure (route mocks, network failures) generates expected console errors.

#### Reproduction Steps
```bash
cd /home/claude/manager
npx playwright test tests/frontend/project-detail.spec.js:892 --project=chromium
```

#### Expected Behavior
Test should ignore expected console errors from:
- API route mocks
- Network request failures (intentional)
- Favicon 404s
- Other test infrastructure

#### Actual Behavior
Test fails on first console error, even if expected.

#### Proposed Solution
**FIX** - Update console error listener to filter out expected errors:

```javascript
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    const text = msg.text();
    // Filter out expected errors from test mocks and infrastructure
    if (!text.includes('Failed to fetch') &&
        !text.includes('HTTP error') &&
        !text.includes('Network request failed') &&
        !text.includes('Failed to load resource') &&
        !text.includes('net::ERR') &&
        !text.includes('favicon') &&
        !text.includes('__playwright')) {
      consoleErrors.push(text);
    }
  }
});
```

#### Related Issues
- Similar pattern in: `tests/e2e/user-flow-configuration-viewing.spec.js:440` (already has filtering)
- Reference implementation for correct approach

#### Notes
Low priority since this is a test quality issue, not an application bug. Easy fix - copy the filtering pattern from the working test.

---

## Summary by Priority

### Critical (3 tickets)
- BUG-011: E2E Integration Timeout - Project Navigation
- BUG-012: E2E Integration Timeout - User Configuration Access
- BUG-026: Configuration Viewing Timeout - Responsive Viewports

### High (10 tickets)
- BUG-007: Obsolete Test - User Navigation Flow (REMOVE)
- BUG-008: Obsolete Test - Theme Toggle Cross-View (REMOVE)
- BUG-009: Obsolete Test - Complete User Flow API Calls (REMOVE)
- BUG-013: E2E Integration Timeout - Sidebar Copy to Clipboard
- BUG-015: E2E Integration Timeout - Warning Display
- BUG-017: E2E Integration Timeout - API Failure Recovery
- BUG-019: Configuration Viewing Timeout - Project Navigation Structure
- BUG-020: Configuration Viewing Timeout - Multiple Projects
- BUG-027: Configuration Viewing Timeout - Console Errors
- BUG-028/29/30: Error Handling Timeout Tests (3 tests)

### Medium (11 tickets)
- BUG-010: Obsolete Test - Console Errors During User Flow (REMOVE)
- BUG-014: E2E Integration Timeout - Keyboard Shortcuts
- BUG-016: E2E Integration Timeout - Empty State Display
- BUG-018: E2E Integration Timeout - Invalid Project ID
- BUG-021: Configuration Viewing Timeout - Zero Configurations
- BUG-023: Configuration Viewing Timeout - Data Integrity
- BUG-031/32: Theme Toggle Timeout Tests (2 tests)
- BUG-033-036: Search Filter Timeouts (4 tests)

### Low (6 tickets)
- BUG-022: Configuration Viewing Timeout - Search Functionality
- BUG-024: Configuration Viewing Timeout - Icon Display
- BUG-025: Configuration Viewing Timeout - Large Configuration Counts
- BUG-037: Console Error Test Too Strict

---

## Summary by Action Type

### REMOVE (4 tickets - Quick Wins)
- BUG-007, BUG-008, BUG-009, BUG-010
- **Estimated Time:** 30 minutes total (simple deletions)
- **Impact:** Immediate +4 test pass rate improvement

### FIX - Console Error Filter (1 ticket - Quick Win)
- BUG-037
- **Estimated Time:** 15 minutes (copy existing pattern)
- **Impact:** +1 test pass rate improvement

### FIX - Timeout Investigation (25 tickets - Systematic Work)
- BUG-011 through BUG-036
- **Estimated Time:**
  - 2-4 hours to identify root cause (likely shared across many tests)
  - 2-4 hours to implement fixes
  - 1-2 hours to validate all tests pass
- **Impact:** +25 test pass rate improvement (reaching 100%)

---

## Quick Win Summary

**Immediate Actions (< 1 hour):**
1. Remove 4 obsolete tests → +4 tests passing (130/156 = 83%)
2. Fix console error filter → +1 test passing (131/156 = 84%)

**Total Quick Win Impact:** +5 tests in < 1 hour of work

**Remaining Work:**
- 25 timeout issues requiring systematic investigation
- Estimated 5-10 hours to reach 100% pass rate

---

**Last Updated:** 2025-10-17
**Next Review:** After quick wins are implemented
