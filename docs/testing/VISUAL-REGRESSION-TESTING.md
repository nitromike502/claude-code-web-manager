# Visual Regression Testing Guide

## Overview

Visual regression testing uses Playwright's built-in screenshot comparison to automatically detect unintended visual changes in the UI. This ensures that code changes don't accidentally break the visual appearance of the application.

## How It Works

1. **Baseline Screenshots**: The first time a visual test runs, Playwright captures baseline screenshots
2. **Comparison**: On subsequent runs, new screenshots are compared against the baselines
3. **Diff Detection**: If differences exceed configured thresholds, the test fails
4. **Diff Reports**: Visual diffs are generated showing exactly what changed

## Test Coverage

### Dashboard Views
- **dashboard-with-projects.png** - Dashboard with multiple projects loaded
- **dashboard-loading-state.png** - Loading state while fetching projects
- **dashboard-error-state.png** - Error state when API fails
- **dashboard-empty-state.png** - Empty state when no projects exist
- **dashboard-dark-mode.png** - Dashboard in dark theme
- **dashboard-light-mode.png** - Dashboard in light theme

### Project Detail Views
- **project-detail-view.png** - Full project detail page
- **project-detail-with-warnings.png** - Detail view with warning banner
- **project-detail-loading.png** - Loading state
- **project-detail-error.png** - Error state (project not found)

### Component-Level Screenshots
- **project-card-component.png** - Individual project card
- **header-component.png** - Application header
- **breadcrumb-component.png** - Breadcrumb navigation

### Responsive Design
- **dashboard-mobile.png** - Dashboard at 375x667 (mobile)
- **dashboard-tablet.png** - Dashboard at 768x1024 (tablet)
- **project-detail-mobile.png** - Detail view at 375x667 (mobile)

### Interactive States
- **project-card-hover.png** - Project card with hover effect
- **theme-toggle-hover.png** - Theme toggle button on hover
- **breadcrumb-hover.png** - Breadcrumb link on hover

## Running Visual Tests

### Run All Visual Tests
```bash
cd /home/claude/manager
npm run test:frontend:visual
```

### Run All Frontend Tests (including visual)
```bash
npm run test:frontend
```

### Update Baseline Screenshots
When you make **intentional** UI changes, update the baselines:
```bash
npm run test:visual:update
```

### View Test Report
```bash
npm run test:visual:report
```

## Configuration

Visual regression settings are in `/home/claude/manager/playwright.config.js`:

```javascript
expect: {
  toHaveScreenshot: {
    maxDiffPixels: 100,        // Max pixels that can differ
    maxDiffPixelRatio: 0.002,  // Max 0.2% of pixels can differ
    threshold: 0.2,            // Pixel color difference threshold
    animations: 'disabled',    // Disable animations for consistency
    caret: 'hide',             // Hide text cursor
  }
}
```

### Threshold Meanings

- **maxDiffPixels**: Absolute pixel count (100 pixels = very small area)
- **maxDiffPixelRatio**: Percentage of total pixels (0.002 = 0.2%)
- **threshold**: Color difference sensitivity (0.2 = 20% color variance allowed)

## Baseline Screenshot Locations

Baselines are stored in:
```
/home/claude/manager/tests/frontend/visual/visual-regression.spec.js-snapshots/
```

Structure:
```
visual-regression.spec.js-snapshots/
└── chromium/
    ├── dashboard-with-projects.png
    ├── dashboard-dark-mode.png
    ├── project-detail-view.png
    └── ...
```

## Troubleshooting

### Test Fails Due to Minor Differences

**Symptom**: Test fails with message like "Screenshot comparison failed. Expected 0 different pixels, but got 45."

**Causes**:
- Font rendering differences (anti-aliasing)
- Browser version updates
- System font changes
- Timing issues (animations not fully settled)

**Solutions**:
1. Review the diff image in the test report
2. If change is expected, update baseline: `npm run test:visual:update`
3. If change is unexpected, investigate what caused the visual change
4. Adjust `maxDiffPixels` threshold if needed (carefully!)

### All Tests Fail After Checkout

**Symptom**: Visual tests fail immediately after cloning or switching branches.

**Cause**: Missing baseline screenshots (not committed to repo).

**Solution**:
```bash
# Generate initial baselines
npm run test:visual:update
```

### Tests Pass Locally But Fail in CI

**Symptom**: Visual tests pass on your machine but fail in CI environment.

**Cause**: Different rendering between local system and CI (fonts, GPU, etc.)

**Solutions**:
1. Run tests in Docker container matching CI environment
2. Generate baselines in CI and commit them
3. Increase threshold slightly for CI environment

### Screenshot Comparison Too Strict

**Symptom**: Tests fail frequently due to minor visual differences.

