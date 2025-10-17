const { test, expect } = require('@playwright/test');

/**
 * Visual Regression Tests - Comprehensive UI Screenshot Comparison
 *
 * Uses Playwright's built-in screenshot comparison to detect unintended visual changes.
 * Baseline screenshots are stored in tests/frontend/visual/*.spec.js-snapshots/
 *
 * To update baselines after intentional UI changes:
 *   npx playwright test --update-snapshots visual-regression.spec.js
 */

test.describe('Visual Regression - Dashboard', () => {
  test('dashboard renders correctly with projects', async ({ page }) => {
    // Mock API response with project data
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'testproject1',
              name: 'Test Project 1',
              path: '/home/user/test-project-1',
              stats: {
                agents: 3,
                commands: 5,
                hooks: 2,
                mcp: 1
              }
            },
            {
              id: 'testproject2',
              name: 'Test Project 2',
              path: '/home/user/test-project-2',
              stats: {
                agents: 1,
                commands: 8,
                hooks: 0,
                mcp: 2
              }
            }
          ]
        })
      });
    });

    await page.goto('/');

    // Wait for projects to load
    await page.waitForSelector('.project-card', { timeout: 10000 });

    // Take full page screenshot
    await expect(page).toHaveScreenshot('dashboard-with-projects.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('dashboard loading state', async ({ page }) => {
    // Delay API response to capture loading state
    await page.route('/api/projects', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: []
        })
      });
    });

    await page.goto('/');

    // Wait for loading state to appear
    await page.waitForSelector('.loading-state', { timeout: 2000 });

    // Capture loading state screenshot
    await expect(page).toHaveScreenshot('dashboard-loading-state.png', {
      fullPage: true,
      maxDiffPixels: 50
    });

    // Clean up route
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('dashboard error state', async ({ page }) => {
    // Mock API error
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

    // Wait for error state
    await page.waitForSelector('.error-state', { timeout: 10000 });

    // Capture error state screenshot
    await expect(page).toHaveScreenshot('dashboard-error-state.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('dashboard empty state', async ({ page }) => {
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

    // Wait for empty state
    await page.waitForSelector('.empty-state', { timeout: 10000 });

    // Capture empty state screenshot
    await expect(page).toHaveScreenshot('dashboard-empty-state.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });
});

test.describe('Visual Regression - Dashboard Dark/Light Mode', () => {
  test('dashboard in dark mode', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'darkproject',
              name: 'Dark Mode Project',
              path: '/home/user/dark-project',
              stats: { agents: 2, commands: 3, hooks: 1, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/');
    await page.waitForSelector('.project-card', { timeout: 10000 });

    // Ensure dark mode is active
    const html = page.locator('html');
    const theme = await html.getAttribute('data-theme');
    if (theme !== 'dark') {
      await page.click('.theme-toggle');
      await page.waitForTimeout(200);
    }

    // Capture dark mode screenshot
    await expect(page).toHaveScreenshot('dashboard-dark-mode.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('dashboard in light mode', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'lightproject',
              name: 'Light Mode Project',
              path: '/home/user/light-project',
              stats: { agents: 2, commands: 3, hooks: 1, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/');
    await page.waitForSelector('.project-card', { timeout: 10000 });

    // Switch to light mode
    const html = page.locator('html');
    const theme = await html.getAttribute('data-theme');
    if (theme !== 'light') {
      await page.click('.theme-toggle');
      await page.waitForTimeout(200);
    }

    // Capture light mode screenshot
    await expect(page).toHaveScreenshot('dashboard-light-mode.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });
});

test.describe('Visual Regression - Project Detail View', () => {
  test('project detail view renders correctly', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'detailproject',
              name: 'Detail View Project',
              path: '/home/user/detail-project',
              stats: {
                agents: 5,
                commands: 12,
                hooks: 3,
                mcp: 2
              }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=detailproject');
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Capture full project detail page
    await expect(page).toHaveScreenshot('project-detail-view.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('project detail view with warnings', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'warningproject',
              name: 'Warning Project',
              path: '/home/user/warning-project',
              stats: { agents: 2, commands: 3, hooks: 1, mcp: 0 }
            }
          ],
          warnings: [
            'Warning 1: Could not parse agent file',
            'Warning 2: Missing settings.json',
            'Warning 3: Malformed MCP configuration'
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=warningproject');
    await page.waitForSelector('.warning-banner', { timeout: 10000 });

    // Capture project detail with warnings
    await expect(page).toHaveScreenshot('project-detail-with-warnings.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('project detail loading state', async ({ page }) => {
    await page.route('/api/projects', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'loadingproject',
              name: 'Loading Project',
              path: '/home/user/loading',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=loadingproject');
    await page.waitForSelector('.loading-state', { timeout: 2000 });

    // Capture loading state
    await expect(page).toHaveScreenshot('project-detail-loading.png', {
      fullPage: true,
      maxDiffPixels: 50
    });

    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('project detail error state', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'existingproject',
              name: 'Existing Project',
              path: '/home/user/existing',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    // Navigate to non-existent project
    await page.goto('/project-detail.html?id=nonexistent');
    await page.waitForSelector('.error-state', { timeout: 10000 });

    // Capture error state
    await expect(page).toHaveScreenshot('project-detail-error.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });
});

test.describe('Visual Regression - Dashboard Components', () => {
  test('project card component', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'cardproject',
              name: 'Card Component Test',
              path: '/home/user/card-test',
              stats: {
                agents: 7,
                commands: 14,
                hooks: 5,
                mcp: 3
              }
            }
          ]
        })
      });
    });

    await page.goto('/');
    await page.waitForSelector('.project-card', { timeout: 10000 });

    // Capture just the project card
    const projectCard = page.locator('.project-card').first();
    await expect(projectCard).toHaveScreenshot('project-card-component.png', {
      maxDiffPixels: 50
    });
  });

  test('header component', async ({ page }) => {
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
    await page.waitForSelector('.app-header', { timeout: 10000 });

    // Capture header component
    const header = page.locator('.app-header');
    await expect(header).toHaveScreenshot('header-component.png', {
      maxDiffPixels: 50
    });
  });

  test('breadcrumb component on detail page', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'breadcrumbtest',
              name: 'Breadcrumb Test Project',
              path: '/home/user/breadcrumb-test',
              stats: { agents: 1, commands: 1, hooks: 1, mcp: 1 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=breadcrumbtest');
    await page.waitForSelector('.breadcrumbs', { timeout: 10000 });

    // Capture breadcrumb component
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toHaveScreenshot('breadcrumb-component.png', {
      maxDiffPixels: 50
    });
  });
});

test.describe('Visual Regression - Responsive Design', () => {
  test('dashboard mobile viewport', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'mobileproject',
              name: 'Mobile Test',
              path: '/home/user/mobile',
              stats: { agents: 2, commands: 3, hooks: 1, mcp: 0 }
            }
          ]
        })
      });
    });

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('.project-card', { timeout: 10000 });

    // Capture mobile view
    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('dashboard tablet viewport', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'tabletproject',
              name: 'Tablet Test',
              path: '/home/user/tablet',
              stats: { agents: 3, commands: 5, hooks: 2, mcp: 1 }
            }
          ]
        })
      });
    });

    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForSelector('.project-card', { timeout: 10000 });

    // Capture tablet view
    await expect(page).toHaveScreenshot('dashboard-tablet.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('project detail mobile viewport', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'detailmobile',
              name: 'Detail Mobile Test',
              path: '/home/user/detail-mobile',
              stats: { agents: 4, commands: 6, hooks: 2, mcp: 1 }
            }
          ]
        })
      });
    });

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/project-detail.html?id=detailmobile');
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Capture mobile detail view
    await expect(page).toHaveScreenshot('project-detail-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });
});

