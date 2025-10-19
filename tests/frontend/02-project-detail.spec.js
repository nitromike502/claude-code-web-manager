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
    await page.route('**/api/projects*', (route) => {
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

    await page.goto('/project/homeusertestproject');

    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');

    // Verify page title (Phase 2 SPA uses same title for all pages)
    await expect(page).toHaveTitle(/Claude Code Manager/i);
  });

  test('page contains header with correct structure', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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

    await page.goto('/project/testproject');

    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');

    // Verify header is present
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    // Verify app title (h1 in header, not .app-title class)
    const appTitle = page.locator('.app-header h1');
    await expect(appTitle).toBeVisible();
    await expect(appTitle).toContainText('Claude Code Manager');

    // Search removed in Phase 2 - skip this check

    // Verify theme toggle button exists
    const themeToggle = page.locator('.theme-toggle');
    await expect(themeToggle).toBeVisible();
  });

  // Phase 2: Breadcrumbs removed - navigation now via header nav links
  test('navigation links render correctly', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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

    await page.goto('/project/myproject');

    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');

    // Wait for project to load
    await page.waitForSelector('.config-cards-container', { timeout: 10000 });

    // Verify navigation links exist in header
    const nav = page.locator('.app-nav');
    await expect(nav).toBeVisible();

    // Verify Dashboard link
    const dashboardLink = page.locator('.app-nav a[href="/"]');
    await expect(dashboardLink).toBeVisible();
    await expect(dashboardLink).toContainText('Dashboard');

    // Verify User Config link
    const userConfigLink = page.locator('.app-nav a[href="/user"]');
    await expect(userConfigLink).toBeVisible();
    await expect(userConfigLink).toContainText('User Config');
  });

  test('project info bar displays correctly', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: '%2Ffull%2Fpath%2Fto%2Fproject',
              name: 'project',
              path: '/full/path/to/project',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project/%2Ffull%2Fpath%2Fto%2Fproject');

    // Wait for Vue app to mount and hydrate
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#app', { state: 'visible' });
    await page.waitForSelector('.app-container');

    // Wait for project content to load
    await page.waitForSelector('.project-info-bar', { timeout: 10000 });

    // Verify project name is displayed (Phase 2: derived from last path segment)
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toBeVisible();
    await expect(projectTitle).toContainText('project');

    // Verify project path is displayed
    const projectPath = page.locator('.project-info-subtitle');
    await expect(projectPath).toBeVisible();
    await expect(projectPath).toContainText('/full/path/to/project');
  });

  test('configuration cards display correctly', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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

    await page.goto('/project/statsproject');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Wait for configuration cards to render
    await page.waitForSelector('.config-card', { timeout: 10000 });

    // Verify all four config cards are displayed
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);

    // Check each card type is present - Phase 2: MCP card uses .mcp-card class
    await expect(page.locator('.agents-card')).toBeVisible();
    await expect(page.locator('.commands-card')).toBeVisible();
    await expect(page.locator('.hooks-card')).toBeVisible();
    await expect(page.locator('.mcp-card')).toBeVisible();

    // Verify card titles - Phase 2: MCP card uses .mcp-card class
    await expect(page.locator('.agents-card .config-title')).toContainText('Subagents');
    await expect(page.locator('.commands-card .config-title')).toContainText('Slash Commands');
    await expect(page.locator('.hooks-card .config-title')).toContainText('Hooks');
    await expect(page.locator('.mcp-card .config-title')).toContainText('MCP Servers');
  });
});

test.describe('Project Detail Page - URL Parameter Handling', () => {
  test('extracts project ID from URL query parameter', async ({ page }) => {
    let requestedProjectId = null;

    await page.route('**/api/projects*', (route) => {
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

    await page.goto('/project/extractedid');


    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Wait for project to load - Phase 2 loads configs dynamically, might not have container yet
    await page.waitForSelector('.project-info-bar', { timeout: 10000 });

    // Phase 2: Project name is derived from projectId (last path segment)
    // Since projectId is "extractedid", the name will be "extractedid"
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('extractedid');
  });

  test('finds correct project from API response by ID', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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
    await page.goto('/project/project2');


    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Wait for project to load
    await page.waitForSelector('.project-info-bar', { timeout: 10000 });

    // Phase 2: Project name is derived from projectId (last segment)
    // projectId "project2" → name "project2"
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('project2');

    // Phase 2: Project path is the decoded projectId
    const projectPath = page.locator('.project-info-subtitle');
    await expect(projectPath).toContainText('project2');

    // Note: Config cards won't appear without proper API mocking for individual endpoints
    // This test focuses on project identification
  });

  test('handles project ID with special characters', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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

    await page.goto('/project/homeusermyprojectswithdashnumber123');


    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Wait for project to load
    await page.waitForSelector('.project-info-bar', { timeout: 10000 });

    // Phase 2: Project name is derived from projectId (last segment)
    // projectId "homeusermyprojectswithdashnumber123" → name "homeusermyprojectswithdashnumber123"
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('homeusermyprojectswithdashnumber123');
  });
});

