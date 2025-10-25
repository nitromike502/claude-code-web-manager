# TASK-2.4.2: Update Integration Tests

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.4 - Testing & Documentation
**Estimated Time:** 15 minutes
**Priority:** High
**Status:** Not Started

## Description

Update existing integration tests to verify that ProjectDetail and UserGlobal pages work correctly with the new refactored components. Run cross-browser and responsive tests to ensure no regressions.

## Prerequisites

- ✅ All refactoring complete (Stories 2.1, 2.2, 2.3)
- ✅ Component unit tests passing (TASK-2.4.1)

## Acceptance Criteria

1. **Existing Tests Pass**
   - [ ] All 313+ existing tests pass
   - [ ] No test modifications needed (refactoring transparent)

2. **Integration Verification**
   - [ ] ProjectDetail page tests pass
   - [ ] UserGlobal page tests pass
   - [ ] Dashboard tests pass

3. **Cross-Browser Tests**
   - [ ] Chrome/Chromium tests pass
   - [ ] Firefox tests pass
   - [ ] Safari/WebKit tests pass

4. **Responsive Tests**
   - [ ] Mobile viewport tests pass
   - [ ] Tablet viewport tests pass
   - [ ] Desktop viewport tests pass

5. **Visual Regression Tests**
   - [ ] No visual regressions detected
   - [ ] All screenshots match baseline

## Testing Commands

```bash
# Full test suite
npm test

# Backend tests
npm run test:backend

# Frontend component tests
npm run test:frontend

# E2E integration tests
npm run test:e2e

# Responsive tests
npm run test:responsive

# Visual regression tests
npm run test:visual

# Specific test files
npm run test:e2e -- 101-project-detail
npm run test:e2e -- 105-user-global
npm run test:e2e -- 100-user-flow-navigation
```

## Testing Checklist

### E2E Integration Tests

**Test 100: User Flow Navigation**
- [ ] Dashboard loads
- [ ] Navigate to project
- [ ] Navigate to user config
- [ ] All navigation works

**Test 101: Project Detail Page**
- [ ] Page loads
- [ ] All 4 cards display
- [ ] Items clickable
- [ ] Sidebar opens
- [ ] Navigation works

**Test 102: User Global Page**
- [ ] Page loads
- [ ] All 4 cards display
- [ ] Items clickable
- [ ] Sidebar opens
- [ ] Navigation works

**Test 105: Configuration Display**
- [ ] All config types display
- [ ] Metadata renders correctly
- [ ] Empty states work
- [ ] Loading states work

### Cross-Browser Tests

**Chromium:**
```bash
npm run test:e2e -- --project=chromium
```
- [ ] All tests pass
- [ ] No console errors

**Firefox:**
```bash
npm run test:e2e -- --project=firefox
```
- [ ] All tests pass
- [ ] No console errors

**WebKit:**
```bash
npm run test:e2e -- --project=webkit
```
- [ ] All tests pass
- [ ] No console errors

### Responsive Tests

**Test 200: Responsive Design**
```bash
npm run test:responsive
```
- [ ] Mobile (375px) - all tests pass
- [ ] Tablet (768px) - all tests pass
- [ ] Desktop (1920px) - all tests pass
- [ ] Cards stack correctly
- [ ] Sidebar width responsive

### Visual Regression Tests

**Test 300: Visual Regression**
```bash
npm run test:visual
```
- [ ] Dashboard screenshots match
- [ ] ProjectDetail screenshots match
- [ ] UserGlobal screenshots match
- [ ] Cards appear identical
- [ ] Sidebar appears identical
- [ ] Dark mode matches
- [ ] Light mode matches

## Expected Test Results

**Total Tests:** 583+ tests
- Backend: 270 tests
- Frontend Component: 122+ tests (now includes new component tests)
- E2E Integration: 90 tests
- Responsive: 44 tests
- Visual Regression: 57 tests

**Expected Pass Rate:** 100% (583/583)

## Files to Reference

- `/home/claude/manager/tests/e2e/100-user-flow-navigation.spec.js`
- `/home/claude/manager/tests/e2e/101-project-detail-page.spec.js`
- `/home/claude/manager/tests/e2e/105-user-global-page.spec.js`
- `/home/claude/manager/tests/responsive/200-responsive-design.spec.js`
- `/home/claude/manager/tests/frontend/visual/300-visual-regression.spec.js`

## Success Indicators

1. ✅ All 583+ tests passing
2. ✅ Zero test failures
3. ✅ Zero console errors
4. ✅ Zero visual regressions
5. ✅ All browsers compatible
6. ✅ All viewports working

## Troubleshooting

### If Tests Fail

1. **Component Test Failures:**
   - Check component props
   - Verify event emissions
   - Check CSS selectors

2. **Integration Test Failures:**
   - Check imports in pages
   - Verify component usage
   - Check data flow

3. **Visual Regression Failures:**
   - Compare screenshots
   - Verify CSS changes
   - Update baselines if intended

4. **Cross-Browser Failures:**
   - Check browser-specific CSS
   - Verify polyfills
   - Check Vue 3 compatibility

## Related Tickets

**Part of Story:** STORY-2.4
**Depends On:** Stories 2.1, 2.2, 2.3, TASK-2.4.1

## Notes

### Test Should Not Need Modification

The refactoring is designed to be transparent to tests. If existing tests fail, it likely indicates:
- Missing component import
- Incorrect props
- Event handler mismatch
- CSS selector change

The goal is **100% test pass rate without modifying existing tests**.

### Visual Regression Baseline

If intentional visual changes were made:
```bash
npm run test:visual -- --update-snapshots
```

Only update if changes are intentional and approved.
