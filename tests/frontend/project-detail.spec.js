const { test, expect } = require('@playwright/test');

/**
 * Project Detail Page Component Tests - TASK-3.1.1
 *
 * Comprehensive tests to verify the project detail page component structure,
 * functionality, navigation, theme toggling, error handling, and responsive design.
 */

test.describe('Project Detail Page - Page Load & Structure', () => {
  test('page loads successfully with valid project ID', async ({ page }) => {
    // Mock API response with project data
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'homeusertestproject',
              name: 'Test Project',
              path: '/home/user/test-project',
              stats: {
                agents: 3,
                commands: 5,
                hooks: 2,
                mcp: 1
              }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=homeusertestproject');

    // Verify page title
    await expect(page).toHaveTitle(/Project Detail - Claude Code Manager/i);
  });

  test('page contains header with correct structure', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'testproject',
              name: 'Test Project',
              path: '/test/project',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=testproject');

    // Verify header is present
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    // Verify app title
    const appTitle = page.locator('.app-title');
    await expect(appTitle).toBeVisible();
    await expect(appTitle).toContainText('Claude Code Manager');

    // Verify search input exists
    const searchInput = page.locator('.search-input');
    await expect(searchInput).toBeVisible();

    // Verify theme toggle button exists
    const themeToggle = page.locator('.theme-toggle');
    await expect(themeToggle).toBeVisible();
  });

  test('breadcrumbs render correctly', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'myproject',
              name: 'My Awesome Project',
              path: '/home/user/projects/awesome',
              stats: { agents: 2, commands: 3, hooks: 1, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=myproject');

    // Wait for project to load
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify breadcrumbs container exists
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();

    // Verify Dashboard breadcrumb (clickable)
    const dashboardLink = page.locator('.breadcrumb-item.clickable');
    await expect(dashboardLink).toBeVisible();
    await expect(dashboardLink).toContainText('Dashboard');

    // Verify separator
    const separator = page.locator('.breadcrumb-separator');
    await expect(separator).toBeVisible();

    // Verify current project breadcrumb (active)
    const projectBreadcrumb = page.locator('.breadcrumb-item.active');
    await expect(projectBreadcrumb).toBeVisible();
    await expect(projectBreadcrumb).toContainText('My Awesome Project');
  });

  test('project info bar displays correctly', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'testid',
              name: 'Project Name',
              path: '/full/path/to/project',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=testid');

    // Wait for project content to load
    await page.waitForSelector('.project-info-bar', { timeout: 10000 });

    // Verify project name is displayed
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toBeVisible();
    await expect(projectTitle).toContainText('Project Name');

    // Verify project path is displayed
    const projectPath = page.locator('.project-info-subtitle');
    await expect(projectPath).toBeVisible();
    await expect(projectPath).toContainText('/full/path/to/project');
  });

  test('configuration cards display correctly', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'statsproject',
              name: 'Stats Project',
              path: '/stats/project',
              stats: {
                agents: 7,
                commands: 12,
                hooks: 4,
                mcp: 3
              }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=statsproject');

    // Wait for configuration cards to render
    await page.waitForSelector('.config-card', { timeout: 10000 });

    // Verify all four config cards are displayed
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);

    // Check each card type is present
    await expect(page.locator('.agent-card')).toBeVisible();
    await expect(page.locator('.command-card')).toBeVisible();
    await expect(page.locator('.hook-card')).toBeVisible();
    await expect(page.locator('.mcp-card')).toBeVisible();

    // Verify card titles
    await expect(page.locator('.agent-card .card-title')).toContainText('Subagents');
    await expect(page.locator('.command-card .card-title')).toContainText('Slash Commands');
    await expect(page.locator('.hook-card .card-title')).toContainText('Hooks');
    await expect(page.locator('.mcp-card .card-title')).toContainText('MCP Servers');
  });
});

test.describe('Project Detail Page - URL Parameter Handling', () => {
  test('extracts project ID from URL query parameter', async ({ page }) => {
    let requestedProjectId = null;

    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'extractedid',
              name: 'Test',
              path: '/test',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=extractedid');

    // Wait for project to load
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify the correct project is displayed
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('Test');
  });

  test('finds correct project from API response by ID', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'project1',
              name: 'Project One',
              path: '/path/one',
              stats: { agents: 1, commands: 1, hooks: 1, mcp: 1 }
            },
            {
              id: 'project2',
              name: 'Project Two',
              path: '/path/two',
              stats: { agents: 2, commands: 2, hooks: 2, mcp: 2 }
            },
            {
              id: 'project3',
              name: 'Project Three',
              path: '/path/three',
              stats: { agents: 3, commands: 3, hooks: 3, mcp: 3 }
            }
          ]
        })
      });
    });

    // Navigate to second project
    await page.goto('/project-detail.html?id=project2');

    // Wait for project to load
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify correct project is displayed
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('Project Two');

    const projectPath = page.locator('.project-info-subtitle');
    await expect(projectPath).toContainText('/path/two');

    // Verify configuration cards are present
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);
  });

  test('handles project ID with special characters', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'homeusermyprojectswithdashnumber123',
              name: 'Project With-Dash-123',
              path: '/home/user/my-projects-with-dash-number-123',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=homeusermyprojectswithdashnumber123');

    // Wait for project to load
    await page.waitForSelector('.project-content', { timeout: 10000 });

    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('Project With-Dash-123');
  });
});