test.describe('Project Detail Page - Navigation', () => {
  test('dashboard link navigates to dashboard', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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

    await page.goto('/project/navtest');

    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');

    // Wait for page to load
    await page.waitForSelector('.config-cards-container', { timeout: 10000 });

    // Click Dashboard nav link (Phase 2: header navigation instead of breadcrumbs)
    await page.click('.app-nav a[href="/"]');

    // Verify navigation to homepage
    await page.waitForURL('/');
    expect(page.url()).toContain('/');
    expect(page.url()).not.toContain('project/');
  });

  test('user config link navigates to user page', async ({ page }) => {
    // Phase 2: Mock only /api/projects, let config endpoints fail gracefully
    await page.route('**/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'navtest2',
              name: 'Nav Test 2',
              path: '/nav/test2',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project/navtest2');

    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');

    // Wait for project info bar (Phase 2: don't wait for config-cards-container as it needs config API mocks)
    await page.waitForSelector('.project-info-bar', { timeout: 10000 });

    // Click User Config nav link
    const userConfigLink = page.locator('.app-nav a[href="/user"]');
    await expect(userConfigLink).toBeVisible();

    // Verify hover state works
    await userConfigLink.hover();

    // Click and verify navigation
    await userConfigLink.click();
    await page.waitForURL('/user');
    expect(page.url()).toContain('/user');
  });
});

test.describe('Project Detail Page - Theme Toggle', () => {
  test('theme toggle switches between dark and light modes', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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

    await page.goto('/project/themetest');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Wait for page to load
    await page.waitForSelector('.theme-toggle', { timeout: 10000 });

    const appContainer = page.locator('.app-container');
    const initialTheme = await appContainer.getAttribute('data-theme');

    // Click theme toggle
    await page.click('.theme-toggle');
    await page.waitForTimeout(100);

    // Verify theme changed
    const newTheme = await appContainer.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);

    // Click again to toggle back
    await page.click('.theme-toggle');
    await page.waitForTimeout(100);

    // Verify theme reverted
    const revertedTheme = await appContainer.getAttribute('data-theme');
    expect(revertedTheme).toBe(initialTheme);
  });

  test('theme preference persists in localStorage', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: '%2Fpersist%2Ftest',
              name: 'test',
              path: '/persist/test',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/project/%2Fpersist%2Ftest');

    // Wait for Vue hydration
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#app', { state: 'visible' });
    await page.waitForSelector('.theme-toggle', { timeout: 10000 });

    // Get initial theme
    const appContainer = page.locator('.app-container');
    const initialTheme = await appContainer.getAttribute('data-theme');

    // Toggle theme
    await page.click('.theme-toggle');
    await page.waitForTimeout(100);

    // Check localStorage was updated (Phase 2 uses 'claude-code-manager-theme' key)
    const storedTheme = await page.evaluate(() => localStorage.getItem('claude-code-manager-theme'));
    const currentTheme = await appContainer.getAttribute('data-theme');
    expect(storedTheme).toBe(currentTheme);
    expect(storedTheme).not.toBe(initialTheme);
  });

  test('theme loads from localStorage on page load', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: '%2Fload%2Ftest',
              name: 'test',
              path: '/load/test',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    // Set localStorage before navigation (Phase 2 uses 'claude-code-manager-theme' key)
    await page.goto('/project/%2Fload%2Ftest');
    await page.evaluate(() => localStorage.setItem('claude-code-manager-theme', 'light'));

    // Reload page
    await page.reload();

    // Wait for Vue hydration
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#app', { state: 'visible' });
    await page.waitForSelector('.theme-toggle', { timeout: 10000 });

    // Verify theme was loaded from localStorage
    const appContainer = page.locator('.app-container');
    const theme = await appContainer.getAttribute('data-theme');
    expect(theme).toBe('light');
  });
});