**Solution**: Adjust thresholds in `playwright.config.js`:
```javascript
toHaveScreenshot: {
  maxDiffPixels: 200,        // Increase from 100
  threshold: 0.3,            // Increase from 0.2
}
```

### Screenshot Comparison Too Lenient

**Symptom**: UI bugs slip through visual tests.

**Solution**: Decrease thresholds:
```javascript
toHaveScreenshot: {
  maxDiffPixels: 50,         // Decrease from 100
  threshold: 0.1,            // Decrease from 0.2
}
```

## Best Practices

### When to Update Baselines

**DO update baselines when**:
- You intentionally changed CSS/styling
- You updated component layouts
- You changed colors, fonts, or spacing
- You added/removed UI elements

**DO NOT update baselines when**:
- Tests fail unexpectedly
- You don't understand why a test failed
- You haven't reviewed the visual diff

### Review Process

1. **Run tests**: `npm run test:frontend:visual`
2. **Check failures**: `npm run test:visual:report`
3. **Review diffs**: Look at side-by-side comparison images
4. **Investigate**: Understand WHY the visual changed
5. **Fix or update**: Either fix the bug or update baseline

### Commit Strategy

**Always commit baseline screenshots to git**:
```bash
git add tests/frontend/visual/visual-regression.spec.js-snapshots/
git commit -m "test: update visual regression baselines after header redesign"
```

This ensures all team members and CI use the same baselines.

### Test Design Tips

1. **Use mock data**: Always mock API responses for consistent screenshots
2. **Wait for render**: Use `waitForSelector()` to ensure elements are rendered
3. **Disable animations**: Already configured globally, but be aware
4. **Test key states**: Loading, error, empty, success, hover
5. **Test themes**: Both dark and light mode
6. **Test responsive**: Mobile, tablet, desktop viewports

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Visual Regression Tests
  run: npm run test:frontend:visual

- name: Upload Test Report
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

### Fail on Visual Regressions

Visual tests **BLOCK** PR creation. Any visual regression must be:
1. Reviewed and understood
2. Either fixed (if bug) or approved (if intentional)
3. Baselines updated if approved

## Maintenance

### Regular Maintenance Tasks

1. **Review thresholds quarterly** - Ensure they're still appropriate
2. **Update baselines after major redesigns** - Don't accumulate tiny diffs
3. **Clean up obsolete screenshots** - Remove tests for deleted features
4. **Monitor test execution time** - Visual tests are slower than unit tests

### Adding New Visual Tests

1. Create test in `/home/claude/manager/tests/frontend/visual/visual-regression.spec.js`
2. Follow existing patterns (mock API, wait for render, capture screenshot)
3. Run once to generate baseline: `npm run test:visual:update`
4. Verify baseline looks correct by inspecting the image file
5. Commit baseline to git

Example:
```javascript
test('new feature renders correctly', async ({ page }) => {
  // Mock API response
  await page.route('/api/new-endpoint', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ data: 'test' })
    });
  });

  // Navigate and wait for render
  await page.goto('/new-feature');
  await page.waitForSelector('.new-component', { timeout: 10000 });

  // Capture screenshot
  await expect(page).toHaveScreenshot('new-feature.png', {
    fullPage: true,
    maxDiffPixels: 100
  });
});
```

## Limitations

### What Visual Tests Don't Catch

- **Logic bugs**: Visual tests only check appearance, not behavior
- **Performance issues**: Slow rendering isn't detected
- **Accessibility issues**: Use separate a11y testing tools
- **Cross-browser differences**: Phase 1 only tests Chromium
- **Dynamic content**: Dates, timestamps, random IDs can cause false failures

### Workarounds

- **Dynamic content**: Mock all data sources to return predictable values
- **Timestamps**: Freeze time in tests or use consistent mock dates
- **Random IDs**: Mock ID generation functions
- **External resources**: Mock all external API calls and images

## Integration with Test Workflow

Visual regression tests are part of the standard frontend test suite:

```bash
# Standard workflow
npm run test:frontend          # Runs ALL frontend tests (36 functional + 21 visual = 57 tests)
npm run test:full              # Backend + Frontend (including visual)

# Visual-only workflow
npm run test:frontend:visual   # Only visual regression tests
npm run test:visual:update     # Update baselines after UI changes
npm run test:visual:report     # View results with diff images
```

## Resources

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Pixelmatch Algorithm](https://github.com/mapbox/pixelmatch)
- [Visual Regression Testing Best Practices](https://martinfowler.com/articles/visual-testing.html)

## Support

If you encounter issues with visual regression tests:

1. Check this documentation first
2. Review the test report: `npm run test:visual:report`
3. Inspect baseline images in `tests/frontend/visual/visual-regression.spec.js-snapshots/`
4. Check Playwright configuration in `playwright.config.js`
5. Run with debug flag: `PWDEBUG=1 npm run test:frontend:visual`