test.describe('Visual Regression - Interactive States', () => {
  test('project card hover state', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'hoverproject',
              name: 'Hover Test Project',
              path: '/home/user/hover-test',
              stats: { agents: 2, commands: 3, hooks: 1, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/');
    await page.waitForSelector('.project-card', { timeout: 10000 });

    // Hover over project card
    const projectCard = page.locator('.project-card').first();
    await projectCard.hover();
    await page.waitForTimeout(200); // Wait for hover transition

    // Capture hover state
    await expect(projectCard).toHaveScreenshot('project-card-hover.png', {
      maxDiffPixels: 50
    });
  });

  test('theme toggle button states', async ({ page }) => {
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
    await page.waitForSelector('.theme-toggle', { timeout: 10000 });

    // Hover over theme toggle
    const themeToggle = page.locator('.theme-toggle');
    await themeToggle.hover();
    await page.waitForTimeout(200);

    // Capture hover state
    await expect(themeToggle).toHaveScreenshot('theme-toggle-hover.png', {
      maxDiffPixels: 30
    });
  });

  test('breadcrumb hover state', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'breadcrumbhover',
              name: 'Breadcrumb Hover Test',
              path: '/home/user/breadcrumb-hover',
              stats: { agents: 1, commands: 1, hooks: 1, mcp: 1 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=breadcrumbhover');
    await page.waitForSelector('.breadcrumb-item.clickable', { timeout: 10000 });

    // Hover over dashboard breadcrumb
    const breadcrumb = page.locator('.breadcrumb-item.clickable');
    await breadcrumb.hover();
    await page.waitForTimeout(200);

    // Capture hover state
    await expect(breadcrumb).toHaveScreenshot('breadcrumb-hover.png', {
      maxDiffPixels: 30
    });
  });
});