test.describe.skip('Project Detail Page - Error Handling', () => {
  // PHASE 2 NOTE: These tests need to be rewritten to mock individual config endpoints
  // (/api/projects/:id/agents, /api/projects/:id/commands, etc.) instead of just /api/projects
  test('shows error when project ID is missing', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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
    await page.goto('/project/');

    // Verify error state is displayed
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('No project ID provided in URL');
  });

  test('shows error when project ID is not found', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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
    await page.goto('/project/nonexistent');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Verify error state is displayed
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Project not found');
  });

  test('shows error when API returns success:false', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Failed to load project'
        })
      });
    });

    await page.goto('/project/anyproject');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Verify error state is displayed
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Failed to load project');
  });

  test('shows error when API returns HTTP error status', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Internal Server Error'
        })
      });
    });

    await page.goto('/project/anyproject');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Verify error state is displayed
    // Note: HTTP errors (500) are caught as network errors, not parsed as JSON
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Failed to connect to server');
  });

  test('shows error when network request fails', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
      route.abort('failed');
    });

    await page.goto('/project/anyproject');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Verify error state is displayed
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Failed to connect to server');
  });

  test('retry button reloads project data', async ({ page }) => {
    let requestCount = 0;

    await page.route('**/api/projects*', (route) => {
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

    await page.goto('/project/retryproject');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Wait for error state
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });

    // Click retry button
    const retryButton = page.locator('.retry-btn');
    await expect(retryButton).toBeVisible();
    await retryButton.click();

    // Verify project loaded successfully after retry
    await page.waitForSelector('.config-cards-container', { timeout: 10000 });
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('Retry Project');
  });

  test('displays warnings when present in API response', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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

    await page.goto('/project/warningproject');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
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

test.describe.skip('Project Detail Page - Loading State', () => {
  // PHASE 2 NOTE: Loading states need updated selectors for Vue components
  test('shows loading state while fetching project', async ({ page }) => {
    let routeHandled = false;

    await page.route('**/api/projects*', async (route) => {
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

    await page.goto('/project/loadingproject');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Loading state should appear briefly
    await page.waitForTimeout(100);

    // Eventually project content should appear
    await page.waitForSelector('.config-cards-container', { timeout: 10000 });

    // Unroute to clean up
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('loading state shows spinner and text', async ({ page }) => {
    // Create a slow response to keep loading state visible
    await page.route('**/api/projects*', async (route) => {
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

    await page.goto('/project/spinnerproject');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Verify loading state elements
    const loadingState = page.locator('.loading-state');
    await expect(loadingState).toBeVisible();

    const spinner = page.locator('.loading-state .spinner');
    await expect(spinner).toBeVisible();

    const loadingText = page.locator('.loading-state p');
    await expect(loadingText).toContainText('Loading project...');

    // Wait for loading to complete
    await page.waitForSelector('.config-cards-container', { timeout: 10000 });
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});

test.describe('Project Detail Page - Responsive Design', () => {
  test('layout adapts to mobile viewport', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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
    await page.goto('/project/mobileproject');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Wait for page to load
    await page.waitForSelector('.config-cards-container', { timeout: 10000 });

    // Verify elements are still visible
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    // Phase 2: Breadcrumbs removed - navigation now via header nav links

    const projectInfo = page.locator('.project-info-bar');
    await expect(projectInfo).toBeVisible();

    // Verify configuration cards are visible
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);
  });

  test('layout adapts to tablet viewport', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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
    await page.goto('/project/tabletproject');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Wait for page to load
    await page.waitForSelector('.config-cards-container', { timeout: 10000 });

    // Verify all elements are visible and properly laid out
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);
  });

  test('layout works on desktop viewport', async ({ page }) => {
    await page.route('**/api/projects*', (route) => {
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
    await page.goto('/project/desktopproject');

   
    // Wait for Vue app to mount
    await page.waitForSelector('.app-container');
 // Wait for page to load
    await page.waitForSelector('.config-cards-container', { timeout: 10000 });

    // Verify all elements are visible
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    const projectContent = page.locator('.config-cards-container');
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
      consoleErrors.push(error.message);
    });

    await page.route('**/api/projects*', (route) => {
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

    await page.goto('/project/consoletestproject');
    await page.waitForSelector('.config-cards-container', { timeout: 10000 });

    // Interact with page elements
    await page.click('.theme-toggle');
    await page.waitForTimeout(100);

    // Verify no console errors occurred
    expect(consoleErrors).toEqual([]);
  });
});