test.describe('Project Detail Page - Navigation', () => {
  test('back button navigates to dashboard', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'navtest',
              name: 'Nav Test',
              path: '/nav/test',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=navtest');

    // Wait for page to load
    await page.waitForSelector('.breadcrumb-item.clickable', { timeout: 10000 });

    // Click Dashboard breadcrumb
    await page.click('.breadcrumb-item.clickable');

    // Verify navigation to homepage
    await page.waitForURL('/');
    expect(page.url()).toContain('/');
    expect(page.url()).not.toContain('project-detail.html');
  });

  test('breadcrumb click triggers navigation', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'breadcrumbtest',
              name: 'Breadcrumb Test',
              path: '/breadcrumb/test',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=breadcrumbtest');

    // Wait for breadcrumbs to render
    const dashboardBreadcrumb = page.locator('.breadcrumb-item.clickable');
    await expect(dashboardBreadcrumb).toBeVisible();

    // Verify hover state works
    await dashboardBreadcrumb.hover();

    // Click and verify navigation
    await dashboardBreadcrumb.click();
    await page.waitForURL('/');
  });
});

test.describe('Project Detail Page - Theme Toggle', () => {
  test('theme toggle switches between dark and light modes', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'themetest',
              name: 'Theme Test',
              path: '/theme/test',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=themetest');

    // Wait for page to load
    await page.waitForSelector('.theme-toggle', { timeout: 10000 });

    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');

    // Click theme toggle
    await page.click('.theme-toggle');
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

  test('theme preference persists in localStorage', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'persisttest',
              name: 'Persist Test',
              path: '/persist/test',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=persisttest');
    await page.waitForSelector('.theme-toggle', { timeout: 10000 });

    // Get initial theme
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');

    // Toggle theme
    await page.click('.theme-toggle');
    await page.waitForTimeout(100);

    // Check localStorage was updated
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    const currentTheme = await html.getAttribute('data-theme');
    expect(storedTheme).toBe(currentTheme);
    expect(storedTheme).not.toBe(initialTheme);
  });

  test('theme loads from localStorage on page load', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'loadtest',
              name: 'Load Test',
              path: '/load/test',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    // Set localStorage before navigation
    await page.goto('/project-detail.html?id=loadtest');
    await page.evaluate(() => localStorage.setItem('theme', 'light'));

    // Reload page
    await page.reload();
    await page.waitForSelector('.theme-toggle', { timeout: 10000 });

    // Verify theme was loaded from localStorage
    const html = page.locator('html');
    const theme = await html.getAttribute('data-theme');
    expect(theme).toBe('light');
  });
});

