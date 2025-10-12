# TASK-3.5.1: End-to-End Integration Testing

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.5 - Integration & Testing
**Estimated Time:** 45 minutes
**Priority:** High
**Status:** Not Started

## Description

Perform comprehensive end-to-end integration testing of the entire frontend application. Test complete user workflows from dashboard through project detail view, sidebar interactions, and user view. Verify all features work together seamlessly.

## Prerequisites

- ✅ All TASK-3.1.x through TASK-3.4.x completed
- ✅ Backend API endpoints functional
- ✅ Playwright test environment set up

## Acceptance Criteria

1. **Complete User Workflows**
   - [ ] Dashboard → Project Detail → View Agent → Copy/Download
   - [ ] Dashboard → Project Detail → View Command → Sidebar navigation
   - [ ] Dashboard → User View → View User Config
   - [ ] Theme toggle persists across navigation
   - [ ] Search functionality across all views

2. **Cross-Feature Testing**
   - [ ] Warning display on multiple configs
   - [ ] Sidebar works for all config types
   - [ ] Copy/download works from all sources
   - [ ] Browser back/forward navigation
   - [ ] Keyboard navigation throughout app

3. **Error Scenarios**
   - [ ] Project not found
   - [ ] API endpoint failures
   - [ ] Network errors
   - [ ] Empty configuration states

## Implementation Notes

### Comprehensive Test Suite

**Test File:** `tests/frontend/integration.spec.js`

```javascript
test('Complete workflow: Dashboard to Project Detail to Sidebar', async ({ page }) => {
    // Start on dashboard
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');

    // Select first project
    const projectName = await page.locator('.project-card .project-name').first().textContent();
    await page.locator('.project-card').first().click();

    // Verify navigated to detail view
    await expect(page).toHaveURL(/project-detail\.html\?id=/);
    await page.waitForSelector('.config-cards-container');

    // Verify project name in breadcrumb
    await expect(page.locator('.breadcrumb-item.active')).toContainText(projectName);

    // Open agents card
    await page.waitForSelector('#agents-card .config-item');
    const agentName = await page.locator('#agents-card .item-name').first().textContent();
    await page.locator('#agents-card .btn-view-details').first().click();

    // Verify sidebar opened with agent details
    await expect(page.locator('.detail-sidebar')).toBeVisible();
    await expect(page.locator('.sidebar-title h3')).toContainText(agentName);

    // Copy content
    await page.locator('.sidebar-footer button:has-text("Copy All")').click();
    await expect(page.locator('.toast-notification')).toBeVisible();

    // Close sidebar
    await page.locator('.btn-close-sidebar').click();
    await expect(page.locator('.detail-sidebar')).not.toBeVisible();

    // Navigate back to dashboard
    await page.locator('.breadcrumb-item.clickable').click();
    await expect(page).toHaveURL('http://localhost:8420/');
});

test('User view workflow', async ({ page }) => {
    // Go to dashboard
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.btn-user');

    // Navigate to user view
    await page.locator('.btn-user').click();
    await expect(page).toHaveURL('http://localhost:8420/user-view.html');

    // Verify user view loaded
    await expect(page.locator('.user-info-bar')).toBeVisible();
    await expect(page.locator('.project-title')).toHaveText('User Configurations');

    // Verify all cards present
    const cardCount = await page.locator('.config-card').count();
    expect(cardCount).toBe(4);

    // If user has configs, test sidebar
    const hasUserConfigs = await page.locator('.config-item').count() > 0;
    if (hasUserConfigs) {
        await page.locator('.btn-view-details').first().click();
        await expect(page.locator('.detail-sidebar')).toBeVisible();
    }
});

test('Theme toggle persists across navigation', async ({ page }) => {
    // Start on dashboard in dark mode
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.theme-toggle');

    // Verify dark mode
    let theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');

    // Toggle to light mode
    await page.locator('.theme-toggle').click();
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');

    // Navigate to project detail
    await page.locator('.project-card').first().click();
    await page.waitForSelector('.config-cards-container');

    // Verify light mode persisted
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');

    // Navigate to user view
    await page.locator('.btn-user').click();
    await page.waitForSelector('.user-info-bar');

    // Verify light mode still persisted
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');
});

test('Browser back/forward navigation', async ({ page }) => {
    // Navigate through app
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('.config-cards-container');

    // Go back
    await page.goBack();
    await expect(page).toHaveURL('http://localhost:8420/');

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/project-detail\.html\?id=/);

    // Navigate to user view
    await page.locator('.btn-user').click();
    await page.waitForSelector('.user-info-bar');

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/project-detail\.html\?id=/);
});

test('Keyboard navigation throughout app', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');

    // Tab through dashboard
    await page.keyboard.press('Tab'); // Search input
    await page.keyboard.press('Tab'); // Theme toggle
    await page.keyboard.press('Tab'); // First project card

    // Enter to navigate
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/project-detail\.html/);

    // Tab to Dashboard breadcrumb
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('http://localhost:8420/');
});

test('Error handling: API failure', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/projects/*', route => route.abort());

    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('.config-cards-container');

    // Verify error handling (should show empty states or error messages)
    // This depends on implementation - adjust accordingly
});

test('Warning banner displays correctly', async ({ page }) => {
    // This test assumes backend returns warnings for some project
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('.config-cards-container');

    // Check if warning banner appears (if backend returns warnings)
    const hasWarnings = await page.locator('.warning-banner').isVisible();
    if (hasWarnings) {
        await expect(page.locator('.warning-banner')).toContainText('Configuration Warnings');

        // Close warning
        await page.locator('.btn-close-warning').click();
        await expect(page.locator('.warning-banner')).not.toBeVisible();
    }
});

test('Search functionality across config types', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('.config-cards-container');

    // Test search (if implemented)
    await page.locator('.header-search input').fill('test');

    // Verify filtering (implementation dependent)
    // This test structure depends on whether search is implemented
});

test('All config types work in sidebar', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('.config-cards-container');

    // Test agent
    const hasAgents = await page.locator('#agents-card .config-item').count() > 0;
    if (hasAgents) {
        await page.locator('#agents-card .btn-view-details').first().click();
        await expect(page.locator('.detail-sidebar')).toBeVisible();
        await page.keyboard.press('Escape');
    }

    // Test command
    const hasCommands = await page.locator('#commands-card .config-item').count() > 0;
    if (hasCommands) {
        await page.locator('#commands-card .btn-view-details').first().click();
        await expect(page.locator('.detail-sidebar')).toBeVisible();
        await page.keyboard.press('Escape');
    }

    // Test hook
    const hasHooks = await page.locator('#hooks-card .config-item').count() > 0;
    if (hasHooks) {
        await page.locator('#hooks-card .btn-view-details').first().click();
        await expect(page.locator('.detail-sidebar')).toBeVisible();
        await page.keyboard.press('Escape');
    }

    // Test MCP
    const hasMcp = await page.locator('#mcp-card .config-item').count() > 0;
    if (hasMcp) {
        await page.locator('#mcp-card .btn-view-details').first().click();
        await expect(page.locator('.detail-sidebar')).toBeVisible();
        await page.keyboard.press('Escape');
    }
});
```

