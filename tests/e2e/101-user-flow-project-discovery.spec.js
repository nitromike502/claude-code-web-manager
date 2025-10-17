const { test, expect } = require('@playwright/test');

/**
 * End-to-End Flow Test: First-Time User - Project Discovery
 *
 * This test simulates a complete user journey from opening the application
 * for the first time through discovering projects and viewing their details.
 *
 * User Journey:
 * 1. User opens the application (may see empty state or project list)
 * 2. Application loads projects from ~/.claude.json
 * 3. User sees project cards with statistics
 * 4. User clicks on a project card
 * 5. Detail view loads with all configuration information
 * 6. User navigates back to the dashboard
 */

test.describe('E2E Flow: First-Time User - Project Discovery', () => {
  test('complete project discovery journey from dashboard to detail and back', async ({ page }) => {
    // Setup API mocks for consistent test data
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'homeuserprojectsmyapp',
              name: 'My App',
              path: '/home/user/projects/my-app',
              stats: {
                agents: 3,
                commands: 8,
                hooks: 2,
                mcp: 1
              }
            },
            {
              id: 'homeuserprojectsanotherapp',
              name: 'Another App',
              path: '/home/user/projects/another-app',
              stats: {
                agents: 1,
                commands: 4,
                hooks: 0,
                mcp: 0
              }
            }
          ]
        })
      });
    });

    // STEP 1: User opens application
    await page.goto('/');

    // Verify page loaded successfully
    await expect(page).toHaveTitle(/Claude Code Manager/i);
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    // STEP 2: Verify projects loaded from API
    // Wait for loading state to complete
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // STEP 3: User sees project cards with statistics
    // Note: Dashboard shows User card (index 0) + project cards (index 1+)
    const projectCards = page.locator('.project-card');
    expect(await projectCards.count()).toBe(3); // User card + 2 projects

    // Verify first PROJECT card displays correctly (skip User card at index 0)
    const firstProject = projectCards.nth(1);
    await expect(firstProject.locator('.project-name')).toContainText('My App');
    await expect(firstProject.locator('.project-path')).toContainText('/home/user/projects/my-app');

    // Verify statistics are displayed
    await expect(firstProject.locator('.stat-agents')).toContainText('3 Agents');
    await expect(firstProject.locator('.stat-commands')).toContainText('8 Commands');
    await expect(firstProject.locator('.stat-hooks')).toContainText('2 Hooks');
    await expect(firstProject.locator('.stat-mcp')).toContainText('1 MCP');

    // STEP 4: User clicks on a project
    await firstProject.click();

    // STEP 5: Detail view loads with configuration information
    await page.waitForURL(/project-detail\.html\?id=homeuserprojectsmyapp/);

    // Verify we're on the detail page
    await expect(page).toHaveTitle(/Project Detail/i);

    // Verify project information loaded
    await page.waitForSelector('.project-content', { timeout: 10000 });

    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toBeVisible();
    await expect(projectTitle).toContainText('My App');

    const projectPath = page.locator('.project-info-subtitle');
    await expect(projectPath).toContainText('/home/user/projects/my-app');

    // Verify breadcrumbs show navigation path
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs.locator('.breadcrumb-item.clickable')).toContainText('Dashboard');
    await expect(breadcrumbs.locator('.breadcrumb-item.active')).toContainText('My App');

    // Verify configuration cards are visible
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);

    // Verify all card types are present
    await expect(page.locator('.agent-card')).toBeVisible();
    await expect(page.locator('.command-card')).toBeVisible();
    await expect(page.locator('.hook-card')).toBeVisible();
    await expect(page.locator('.mcp-card')).toBeVisible();

    // STEP 6: User navigates back to dashboard
    const dashboardBreadcrumb = page.locator('.breadcrumb-item.clickable');
    await dashboardBreadcrumb.click();

    // Verify we're back on the dashboard
    await page.waitForURL('/');
    await expect(page).toHaveTitle(/Claude Code Manager/i);

    // Verify project cards are still visible (User card + project cards)
    await page.waitForSelector('.project-grid', { timeout: 5000 });
    const projectCardsAfterReturn = page.locator('.project-card');
    expect(await projectCardsAfterReturn.count()).toBe(3); // User card + 2 projects
  });

  test('project discovery with empty state', async ({ page }) => {
    // Mock empty projects response
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: []
        })
      });
    });

    await page.goto('/');

    // Verify empty state is displayed
    const emptyState = page.locator('.empty-state');
    await expect(emptyState).toBeVisible({ timeout: 10000 });
    await expect(emptyState).toContainText('No projects found');
    await expect(emptyState).toContainText('Click Refresh to scan for projects');
  });

  test('project discovery with API errors shows helpful message', async ({ page }) => {
    // Mock API error
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Failed to read ~/.claude.json'
        })
      });
    });

    await page.goto('/');

    // Verify error state is displayed
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Error Loading Projects');

    // Verify retry button is available
    const retryButton = page.locator('.btn-retry');
    await expect(retryButton).toBeVisible();
  });

  test('loading state displays while fetching projects', async ({ page }) => {
    let requestCount = 0;

    await page.route('/api/projects', async (route) => {
      requestCount++;
      // Add delay to observe loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'testproject',
              name: 'Test Project',
              path: '/test/project',
              stats: { agents: 1, commands: 1, hooks: 1, mcp: 1 }
            }
          ]
        })
      });
    });

    await page.goto('/');

    // Loading state should appear briefly
    const loadingState = page.locator('.loading-state');
    await expect(loadingState).toBeVisible({ timeout: 500 });
    await expect(loadingState).toContainText('Loading projects...');

    // Eventually projects should load
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Loading state should be hidden
    await expect(loadingState).not.toBeVisible();

    // Clean up
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('performance: dashboard loads in under 2 seconds', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: Array.from({ length: 10 }, (_, i) => ({
            id: `project${i}`,
            name: `Project ${i}`,
            path: `/path/to/project${i}`,
            stats: { agents: i, commands: i * 2, hooks: i % 3, mcp: i % 2 }
          }))
        })
      });
    });

    const startTime = Date.now();
    await page.goto('/');

    // Wait for content to be fully loaded
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    const loadTime = Date.now() - startTime;

    // Assert load time is under 2 seconds (2000ms)
    expect(loadTime).toBeLessThan(2000);

    // Verify all projects rendered (User card + 10 projects = 11 total)
    const projectCards = page.locator('.project-card');
    expect(await projectCards.count()).toBe(11);
  });

  test('no console errors during project discovery flow', async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        // Filter out expected errors from mocks/route handling
        const text = msg.text();
        if (!text.includes('Failed to load resource') &&
            !text.includes('HTTP error! status:') &&
            !text.includes('Error loading agents:') &&
            !text.includes('Error loading commands:') &&
            !text.includes('Error loading hooks:') &&
            !text.includes('Error loading MCP servers:') &&
            !text.includes('net::ERR') &&
            !text.includes('favicon')) {
          consoleErrors.push(text);
        }
      }
    });

    // Listen for page errors
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'cleanproject',
              name: 'Clean Project',
              path: '/clean/project',
              stats: { agents: 1, commands: 1, hooks: 1, mcp: 1 }
            }
          ]
        })
      });
    });

    // Execute full flow
    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Click actual project card (not User card at index 0)
    const projectCard = page.locator('.project-card').nth(1);
    await projectCard.click();

    await page.waitForURL(/project-detail\.html/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    await page.click('.breadcrumb-item.clickable');
    await page.waitForURL('/');

    // Verify no errors occurred
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
});