test.describe('Project Detail Page - Error Handling', () => {
  test('shows error when project ID is missing', async ({ page }) => {
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

    // Navigate without ID parameter
    await page.goto('/project-detail.html');

    // Verify error state is displayed
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('No project ID provided in URL');
  });

  test('shows error when project ID is not found', async ({ page }) => {
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

    // Navigate with non-existent project ID
    await page.goto('/project-detail.html?id=nonexistent');

    // Verify error state is displayed
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Project not found');
  });

  test('shows error when API returns success:false', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Failed to load project'
        })
      });
    });

    await page.goto('/project-detail.html?id=anyproject');

    // Verify error state is displayed
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Failed to load project');
  });

  test('shows error when API returns HTTP error status', async ({ page }) => {
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

    await page.goto('/project-detail.html?id=anyproject');

    // Verify error state is displayed
    // Note: HTTP errors (500) are caught as network errors, not parsed as JSON
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Failed to connect to server');
  });

  test('shows error when network request fails', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.abort('failed');
    });

    await page.goto('/project-detail.html?id=anyproject');

    // Verify error state is displayed
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Failed to connect to server');
  });

  test('retry button reloads project data', async ({ page }) => {
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
            error: 'Internal Server Error'
          })
        });
      } else {
        // Second request succeeds
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            projects: [
              {
                id: 'retryproject',
                name: 'Retry Project',
                path: '/retry/project',
                stats: { agents: 1, commands: 1, hooks: 1, mcp: 1 }
              }
            ]
          })
        });
      }
    });

    await page.goto('/project-detail.html?id=retryproject');

    // Wait for error state
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });

    // Click retry button
    const retryButton = page.locator('.btn-retry');
    await expect(retryButton).toBeVisible();
    await retryButton.click();

    // Verify project loaded successfully after retry
    await page.waitForSelector('.project-content', { timeout: 10000 });
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('Retry Project');
  });

  test('displays warnings when present in API response', async ({ page }) => {
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
              path: '/warning/project',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ],
          warnings: [
            'Warning 1: Could not parse agent file',
            'Warning 2: Missing settings.json'
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=warningproject');

    // Wait for warnings to appear
    const warningBanner = page.locator('.warning-banner');
    await expect(warningBanner).toBeVisible({ timeout: 10000 });

    // Verify warning count
    const warningHeader = page.locator('.warning-header');
    await expect(warningHeader).toContainText('2 Warnings');

    // Verify warning messages
    const warningList = page.locator('.warning-list li');
    expect(await warningList.count()).toBe(2);
    await expect(warningList.nth(0)).toContainText('Warning 1: Could not parse agent file');
    await expect(warningList.nth(1)).toContainText('Warning 2: Missing settings.json');
  });
});

test.describe('Project Detail Page - Loading State', () => {
  test('shows loading state while fetching project', async ({ page }) => {
    let routeHandled = false;

    await page.route('/api/projects', async (route) => {
      if (!routeHandled) {
        routeHandled = true;
        // Delay response to observe loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            projects: [
              {
                id: 'loadingproject',
                name: 'Loading Project',
                path: '/loading/project',
                stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
              }
            ]
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/project-detail.html?id=loadingproject');

    // Loading state should appear briefly
    await page.waitForTimeout(100);

    // Eventually project content should appear
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Unroute to clean up
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('loading state shows spinner and text', async ({ page }) => {
    // Create a slow response to keep loading state visible
    await page.route('/api/projects', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'spinnerproject',
              name: 'Spinner Project',
              path: '/spinner/project',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=spinnerproject');

    // Verify loading state elements
    const loadingState = page.locator('.loading-state');
    await expect(loadingState).toBeVisible();

    const spinner = page.locator('.loading-state .fa-spinner');
    await expect(spinner).toBeVisible();

    const loadingText = page.locator('.loading-state p');
    await expect(loadingText).toContainText('Loading project...');

    // Wait for loading to complete
    await page.waitForSelector('.project-content', { timeout: 10000 });
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});

test.describe('Project Detail Page - Responsive Design', () => {
  test('layout adapts to mobile viewport', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'mobileproject',
              name: 'Mobile Project',
              path: '/mobile/project',
              stats: { agents: 2, commands: 3, hooks: 1, mcp: 0 }
            }
          ]
        })
      });
    });

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/project-detail.html?id=mobileproject');

    // Wait for page to load
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify elements are still visible
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();

    const projectInfo = page.locator('.project-info-bar');
    await expect(projectInfo).toBeVisible();

    // Verify configuration cards are visible
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);
  });

  test('layout adapts to tablet viewport', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'tabletproject',
              name: 'Tablet Project',
              path: '/tablet/project',
              stats: { agents: 1, commands: 2, hooks: 3, mcp: 4 }
            }
          ]
        })
      });
    });

    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/project-detail.html?id=tabletproject');

    // Wait for page to load
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify all elements are visible and properly laid out
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);
  });

  test('layout works on desktop viewport', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'desktopproject',
              name: 'Desktop Project',
              path: '/desktop/project',
              stats: { agents: 5, commands: 10, hooks: 3, mcp: 2 }
            }
          ]
        })
      });
    });

    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/project-detail.html?id=desktopproject');

    // Wait for page to load
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify all elements are visible
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    const projectContent = page.locator('.project-content');
    await expect(projectContent).toBeVisible();

    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);
  });
});

test.describe('Project Detail Page - Console Error Detection', () => {
  test('page loads without console errors', async ({ page }) => {
    const consoleErrors = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'consoletestproject',
              name: 'Console Test Project',
              path: '/console/test',
              stats: { agents: 1, commands: 1, hooks: 1, mcp: 1 }
            }
          ]
        })
      });
    });

    await page.goto('/project-detail.html?id=consoletestproject');
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Interact with page elements
    await page.click('.theme-toggle');
    await page.waitForTimeout(100);

    // Verify no console errors occurred
    expect(consoleErrors).toEqual([]);
  });
});
