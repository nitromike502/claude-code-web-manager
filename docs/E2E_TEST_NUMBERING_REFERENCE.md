# E2E Test Numbering Reference

This document provides a complete reference for all E2E tests using the hierarchical numbering system.

## Numbering Scheme

Tests use a three-level hierarchical numbering system:

```
[Test File].[Suite].[Individual Test]

Example: 101.001.003
- 101 = Test file (project discovery)
- .001 = First test suite/describe block
- .003 = Third individual test within that suite
```

## Test 101: Project Discovery (18/18 passing ✅)

### Test Suite 101.001: E2E Flow: First-Time User - Project Discovery

| Number | Test Name | Status |
|--------|-----------|--------|
| **101.001.001** | complete project discovery journey from dashboard to detail and back | ✅ PASSING |
| **101.001.002** | project discovery with empty state | ✅ PASSING |
| **101.001.003** | project discovery with API errors shows helpful message | ✅ PASSING |
| **101.001.004** | loading state displays while fetching projects | ✅ PASSING |
| **101.001.005** | performance: dashboard loads in under 2 seconds | ✅ PASSING |
| **101.001.006** | no console errors during project discovery flow | ✅ PASSING |

**Total: 6 tests, 6 passing, 0 skipped**

---

## Test 100: Complete Workflows Integration (15/24 passing ✅)

### Test Suite 100.001: E2E Integration: Complete User Flows

| Number | Test Name | Status |
|--------|-----------|--------|
| **100.001.001** | user can navigate from dashboard to project and view config details in sidebar | ✅ PASSING |
| **100.001.002** | user can access user configurations and view details in sidebar | ✅ PASSING |

**Subtotal: 2 tests, 2 passing**

### Test Suite 100.002: E2E Integration: Interactive Features

| Number | Test Name | Status |
|--------|-----------|--------|
| **100.002.001** | sidebar copy to clipboard functionality works in all contexts | ⏸️ SKIPPED |
| **100.002.002** | sidebar responds to keyboard shortcuts across all views | ⏸️ SKIPPED |

**Subtotal: 2 tests, 0 passing, 2 skipped**

### Test Suite 100.003: E2E Integration: API Integration Points

| Number | Test Name | Status |
|--------|-----------|--------|
| **100.003.001** | warnings from API are displayed correctly in all views | ⏸️ SKIPPED |
| **100.003.002** | empty states display correctly across all configuration types | ✅ PASSING |

**Subtotal: 2 tests, 1 passing, 1 skipped**

### Test Suite 100.004: E2E Integration: Error Handling & Recovery

| Number | Test Name | Status |
|--------|-----------|--------|
| **100.004.001** | application handles API failures and provides recovery options | ✅ PASSING |
| **100.004.002** | application handles invalid project ID gracefully | ✅ PASSING |

**Subtotal: 2 tests, 2 passing**

**Total: 8 tests, 5 passing, 3 skipped**

---

## Test 102: Configuration Viewing (0/27 passing ⚠️)

### Test Suite 102.001: E2E Flow: Configuration Viewing Journey (SKIPPED)

**Note:** This entire test suite is skipped (`test.describe.skip()`) due to Phase 2 SPA architecture incompatibilities. Tests are preserved for reference.

| Number | Test Name | Status |
|--------|-----------|--------|
| **102.001.001** | user navigates through project detail view structure | ⏸️ SKIPPED |
| **102.001.002** | project detail view displays correct statistics for multiple projects | ⏸️ SKIPPED |
| **102.001.003** | project with zero configurations displays correctly | ⏸️ SKIPPED |
| **102.001.004** | search functionality exists on detail page for future config filtering | ⏸️ SKIPPED |
| **102.001.005** | project detail view maintains data integrity across navigation | ⏸️ SKIPPED |
| **102.001.006** | configuration icons display correctly for each type | ⏸️ SKIPPED |
| **102.001.007** | project detail view handles large configuration counts | ⏸️ SKIPPED |
| **102.001.008** | detail view works correctly on different viewport sizes | ⏸️ SKIPPED |
| **102.001.009** | no console errors during configuration viewing flow | ⏸️ SKIPPED |

**Total: 9 tests, 0 passing, 9 skipped**

---

## Summary

| Test | File | Suites | Tests | Passing | Skipped | Status |
|------|------|--------|-------|---------|---------|--------|
| **101** | Project Discovery | 1 | 6 | 6 | 0 | ✅ Complete |
| **100** | Complete Workflows | 4 | 8 | 5 | 3 | ✅ Core passing |
| **102** | Configuration Viewing | 1 | 9 | 0 | 9 | ⏸️ Skipped |
| **Total** | | **6** | **23** | **11** | **12** | |

---

## How to Reference Tests

### In Bug Reports
> **Issue:** Sidebar not closing when Escape pressed
> **Affected Test:** [Test 100.002.002] - sidebar responds to keyboard shortcuts across all views
> **Status:** Currently skipped - needs investigation

### In Code Reviews
> **PR:** Fix Project Detail selector mismatch
> **References:** [Tests 102.001.001] through [102.001.009] - Configuration Viewing suite
> **Note:** These tests are currently skipped pending selector verification

### In Documentation
> The core project discovery flow is validated by [Test 101.001.001] through [101.001.006].
> Error handling is tested in [Test 100.004.001] and [100.004.002].

### In Commit Messages
```bash
git commit -m "fix: resolve sidebar closing issue [Test 100.002.002]"
git commit -m "test: enable [Tests 102.001.001-102.001.009] after Phase 2 selector fixes"
```

---

## Test Execution

### Run Specific Test by Number
To run a specific test by its number, use:

```bash
# Run Test 101.001.001
npm run test:frontend -- tests/e2e/101-user-flow-project-discovery.spec.js --grep "complete project discovery journey"

# Run entire Test Suite 100.001 (two tests)
npm run test:frontend -- tests/e2e/100-complete-user-flows-integration.spec.js --grep "Complete User Flows"

# Run all Test 100 tests (8 tests)
npm run test:frontend -- tests/e2e/100-complete-user-flows-integration.spec.js
```

### Run All E2E Tests
```bash
npm run test:frontend
```

---

## Phase 2 Migration Status

### Already Migrated
- ✅ Test 101: Project Discovery (uses Phase 2 architecture)
- ✅ Test 100: Complete Workflows (partial - core flows working)

### In Progress
- 🔄 Test 100: Advanced features skipped (copy, keyboard, warnings)
- 🔄 Test 102: Applied Phase 2 fixes but selector mismatches remain

### Not Yet Started
- ⏳ Test 105: Theme Toggle (not yet addressed)
- ⏳ Test 103, 104: Moved to `.deleted/` (low priority)

---

## Notes

- All test numbers include the test file prefix for uniqueness
- Skipped tests are clearly marked and can be re-enabled once issues are resolved
- The numbering scheme allows precise test referencing across documentation, bug reports, and code reviews
- Test file numbers (101, 100, 102) correspond to the numerical prefix in filenames

Last updated: 2025-10-19
