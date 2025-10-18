const { test, expect } = require('@playwright/test');

test.describe('Vue Router Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start dev server if not running, then navigate to app
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  });

  test('should load Dashboard on root path', async ({ page }) => {
    await expect(page).toHaveTitle(/Claude|Dashboard/);
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  });

  test('should navigate to Dashboard without full page reload', async ({ page }) => {
    // Check initial load
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();

    // Listen for page load events - router-link should NOT trigger page reload
    let pageLoadCount = 0;
    page.on('load', () => pageLoadCount++);

    // Click User Config link first
    await page.click('a[href="/user"]');
    await page.waitForSelector('h1:has-text("User/Global Configuration")');

    // Click back to Dashboard - should NOT cause page reload
    const initialPageLoads = pageLoadCount;
    await page.click('a[href="/"]');
    await page.waitForSelector('h1:has-text("Dashboard")');

    // Verify no additional page loads occurred
    expect(pageLoadCount).toBe(initialPageLoads);
  });

  test('should navigate to UserGlobal view', async ({ page }) => {
    await page.click('a[href="/user"]');
    await page.waitForSelector('h1:has-text("User/Global Configuration")');
    await expect(page).toHaveURL(/\/user/);
  });

  test('should navigate to ProjectDetail with route params', async ({ page }) => {
    // Navigate directly to project detail
    await page.goto('http://localhost:5173/project/test-project-123');
    await page.waitForSelector('h1:has-text("Project Detail")');
    await expect(page.locator('p:has-text("test-project-123")')).toBeVisible();
  });

  test('should update URL when navigating via router-link', async ({ page }) => {
    // Start at dashboard
    expect(page.url()).toContain('/');

    // Click User Config link
    await page.click('a[href="/user"]');
    await page.waitForSelector('h1:has-text("User/Global Configuration")');
    expect(page.url()).toContain('/user');

    // Click back to Dashboard
    await page.click('a[href="/"]');
    await page.waitForSelector('h1:has-text("Dashboard")');
    expect(page.url()).not.toContain('/user');
  });

  test('should support browser back button', async ({ page }) => {
    // Navigate through multiple routes
    await page.click('a[href="/user"]');
    await page.waitForSelector('h1:has-text("User/Global Configuration")');

    // Use browser back button
    await page.goBack();
    await page.waitForSelector('h1:has-text("Dashboard")');

    // Verify URL reflects back navigation
    expect(page.url()).not.toContain('/user');
  });

  test('should not have console errors during navigation', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate multiple times
    await page.click('a[href="/user"]');
    await page.waitForSelector('h1:has-text("User/Global Configuration")');

    await page.click('a[href="/"]');
    await page.waitForSelector('h1:has-text("Dashboard")');

    // Verify no errors were logged
    expect(consoleErrors).toHaveLength(0);
  });
});
