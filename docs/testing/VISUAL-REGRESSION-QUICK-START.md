# Visual Regression Testing - Quick Start Guide

## What is Visual Regression Testing?

Visual regression testing automatically detects unintended visual changes in your UI by comparing screenshots. Think of it as automated quality assurance for the visual appearance of your application.

## Quick Commands

```bash
# Run only visual regression tests (19 tests, ~10 seconds)
npm run test:frontend:visual

# Update baselines after intentional UI changes
npm run test:visual:update

# View detailed test report with diff images
npm run test:visual:report
```

## Common Scenarios

### 1. You Changed CSS/Styling Intentionally

**Situation**: You updated button colors, spacing, or layout.

**Steps**:
1. Make your CSS changes
2. Run: `npm run test:visual:update`
3. Review the updated baseline images
4. Commit baselines to git: `git add tests/frontend/visual/visual-regression.spec.js-snapshots/`

### 2. Visual Tests Failed Unexpectedly

**Situation**: Tests fail and you didn't change any UI code.

**Steps**:
1. Run: `npm run test:visual:report`
2. Review the diff images (shows expected vs actual)
3. Investigate what caused the visual change
4. Fix the bug
5. Re-run: `npm run test:frontend:visual`

### 3. Adding New Visual Tests

**Situation**: You built a new UI component and want to test it.

**Steps**:
1. Edit: `/home/claude/manager/tests/frontend/visual/visual-regression.spec.js`
2. Add your test (copy existing pattern)
3. Generate baseline: `npm run test:visual:update`
4. Verify baseline looks correct (inspect PNG file)
5. Commit test + baseline to git

## Test Coverage (19 Tests)

- **Dashboard views**: With projects, loading, error, empty states
- **Dark/Light mode**: Both themes tested
- **Project detail**: Standard, with warnings, loading, error states
- **Components**: Project cards, header, breadcrumbs
- **Responsive**: Mobile (375px), tablet (768px), desktop
- **Interactive states**: Hover effects on buttons and cards

## Configuration

Visual test thresholds are in `/home/claude/manager/playwright.config.js`:

```javascript
maxDiffPixels: 100        // Max 100 pixels can differ
maxDiffPixelRatio: 0.002  // Max 0.2% of image can differ
threshold: 0.2            // 20% color variance allowed
```

**When to adjust**:
- Tests fail frequently for minor differences → increase thresholds
- UI bugs slip through → decrease thresholds

## Troubleshooting

### "Screenshot comparison failed: 45 pixels differ"

**Cause**: Font rendering, anti-aliasing, or minor visual changes.

**Fix**:
1. View diff: `npm run test:visual:report`
2. If expected, update baseline: `npm run test:visual:update`
3. If bug, investigate and fix

### "A snapshot doesn't exist at..."

**Cause**: First time running test or baseline deleted.

**Fix**: Run `npm run test:visual:update` to generate baseline.

### Tests pass locally but fail in CI

**Cause**: Different rendering environment (fonts, GPU).

**Fix**: Generate baselines in CI environment or use Docker for consistency.

## Best Practices

1. **Always commit baselines to git** - Team needs same reference images
2. **Review diffs before updating** - Don't blindly update baselines
3. **Mock all dynamic data** - Dates, IDs, random content causes false failures
4. **Test key UI states** - Loading, error, empty, success
5. **Keep tests fast** - Visual tests run in ~10 seconds, don't add delays

## Integration with Workflow

Visual regression tests are part of the frontend test suite:

```bash
npm run test:frontend          # Component + E2E + Visual (55 tests)
npm run test:frontend:visual   # Only visual (19 tests)
npm run test:full             # Backend + Frontend (all tests)
```

**Workflow requirement**: All tests (including visual) must pass before PR creation.

## Baseline Location

Baselines stored in:
```
/home/claude/manager/tests/frontend/visual/visual-regression.spec.js-snapshots/chromium/
```

Contains:
- `dashboard-with-projects-chromium-linux.png`
- `dashboard-dark-mode-chromium-linux.png`
- `project-detail-view-chromium-linux.png`
- ... (19 total baseline images)

## Need More Details?

See comprehensive guide: `/home/claude/manager/docs/testing/VISUAL-REGRESSION-TESTING.md`
