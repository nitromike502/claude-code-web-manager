const { test, expect } = require('@playwright/test');

/**
 * End-to-End Flow Test: Error Handling
 *
 * This test validates that the application handles errors gracefully and
 * allows users to continue working despite encountering issues.
 *
 * User Journey:
 * 1. User encounters API errors
 * 2. Application shows clear error messages
 * 3. User can retry failed operations
 * 4. Application handles missing project directories
 * 5. Application shows warnings for malformed config files
 * 6. User can continue working despite warnings
 */

test.describe('E2E Flow: Error Handling', () => {
  test('user recovers from API failure using retry button', async ({ page }) => {
    let requestCount = 0;

    await page.route('/api/projects', (route) => {
      requestCount++;
      if (requestCount === 1) {
        // First request fails
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Database connection failed'
          })
        });
      } else {
        // Subsequent requests succeed
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            projects: [
              {
                id: 'recoveredproject',
                name: 'Recovered Project',
                path: '/recovered/project',
                stats: { agents: 1, commands: 1, hooks: 1, mcp: 1 }
              }
            ]
          })
        });
      }
    });

    // STEP 1: User encounters error on initial load
    await page.goto('/');

    // STEP 2: Application shows clear error message
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Error Loading Projects');

    // Verify error icon is visible
    await expect(errorState.locator('.fa-exclamation-triangle')).toBeVisible();

    // STEP 3: User clicks retry button
    const retryButton = page.locator('.btn-retry');
    await expect(retryButton).toBeVisible();
    await retryButton.click();

    // STEP 4: Application recovers and shows projects
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Verify error is gone
    await expect(errorState).not.toBeVisible();

    // Verify projects loaded (User card + 1 project = 2 total)
    const projectCards = page.locator('.project-card');
    expect(await projectCards.count()).toBe(2);
    await expect(projectCards.nth(1)).toContainText('Recovered Project'); // Skip User card at index 0
  });

  test('user navigates through application with warnings present', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'warningproject',
              name: 'Project With Warnings',
              path: '/warning/project',
              stats: { agents: 2, commands: 3, hooks: 1, mcp: 0 }
            }
          ],
          warnings: [
            'Warning: Could not parse /warning/project/.claude/agents/broken.md - Invalid YAML frontmatter',
            'Warning: Skipped malformed command file at /warning/project/.claude/commands/bad.md'
          ]
        })
      });
    });

    // STEP 1: Load dashboard with warnings
    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Dashboard should work normally despite warnings
    const projectCards = page.locator('.project-card');
    await expect(projectCards.first()).toBeVisible();

    // STEP 2: Navigate to project detail (nth(1) skips User card)
    await projectCards.nth(1).click();
    await page.waitForURL(/project-detail\.html/);

    // STEP 3: Warnings should be displayed
    const warningBanner = page.locator('.warning-banner');
    await expect(warningBanner).toBeVisible({ timeout: 10000 });

    // Verify warning count
    const warningHeader = page.locator('.warning-header');
    await expect(warningHeader).toContainText('2 Warnings');

    // Verify warning messages are displayed
    const warningList = page.locator('.warning-list li');
    expect(await warningList.count()).toBe(2);
    await expect(warningList.nth(0)).toContainText('Could not parse');
    await expect(warningList.nth(1)).toContainText('Skipped malformed');

    // STEP 4: User can still view project information
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('Project With Warnings');

    // Configuration cards should still be visible
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);

    // STEP 5: User can navigate back to dashboard
    await page.click('.breadcrumb-item.clickable');
    await page.waitForURL('/');

    // Dashboard still works
    await expect(projectCards.first()).toBeVisible();
  });

  test('missing project ID shows helpful error message', async ({ page }) => {
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

    // Navigate to detail page without ID parameter
    await page.goto('/project-detail.html');

    // Verify error state
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('No project ID provided in URL');

    // Verify error icon
    await expect(errorState.locator('.fa-exclamation-triangle')).toBeVisible();
  });

  test('non-existent project ID shows not found error', async ({ page }) => {
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
              path: '/existing',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    // Navigate with non-existent ID
    await page.goto('/project-detail.html?id=nonexistent');

    // Verify error state
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Project not found');
  });

  test('network failure shows connection error with retry option', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.abort('failed');
    });

    await page.goto('/');

    // Verify connection error (actual message is "Failed to fetch")
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Failed to fetch');

    // Verify retry button is available
    const retryButton = page.locator('.btn-retry');
    await expect(retryButton).toBeVisible();
  });

  test('API returns malformed JSON shows error', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'This is not valid JSON{]'
      });
    });

    await page.goto('/');

    // Should show error state
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
  });

  test('project detail retry button works after error', async ({ page }) => {
    let requestCount = 0;

    await page.route('/api/projects', (route) => {
      requestCount++;
      if (requestCount === 1) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Server error'
          })
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            projects: [
              {
                id: 'retryproject',
                name: 'Retry Project',
                path: '/retry',
                stats: { agents: 1, commands: 2, hooks: 3, mcp: 4 }
              }
            ]
          })
        });
      }
    });

    // Navigate to detail page
    await page.goto('/project-detail.html?id=retryproject');

    // Error should appear
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });

    // Click retry
    const retryButton = page.locator('.btn-retry');
    await retryButton.click();

    // Project should load
    await page.waitForSelector('.project-content', { timeout: 10000 });
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('Retry Project');

    // Verify configuration cards loaded
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);
    await expect(page.locator('.agent-card')).toBeVisible();
    await expect(page.locator('.command-card')).toBeVisible();
    await expect(page.locator('.hook-card')).toBeVisible();
    await expect(page.locator('.mcp-card')).toBeVisible();
  });

  test('multiple consecutive errors can be retried', async ({ page }) => {
    let requestCount = 0;

    await page.route('/api/projects', (route) => {
      requestCount++;
      if (requestCount <= 2) {
        // First two requests fail
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: `Error attempt ${requestCount}`
          })
        });
      } else {
        // Third request succeeds
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            projects: [
              {
                id: 'persistentproject',
                name: 'Persistent Project',
                path: '/persistent',
                stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
              }
            ]
          })
        });
      }
    });

    await page.goto('/');

    // First error
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });

    // Retry - still fails
    await page.click('.btn-retry');
    await page.waitForTimeout(500);
    await expect(errorState).toBeVisible();

    // Retry again - succeeds
    await page.click('.btn-retry');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Verify projects loaded (nth(1) skips User card)
    const projectCard = page.locator('.project-card').nth(1);
    await expect(projectCard).toBeVisible();
    await expect(projectCard).toContainText('Persistent Project');
  });

  test('error state does not break theme toggle', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Server error'
        })
      });
    });

    await page.goto('/');

    // Wait for error state
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });

    // Theme toggle should still work
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');

    await page.click('.theme-toggle');
    await page.waitForTimeout(100);

    const newTheme = await html.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('no console errors during error scenarios', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        // Filter out expected error logging from the app itself
        const text = msg.text();
        if (!text.includes('Failed to load resource') &&
            !text.includes('HTTP error! status:') &&
            !text.includes('net::') &&
            !text.includes('Error loading projects:') &&
            !text.includes('Error loading project:') &&
            !text.includes('favicon')) {
          consoleErrors.push(text);
        }
      }
    });

    // Test various error scenarios
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Test error'
        })
      });
    });

    await page.goto('/');
    await page.waitForSelector('.error-state', { timeout: 10000 });

    await page.goto('/project-detail.html?id=missing');
    await page.waitForSelector('.error-state', { timeout: 10000 });

    // Verify no unexpected console errors
    expect(consoleErrors).toEqual([]);
  });

  test('loading state transitions smoothly to error state', async ({ page }) => {
    await page.route('/api/projects', async (route) => {
      // Delay to observe loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Delayed error'
        })
      });
    });

    await page.goto('/');

    // Loading state should appear first
    const loadingState = page.locator('.loading-state');
    await expect(loadingState).toBeVisible({ timeout: 1000 });

    // Then error state should appear
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });

    // Loading state should be hidden
    await expect(loadingState).not.toBeVisible();

    // Clean up route
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});
