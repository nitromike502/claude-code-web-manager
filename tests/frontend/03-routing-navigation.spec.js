const { test, expect } = require('@playwright/test');

test.describe('Vue Router Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start dev server if not running, then navigate to app
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  });

  test('should load Dashboard on root path', async ({ page }) => {
    await expect(page).toHaveTitle(/Claude|Dashboard/);
    // Phase 2: Dashboard uses h2 "Projects", not h1 "Dashboard"
    await expect(page.locator('h2:has-text("Projects")')).toBeVisible();
  });

  test('should navigate to Dashboard without full page reload', async ({ page }) => {
    // Check initial load - Phase 2: Dashboard uses h2 "Projects"
    await expect(page.locator('h2:has-text("Projects")')).toBeVisible();

    // Listen for page load events - router-link should NOT trigger page reload
    let pageLoadCount = 0;
    page.on('load', () => pageLoadCount++);

    // Click User Config link first - Phase 2: Uses span "User Configurations"
    await page.click('a[href="/user"]');
    await page.waitForSelector('.user-info-title:has-text("User Configurations")');

    // Click back to Dashboard - should NOT cause page reload
    const initialPageLoads = pageLoadCount;
    await page.click('a[href="/"]');
    await page.waitForSelector('h2:has-text("Projects")');

    // Verify no additional page loads occurred
    expect(pageLoadCount).toBe(initialPageLoads);
  });

  test('should navigate to UserGlobal view', async ({ page }) => {
    await page.click('a[href="/user"]');
    // Phase 2: User page uses span "User Configurations", not h1
    await page.waitForSelector('.user-info-title:has-text("User Configurations")');
    await expect(page).toHaveURL(/\/user/);
  });

  test('should navigate to ProjectDetail with route params', async ({ page }) => {
    // Navigate directly to project detail
    await page.goto('http://localhost:5173/project/test-project-123');
    // Phase 2: Project detail uses .project-info-bar, not h1
    await page.waitForSelector('.project-info-bar');
    // Project name is derived from ID, so we expect to see "test-project-123" in the title
    await expect(page.locator('.project-info-title')).toContainText('test-project-123');
  });

  test('should update URL when navigating via router-link', async ({ page }) => {
    // Start at dashboard
    expect(page.url()).toContain('/');

    // Click User Config link
    await page.click('a[href="/user"]');
    // Phase 2: User page uses span "User Configurations"
    await page.waitForSelector('.user-info-title:has-text("User Configurations")');
    expect(page.url()).toContain('/user');

    // Click back to Dashboard
    await page.click('a[href="/"]');
    // Phase 2: Dashboard uses h2 "Projects"
    await page.waitForSelector('h2:has-text("Projects")');
    expect(page.url()).not.toContain('/user');
  });

  test('should support browser back button', async ({ page }) => {
    // Navigate through multiple routes
    await page.click('a[href="/user"]');
    // Phase 2: User page uses span "User Configurations"
    await page.waitForSelector('.user-info-title:has-text("User Configurations")');

    // Use browser back button
    await page.goBack();
    // Phase 2: Dashboard uses h2 "Projects"
    await page.waitForSelector('h2:has-text("Projects")');

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
    // Phase 2: User page uses span "User Configurations"
    await page.waitForSelector('.user-info-title:has-text("User Configurations")');

    await page.click('a[href="/"]');
    // Phase 2: Dashboard uses h2 "Projects"
    await page.waitForSelector('h2:has-text("Projects")');

    // Verify no errors were logged
    expect(consoleErrors).toHaveLength(0);
  });
});