## Testing Checklist

### Manual Testing
- [ ] Complete workflow from dashboard to sidebar works
- [ ] User view workflow complete
- [ ] Theme toggle persists
- [ ] Browser back/forward work
- [ ] Keyboard navigation throughout
- [ ] All sidebar features work for all config types
- [ ] Copy/download work from all sources
- [ ] Warning display works
- [ ] Error states display appropriately

### Automated Testing
- [ ] All Playwright tests pass
- [ ] No console errors during tests
- [ ] Tests cover happy path and error scenarios
- [ ] Test coverage includes all major features

## Files to Create

- `tests/frontend/integration.spec.js` - Comprehensive integration tests

## Files to Modify

None (pure testing)

## Success Indicators

1. All integration tests pass
2. Complete user workflows functional
3. No console errors in any scenario
4. Error handling graceful
5. Features work together seamlessly

## Related Tickets

**Depends On:**
- All TASK-3.1.x through TASK-3.4.x

**Epic:**
- EPIC-3: Frontend Development

## Notes

### Test Execution

```bash
# Run integration tests
npm run test:frontend -- tests/frontend/integration.spec.js

# Run all frontend tests
npm run test:frontend

# Run with UI
npm run test:frontend -- --ui
```

### Test Data Requirements

Ensure test environment has:
- At least one project configured
- Projects with various config types
- Some projects with warnings
- Empty/missing config scenarios

**Wireframe Reference:** All wireframes should be validated through these tests
