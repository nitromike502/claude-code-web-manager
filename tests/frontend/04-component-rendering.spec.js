const { test, expect } = require('@playwright/test');

/**
 * Frontend Component Tests: 04-Component Rendering
 *
 * Test Suites:
 * - 04.001: Dashboard Component
 * - 04.002: ProjectDetail Component
 * - 04.003: UserGlobal Component
 * - 04.004: Navigation and Back Button
 * - 04.005: Console Errors
 *
 * Numbering Format: 04.GROUP.TEST
 *
 * Comprehensive tests for all Vue SFC components:
 * - Dashboard.vue
 * - ProjectDetail.vue
 * - UserGlobal.vue
 *
 * Tests cover:
 * - Component rendering and API integration
 * - Navigation between views
 * - Interactive features (sidebar, expand, copy)
 * - No console errors
 */

// Test Suite 04.001: Dashboard Component
test.describe('04.001: Dashboard Component', () => {
  test('04.001.001: dashboard page loads and displays projects', async ({ page }) => {
    await page.goto('/');

    // Wait for projects to load
    await page.waitForSelector('.dashboard', { timeout: 10000 });

    // Verify header is present
    const header = page.locator('.dashboard-header h2');
    await expect(header).toBeVisible();
    await expect(header).toContainText('Projects');

    // Verify sort dropdown is present
    const sortDropdown = page.locator('.sort-dropdown');
    await expect(sortDropdown).toBeVisible();

    // Verify rescan button is present
    const rescanBtn = page.locator('.rescan-btn');
    await expect(rescanBtn).toBeVisible();

    // Check that either projects or empty state is shown
    const projectCards = page.locator('.project-card');
    const emptyState = page.locator('.empty-state');
    const loadingState = page.locator('.loading-container');

    // Wait for loading to complete
    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    // Should have either projects or empty state
    const hasProjects = await projectCards.count() > 0;
    const hasEmpty = await emptyState.isVisible().catch(() => false);

    expect(hasProjects || hasEmpty).toBeTruthy();
  });

  test('04.001.002: can click on a project and navigate to ProjectDetail', async ({ page }) => {
    await page.goto('/');

    // Wait for projects to load
    await page.waitForSelector('.dashboard', { timeout: 10000 });

    // Wait for loading to complete
    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    // Check if any projects exist
    const projectCards = page.locator('.project-card:not(.user-card)');
    const count = await projectCards.count();

    if (count > 0) {
      // Click on first project
      await projectCards.first().click();

      // Wait for navigation to project detail
      await page.waitForURL(/\/project\//, { timeout: 10000 });

      // Verify project detail page loaded
      const projectDetail = page.locator('.project-detail');
      await expect(projectDetail).toBeVisible();

      // Verify project info bar is present
      const projectInfo = page.locator('.project-info-bar');
      await expect(projectInfo).toBeVisible();
    } else {
      console.log('Skipping navigation test - no projects available');
    }
  });

  test('04.001.003: user card navigates to UserGlobal view', async ({ page }) => {
    await page.goto('/');

    // Wait for projects to load
    await page.waitForSelector('.dashboard', { timeout: 10000 });

    // Wait for loading to complete
    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    // Look for user card
    const userCard = page.locator('.project-card.user-card');
    const hasUserCard = await userCard.count() > 0;

    if (hasUserCard) {
      // Click on user card
      await userCard.first().click();

      // Wait for navigation to user view
      await page.waitForURL(/\/user/, { timeout: 10000 });

      // Verify user global page loaded
      const userGlobal = page.locator('.user-global');
      await expect(userGlobal).toBeVisible();

      // Verify user info bar is present
      const userInfo = page.locator('.user-info-bar');
      await expect(userInfo).toBeVisible();
      await expect(userInfo).toContainText('User Configurations');
    } else {
      console.log('Skipping user navigation test - no user card available');
    }
  });
});

// Test Suite 04.002: ProjectDetail Component
test.describe('04.002: ProjectDetail Component', () => {
  test('04.002.001: ProjectDetail loads all configuration cards', async ({ page }) => {
    // Navigate to a project detail page
    await page.goto('/');
    await page.waitForSelector('.dashboard', { timeout: 10000 });

    // Wait for loading to complete
    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    const projectCards = page.locator('.project-card:not(.user-card)');
    const count = await projectCards.count();

    if (count > 0) {
      await projectCards.first().click();
      await page.waitForURL(/\/project\//, { timeout: 10000 });

      // Wait for config cards container
      await page.waitForSelector('.config-cards-container', { timeout: 10000 });

      // Verify all 4 config cards are present
      const agentsCard = page.locator('.agents-card');
      const commandsCard = page.locator('.commands-card');
      const hooksCard = page.locator('.hooks-card');
      const mcpCard = page.locator('.mcp-card');

      await expect(agentsCard).toBeVisible();
      await expect(commandsCard).toBeVisible();
      await expect(hooksCard).toBeVisible();
      await expect(mcpCard).toBeVisible();

      // Verify card titles
      await expect(agentsCard.locator('.config-title')).toContainText('Subagents');
      await expect(commandsCard.locator('.config-title')).toContainText('Slash Commands');
      await expect(hooksCard.locator('.config-title')).toContainText('Hooks');
      await expect(mcpCard.locator('.config-title')).toContainText('MCP Servers');
    } else {
      console.log('Skipping ProjectDetail test - no projects available');
    }
  });

  test('04.002.002: can select items and view in sidebar', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.dashboard', { timeout: 10000 });

    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    const projectCards = page.locator('.project-card:not(.user-card)');
    const count = await projectCards.count();

    if (count > 0) {
      await projectCards.first().click();
      await page.waitForURL(/\/project\//, { timeout: 10000 });
      await page.waitForSelector('.config-cards-container', { timeout: 10000 });

      // Try to find a config item to click
      const configItem = page.locator('.config-item').first();
      const hasItems = await configItem.count() > 0;

      if (hasItems) {
        await configItem.click();

        // Verify sidebar opens
        const sidebar = page.locator('.sidebar');
        await expect(sidebar).toBeVisible({ timeout: 5000 });

        // Verify sidebar header
        const sidebarHeader = page.locator('.sidebar-header-title');
        await expect(sidebarHeader).toBeVisible();

        // Verify navigation buttons
        const prevBtn = page.locator('.nav-btn').first();
        const nextBtn = page.locator('.nav-btn').nth(1);
        const closeBtn = page.locator('.close-btn');

        await expect(prevBtn).toBeVisible();
        await expect(nextBtn).toBeVisible();
        await expect(closeBtn).toBeVisible();

        // Close sidebar
        await closeBtn.click();
        await expect(sidebar).not.toBeVisible();
      } else {
        console.log('Skipping sidebar test - no config items available');
      }
    } else {
      console.log('Skipping sidebar test - no projects available');
    }
  });

  test('04.002.004: show more/less functionality works', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.dashboard', { timeout: 10000 });

    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    const projectCards = page.locator('.project-card:not(.user-card)');
    const count = await projectCards.count();

    if (count > 0) {
      await projectCards.first().click();
      await page.waitForURL(/\/project\//, { timeout: 10000 });
      await page.waitForSelector('.config-cards-container', { timeout: 10000 });

      // Look for an expand button
      const expandBtn = page.locator('.expand-btn').first();
      const hasExpandBtn = await expandBtn.count() > 0;

      if (hasExpandBtn) {
        // Get initial item count
        const cardWithExpand = expandBtn.locator('xpath=ancestor::div[contains(@class, "config-card")]');
        const initialItemCount = await cardWithExpand.locator('.config-item').count();

        // Click expand
        await expandBtn.click();
        await page.waitForTimeout(300);

        // Get new item count
        const expandedItemCount = await cardWithExpand.locator('.config-item').count();

        // Should have more items now
        expect(expandedItemCount).toBeGreaterThanOrEqual(initialItemCount);

        // Button text should change to "Show Less"
        await expect(expandBtn).toContainText('Show Less');

        // Click again to collapse
        await expandBtn.click();
        await page.waitForTimeout(300);

        // Should show fewer items again
        const collapsedItemCount = await cardWithExpand.locator('.config-item').count();
        expect(collapsedItemCount).toBeLessThanOrEqual(expandedItemCount);
      } else {
        console.log('Skipping expand test - no expand buttons available');
      }
    } else {
      console.log('Skipping expand test - no projects available');
    }
  });
});

// Test Suite 04.003: UserGlobal Component
test.describe('04.003: UserGlobal Component', () => {
  test('04.003.001: UserGlobal page loads user-level configurations', async ({ page }) => {
    await page.goto('/user');

    // Wait for user global container
    await page.waitForSelector('.user-global', { timeout: 10000 });

    // Verify user info bar
    const userInfo = page.locator('.user-info-bar');
    await expect(userInfo).toBeVisible();
    await expect(userInfo).toContainText('User Configurations');

    // Wait for loading to complete
    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    // Verify all 4 config cards are present
    const agentsCard = page.locator('.agents-card');
    const commandsCard = page.locator('.commands-card');
    const hooksCard = page.locator('.hooks-card');
    const mcpCard = page.locator('.mcp-card');

    await expect(agentsCard).toBeVisible();
    await expect(commandsCard).toBeVisible();
    await expect(hooksCard).toBeVisible();
    await expect(mcpCard).toBeVisible();
  });

  test('04.003.002: UserGlobal sidebar functionality works', async ({ page }) => {
    await page.goto('/user');
    await page.waitForSelector('.user-global', { timeout: 10000 });

    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    // Try to find a config item
    const configItem = page.locator('.config-item').first();
    const hasItems = await configItem.count() > 0;

    if (hasItems) {
      await configItem.click();

      // Verify sidebar opens
      const sidebar = page.locator('.sidebar');
      await expect(sidebar).toBeVisible({ timeout: 5000 });

      // Verify close button works
      const closeBtn = page.locator('.close-btn');
      await closeBtn.click();
      await expect(sidebar).not.toBeVisible();
    } else {
      console.log('Skipping UserGlobal sidebar test - no user config items available');
    }
  });
});

// Test Suite 04.004: Navigation and Back Button
test.describe('04.004: Navigation and Back Button', () => {
  test('04.004.001: navigation between Dashboard, ProjectDetail, and UserGlobal works', async ({ page }) => {
    // Start at dashboard
    await page.goto('/');
    await page.waitForSelector('.dashboard', { timeout: 10000 });

    // Wait for loading
    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    // Navigate to user view
    const userCard = page.locator('.project-card.user-card');
    const hasUserCard = await userCard.count() > 0;

    if (hasUserCard) {
      await userCard.first().click();
      await page.waitForURL(/\/user/, { timeout: 10000 });
      await expect(page.locator('.user-global')).toBeVisible();

      // Go back to dashboard
      await page.goBack();
      await page.waitForURL('/', { timeout: 10000 });
      await expect(page.locator('.dashboard')).toBeVisible();

      // Navigate to project detail
      const projectCards = page.locator('.project-card:not(.user-card)');
      const hasProjects = await projectCards.count() > 0;

      if (hasProjects) {
        await projectCards.first().click();
        await page.waitForURL(/\/project\//, { timeout: 10000 });
        await expect(page.locator('.project-detail')).toBeVisible();

        // Go back to dashboard
        await page.goBack();
        await page.waitForURL('/', { timeout: 10000 });
        await expect(page.locator('.dashboard')).toBeVisible();
      }
    } else {
      console.log('Skipping navigation test - no user card available');
    }
  });

  test('04.004.002: back button navigation works correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.dashboard', { timeout: 10000 });

    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    const projectCards = page.locator('.project-card:not(.user-card)');
    const count = await projectCards.count();

    if (count > 0) {
      // Click project
      await projectCards.first().click();
      await page.waitForURL(/\/project\//, { timeout: 10000 });

      // Verify we're on project detail
      await expect(page.locator('.project-detail')).toBeVisible();

      // Click browser back button
      await page.goBack();
      await page.waitForURL('/', { timeout: 10000 });

      // Verify we're back on dashboard
      await expect(page.locator('.dashboard')).toBeVisible();
    } else {
      console.log('Skipping back button test - no projects available');
    }
  });
});

// Test Suite 04.005: Console Errors
test.describe('04.005: Console Errors', () => {
  test('04.005.001: no console errors during dashboard load', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForSelector('.dashboard', { timeout: 10000 });

    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    // Allow some time for any async errors
    await page.waitForTimeout(1000);

    // Filter out known benign errors (if any)
    const realErrors = consoleErrors.filter(error => {
      // Filter out any expected/benign errors here if needed
      return !error.includes('favicon.ico');
    });

    expect(realErrors).toHaveLength(0);
  });

  test('04.005.002: no console errors during project navigation', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForSelector('.dashboard', { timeout: 10000 });

    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    const projectCards = page.locator('.project-card:not(.user-card)');
    const count = await projectCards.count();

    if (count > 0) {
      await projectCards.first().click();
      await page.waitForURL(/\/project\//, { timeout: 10000 });
      await page.waitForSelector('.config-cards-container', { timeout: 10000 });

      // Allow some time for any async errors
      await page.waitForTimeout(1000);

      const realErrors = consoleErrors.filter(error => {
        return !error.includes('favicon.ico');
      });

      expect(realErrors).toHaveLength(0);
    } else {
      console.log('Skipping console error test - no projects available');
    }
  });

  test('04.005.003: no console errors during user view load', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/user');
    await page.waitForSelector('.user-global', { timeout: 10000 });

    await page.waitForFunction(() => {
      const loading = document.querySelector('.loading-container');
      return !loading || loading.offsetParent === null;
    }, { timeout: 10000 });

    // Allow some time for any async errors
    await page.waitForTimeout(1000);

    const realErrors = consoleErrors.filter(error => {
      return !error.includes('favicon.ico');
    });

    expect(realErrors).toHaveLength(0);
  });
});
