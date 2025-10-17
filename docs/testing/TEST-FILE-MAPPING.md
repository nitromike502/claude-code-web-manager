# Playwright Test File Reference

## Purpose

This document provides a complete reference for all Playwright test files in the project, organized by number prefix for easy identification and navigation.

## Numbering Scheme

The test files are organized into distinct number ranges based on their testing category:

- **001-099:** Frontend Component Tests - Individual UI component rendering and behavior
- **100-199:** E2E Integration Tests - Complete user flows and interactions
- **200-299:** Responsive Layout Tests - Cross-device and viewport testing
- **300-399:** Visual Regression Tests - Screenshot comparison and visual validation

This numbering scheme allows for:
- Easy reference in bug reports and documentation
- Logical grouping of related tests
- Room for expansion within each category (gaps allow inserting new tests)
- Quick identification of test type from the filename

## File Mapping

### Frontend Component Tests (001-099)

| Number | File Path | Description | Test Focus |
|--------|-----------|-------------|------------|
| 01 | `/home/claude/manager/tests/frontend/01-app-smoke.spec.js` | Application smoke tests | Basic app functionality, navigation, theme toggle |
| 02 | `/home/claude/manager/tests/frontend/02-project-detail.spec.js` | Project detail view tests | Project header, config cards, API integration, sidebar |

**Reserved Numbers:**
- 03-09: Additional component tests
- 10-19: Dashboard-specific tests
- 20-29: Sidebar-specific tests
- 30-39: Config card tests
- 40-49: Navigation tests
- 50-99: Future component tests

### E2E Integration Tests (100-199)

| Number | File Path | Description | Test Focus |
|--------|-----------|-------------|------------|
| 100 | `/home/claude/manager/tests/e2e/100-complete-user-flows-integration.spec.js` | Complete user flow integration | End-to-end scenarios for all major features |
| 101 | `/home/claude/manager/tests/e2e/101-user-flow-project-discovery.spec.js` | Project discovery flow | Project scanning, selection, navigation |
| 102 | `/home/claude/manager/tests/e2e/102-user-flow-configuration-viewing.spec.js` | Configuration viewing flow | Viewing agents, commands, hooks, MCP servers |
| 103 | `/home/claude/manager/tests/e2e/103-user-flow-search-filter.spec.js` | Search and filter flow | Search functionality, filtering, results |
| 104 | `/home/claude/manager/tests/e2e/104-user-flow-error-handling.spec.js` | Error handling flow | Error states, validation, recovery |
| 105 | `/home/claude/manager/tests/e2e/105-user-flow-theme-toggle.spec.js` | Theme toggle flow | Dark/light mode switching, persistence |

**Reserved Numbers:**
- 106-119: Additional user flow tests
- 120-139: Multi-project workflows
- 140-159: Advanced interaction tests
- 160-199: Future integration tests

### Responsive Layout Tests (200-299)

| Number | File Path | Description | Test Focus |
|--------|-----------|-------------|------------|
| 200 | `/home/claude/manager/tests/responsive/200-layout-responsive.spec.js` | Responsive layout verification | Mobile, tablet, desktop viewports |

**Reserved Numbers:**
- 201-209: Additional responsive tests
- 210-219: Mobile-specific tests
- 220-229: Tablet-specific tests
- 230-239: Desktop-specific tests
- 240-299: Future responsive tests

### Visual Regression Tests (300-399)

| Number | File Path | Description | Test Focus |
|--------|-----------|-------------|------------|
| 300 | `/home/claude/manager/tests/frontend/visual/300-visual-regression.spec.js` | Visual regression testing | Screenshot comparison, UI consistency |

**Reserved Numbers:**
- 301-309: Additional visual regression tests
- 310-319: Component-specific visual tests
- 320-329: Theme-specific visual tests
- 330-399: Future visual tests

## Running Tests

### Run All Tests
```bash
npm run test:frontend
```

### Run by Category

**Frontend Component Tests:**
```bash
npm run test:frontend:component
```

**E2E Integration Tests:**
```bash
npm run test:frontend:e2e
```

**Visual Regression Tests:**
```bash
npm run test:frontend:visual
```

### Run Individual Tests

**By number prefix:**
```bash
npx playwright test 01-app-smoke
npx playwright test 100-complete-user-flows
npx playwright test 200-layout-responsive
npx playwright test 300-visual-regression
```

**By full filename:**
```bash
npx playwright test tests/frontend/01-app-smoke.spec.js
npx playwright test tests/e2e/100-complete-user-flows-integration.spec.js
```

## Test Development Guidelines

### Adding New Tests

When creating new test files:

1. **Choose appropriate number range** based on test category
2. **Use next available number** in sequence (e.g., 03 for next frontend component test)
3. **Update this mapping document** with the new test entry
4. **Follow naming convention:** `{number}-{descriptive-name}.spec.js`

### Naming Conventions

**Good:**
- `03-config-card-rendering.spec.js` - Clear, descriptive
- `106-user-flow-bulk-actions.spec.js` - Indicates category and purpose
- `210-mobile-navigation.spec.js` - Specific viewport focus

**Avoid:**
- `test1.spec.js` - Not descriptive
- `my-test.spec.js` - No number prefix
- `999-misc.spec.js` - Wrong category number

### Number Gaps

Leave gaps between tests to allow for future insertions:
- Use 01, 02, 03... (not 01, 02a, 02b)
- This allows inserting new tests (e.g., 02.5 becomes 03, shift others)
- Reserve number blocks for related test groups

## References

- **Playwright Config:** `/home/claude/manager/playwright.config.js`
- **Package Scripts:** `/home/claude/manager/package.json`
- **Test Reports:** `/home/claude/manager/docs/testing/test-reports/`

## Change History

| Date | Change | Author |
|------|--------|--------|
| 2025-10-17 | Initial creation with number prefix scheme | test-automation-engineer |

## Total Test Count

- Frontend Component: 2 tests
- E2E Integration: 6 tests
- Responsive Layout: 1 test
- Visual Regression: 1 test

**Total: 10 test files**
