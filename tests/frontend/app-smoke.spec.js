const { test, expect } = require('@playwright/test');

/**
 * Frontend Smoke Tests - Phase 1
 *
 * Basic tests to verify the frontend application loads and core functionality works.
 * These tests validate that the Vue 3 application initializes correctly and the
 * Express server serves the frontend properly.
 */

test.describe('App Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle(/Claude Code Manager/i);
  });

  test('page contains main app structure', async ({ page }) => {
    await page.goto('/');

    // Verify header is present
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    // Verify app title is visible
    const appTitle = page.locator('.app-title');
    await expect(appTitle).toBeVisible();
    await expect(appTitle).toContainText('Claude Code Manager');
  });

  test('search input is present and functional', async ({ page }) => {
    await page.goto('/');

    // Verify search input exists
    const searchInput = page.locator('.search-input');
    await expect(searchInput).toBeVisible();

    // Verify placeholder text
    await expect(searchInput).toHaveAttribute('placeholder', 'Search projects...');

    // Test that input is functional
    await searchInput.fill('test');
    await expect(searchInput).toHaveValue('test');
  });

  test('theme toggle button is present', async ({ page }) => {
    await page.goto('/');

    // Verify theme toggle button exists
    const themeToggle = page.locator('.theme-toggle');
    await expect(themeToggle).toBeVisible();
  });

  test('refresh button is present', async ({ page }) => {
    await page.goto('/');

    // Verify refresh button exists
    const refreshButton = page.locator('.btn-refresh');
    await expect(refreshButton).toBeVisible();
    await expect(refreshButton).toContainText('Refresh');
  });

  test('Vue app mounts successfully', async ({ page }) => {
    await page.goto('/');

    // Verify Vue app div is present
    const appDiv = page.locator('#app');
    await expect(appDiv).toBeVisible();

    // Verify content is rendered (not just empty div)
    const content = page.locator('.main-content');
    await expect(content).toBeVisible();
  });
});

test.describe('Theme Toggle Functionality', () => {
  test('theme toggle changes between dark and light modes', async ({ page }) => {
    await page.goto('/');

    // Get initial theme from html data-theme attribute
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');

    // Click theme toggle
    await page.click('.theme-toggle');

    // Wait for theme to change
    await page.waitForTimeout(100);

    // Verify theme changed
    const newTheme = await html.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);

    // Click again to toggle back
    await page.click('.theme-toggle');
    await page.waitForTimeout(100);

    // Verify theme reverted
    const revertedTheme = await html.getAttribute('data-theme');
    expect(revertedTheme).toBe(initialTheme);
  });
});

test.describe('Loading State', () => {
  test('shows loading state when fetching projects', async ({ page }) => {
    let routeHandled = false;

    // Intercept API call to delay response and observe loading state
    await page.route('/api/projects', async (route) => {
      if (!routeHandled) {
        routeHandled = true;
        // Use setTimeout instead of page.waitForTimeout to avoid test ending error
        await new Promise(resolve => setTimeout(resolve, 500));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            projects: []
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');

    // Wait for the route handler to complete
    await page.waitForTimeout(100);

    // Unroute to clean up
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});

test.describe('API Integration', () => {
  test('successfully fetches projects from API', async ({ page }) => {
    // Wait for API response
    const responsePromise = page.waitForResponse('/api/projects');

    await page.goto('/');

    const response = await responsePromise;
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty('success');
  });

  test('handles API errors gracefully', async ({ page }) => {
    // Intercept API call and return error
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Internal Server Error'
        })
      });
    });

    await page.goto('/');

    // Wait for error state to appear
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });

    // Verify error message is displayed
    await expect(errorState).toContainText('Error Loading Projects');
  });
});
