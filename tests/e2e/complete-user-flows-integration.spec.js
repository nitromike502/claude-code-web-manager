const { test, expect } = require('@playwright/test');

/**
 * End-to-End Integration Testing - TASK-3.5.1
 *
 * Comprehensive integration tests that verify complete user flows work
 * seamlessly from end to end, testing all interactive features, API
 * integrations, navigation patterns, and error handling scenarios.
 *
 * Test Coverage:
 * 1. Complete User Flows (Dashboard → Project → Sidebar → User View)
 * 2. Interactive Features Integration (Sidebar, Theme Toggle, Copy)
 * 3. API Integration Points (All endpoints, warnings, error states)
 * 4. Cross-View Navigation (Project ↔ User ↔ Dashboard)
 * 5. Error Handling & Recovery (Network failures, invalid data)
 */

test.describe('E2E Integration: Complete User Flows', () => {
  /**
   * FLOW 1: Dashboard → Project Detail → Sidebar → Back
   *
   * This is the primary user journey for viewing project configurations.
   */
  test('user can navigate from dashboard to project and view config details in sidebar', async ({ page }) => {
    // Mock API responses
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'homeuserprojectse2eapp',
              name: 'E2E Test App',
              path: '/home/user/projects/e2e-app',
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

    await page.route('/api/projects/homeuserprojectse2eapp/agents', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          agents: [
            {
              name: 'backend-architect',
              description: 'Specialized in backend API development',
              content: '# Backend Architect\n\nYou are a backend API specialist...',
              filePath: '/home/user/projects/e2e-app/.claude/agents/backend-architect.md'
            }
          ]
        })
      });
    });

    // Mock other configuration endpoints
    ['commands', 'hooks', 'mcp'].forEach(endpoint => {
      page.route(`/api/projects/homeuserprojectse2eapp/${endpoint}`, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            [endpoint === 'mcp' ? 'mcpServers' : endpoint]: []
          })
        });
      });
    });

    // STEP 1: Load dashboard
    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Verify dashboard loaded (first card is User card, second card is actual project)
    const projectCard = page.locator('.project-card').nth(1);
    await expect(projectCard).toBeVisible();
    await expect(projectCard).toContainText('E2E Test App');

    // STEP 2: Click project card to navigate to detail view
    await projectCard.click();
    await page.waitForURL(/project-detail\.html\?id=homeuserprojectse2eapp/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // STEP 3: Verify project detail page loads
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('E2E Test App');

    // Verify all configuration cards are visible
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);

    // STEP 4: Click "View Details" on agent card to open sidebar
    const agentCard = page.locator('.agent-card');
    await expect(agentCard).toBeVisible();

    // Wait for agent data to load
    await page.waitForTimeout(500);

    const viewDetailsButton = agentCard.locator('.btn-view-details').first();
    await expect(viewDetailsButton).toBeVisible();
    await viewDetailsButton.click();

    // STEP 5: Verify sidebar opens with agent content
    const sidebar = page.locator('.detail-sidebar');
    await expect(sidebar).toBeVisible({ timeout: 5000 });

    const sidebarTitle = page.locator('.sidebar-header h2');
    await expect(sidebarTitle).toContainText('backend-architect');

    // Verify content is rendered
    const sidebarContent = page.locator('.sidebar-content');
    await expect(sidebarContent).toBeVisible();

    // STEP 6: Close sidebar
    const closeButton = page.locator('.sidebar-close');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    // Verify sidebar closes
    await expect(sidebar).not.toBeVisible();

    // STEP 7: Navigate back to dashboard
    const dashboardBreadcrumb = page.locator('.breadcrumb-item.clickable');
    await dashboardBreadcrumb.click();
    await page.waitForURL('/');

    // Verify we're back on dashboard
    await expect(projectCard).toBeVisible();
  });

  /**
   * FLOW 2: Dashboard → User View → Sidebar → Back
   *
   * Tests user-level configuration viewing workflow.
   */
  test('user can access user configurations and view details in sidebar', async ({ page }) => {
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

    await page.route('/api/user/agents', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          agents: [
            {
              name: 'global-qa-specialist',
              description: 'Quality assurance expert for all projects',
              content: '# QA Specialist\n\nYou are a QA testing expert...',
              filePath: '~/.claude/agents/qa-specialist.md'
            }
          ]
        })
      });
    });

    await page.route('/api/user/commands', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, commands: [] })
      });
    });

    await page.route('/api/user/hooks', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, hooks: [] })
      });
    });

    await page.route('/api/user/mcp', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, mcpServers: [] })
      });
    });

    // STEP 1: Load dashboard
    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // STEP 2: Click User Configuration card (first card on dashboard)
    const userCard = page.locator('.user-card');
    await expect(userCard).toBeVisible();
    await userCard.click();

    // STEP 3: Verify user view loads
    await page.waitForURL(/user-view\.html/);
    await page.waitForSelector('.user-info-bar', { timeout: 10000 });

    const userTitle = page.locator('.project-info-title');
    await expect(userTitle).toContainText('User Configurations');

    // Verify all configuration cards are present
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);

    // STEP 4: Click "View Details" on user agent
    await page.waitForTimeout(1000); // Wait for agents to load

    const agentCard = page.locator('.agent-card');
    const agentItem = agentCard.locator('.agent-item').first();
    await expect(agentItem).toBeVisible();
    await agentItem.click();

    // STEP 5: Verify sidebar opens with user config
    const sidebar = page.locator('.detail-sidebar');
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    const sidebarTitle = page.locator('.sidebar-header h2');
    await expect(sidebarTitle).toContainText('global-qa-specialist');

    // STEP 6: Close sidebar and navigate back
    const closeButton = page.locator('.btn-close-sidebar');
    await closeButton.click();
    await page.waitForTimeout(300);
    await expect(sidebar).not.toBeVisible();

    // Navigate back to dashboard
    const dashboardBreadcrumb = page.locator('.breadcrumb-item.clickable');
    await dashboardBreadcrumb.click();
    await page.waitForURL('/');
  });

  /**
   * FLOW 3: Project Detail → User View → Project Detail
   *
   * Tests cross-view navigation between project and user configurations.
   */
  test('user can navigate between project and user views seamlessly', async ({ page }) => {
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
              stats: { agents: 1, commands: 1, hooks: 1, mcp: 1 }
            }
          ]
        })
      });
    });

    // Mock user endpoints
    ['agents', 'commands', 'hooks', 'mcp'].forEach(endpoint => {
      page.route(`/api/user/${endpoint}`, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            [endpoint === 'mcp' ? 'mcpServers' : endpoint]: []
          })
        });
      });
    });

    // STEP 1: Load project detail page
    await page.goto('/project-detail.html?id=testproject');
    await page.waitForSelector('.project-content', { timeout: 10000 });

    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('Test Project');

    // STEP 2: Click User button in header
    const userButton = page.locator('.btn-user');
    await userButton.click();

    // STEP 3: Verify user view loads
    await page.waitForURL(/user-view\.html/);
    await page.waitForSelector('.user-info-bar', { timeout: 10000 });

    const userTitle = page.locator('.project-info-title');
    await expect(userTitle).toContainText('User Configurations');

    // STEP 4: Click breadcrumb to return to dashboard
    const dashboardBreadcrumb = page.locator('.breadcrumb-item.clickable');
    await dashboardBreadcrumb.click();
    await page.waitForURL('/');

    // STEP 5: Return to original project (nth(1) since first card is User card)
    const projectCard = page.locator('.project-card').nth(1);
    await projectCard.click();
    await page.waitForURL(/project-detail\.html\?id=testproject/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify we're back on the same project
    await expect(projectTitle).toContainText('Test Project');
  });
});

test.describe('E2E Integration: Interactive Features', () => {
  /**
   * Tests sidebar interactions work across all views
   */
  test('sidebar copy to clipboard functionality works in all contexts', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'copyproject',
              name: 'Copy Test Project',
              path: '/copy/test',
              stats: { agents: 1, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.route('/api/projects/copyproject/agents', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          agents: [
            {
              name: 'test-agent',
              description: 'Test agent for copy functionality',
              content: '# Test Agent Content\n\nThis is test content for clipboard copy.',
              filePath: '/test/agent.md'
            }
          ]
        })
      });
    });

    // Mock other configuration endpoints
    ['commands', 'hooks', 'mcp'].forEach(endpoint => {
      page.route(`/api/projects/copyproject/${endpoint}`, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            [endpoint === 'mcp' ? 'mcpServers' : endpoint]: []
          })
        });
      });
    });

    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    // Navigate to project
    await page.goto('/project-detail.html?id=copyproject');
    await page.waitForSelector('.agent-card', { timeout: 10000 });

    // Wait for agents to load
    await page.waitForTimeout(500);

    // Open sidebar
    const viewDetailsButton = page.locator('.agent-card .btn-view-details').first();
    await viewDetailsButton.click();

    const sidebar = page.locator('.detail-sidebar');
    await expect(sidebar).toBeVisible({ timeout: 5000 });

    // Click copy button
    const copyButton = page.locator('.btn-copy-content');
    await expect(copyButton).toBeVisible();
    await copyButton.click();

    // Verify copy success feedback (button text changes)
    await expect(copyButton).toContainText('Copied!', { timeout: 2000 });

    // Verify clipboard contains content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('Test Agent Content');
  });

  /**
   * Tests theme toggle persists across all navigation
   */
  test('theme toggle persists across all views and page reloads', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'themeproject',
              name: 'Theme Project',
              path: '/theme/test',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    // Mock project configuration endpoints
    ['agents', 'commands', 'hooks', 'mcp'].forEach(endpoint => {
      page.route(`/api/projects/themeproject/${endpoint}`, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            [endpoint === 'mcp' ? 'mcpServers' : endpoint]: []
          })
        });
      });
    });

    // Mock user endpoints
    ['agents', 'commands', 'hooks', 'mcp'].forEach(endpoint => {
      page.route(`/api/user/${endpoint}`, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            [endpoint === 'mcp' ? 'mcpServers' : endpoint]: []
          })
        });
      });
    });

    const html = page.locator('html');

    // STEP 1: Start on dashboard (default dark theme)
    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });
    expect(await html.getAttribute('data-theme')).toBe('dark');

    // STEP 2: Toggle to light theme on dashboard
    await page.click('.theme-toggle');
    await page.waitForTimeout(100);
    expect(await html.getAttribute('data-theme')).toBe('light');

    // STEP 3: Navigate to project detail - theme should persist
    await page.locator('.project-card').nth(1).click();
    await page.waitForURL(/project-detail\.html/);
    await page.waitForSelector('.project-content', { timeout: 10000 });
    expect(await html.getAttribute('data-theme')).toBe('light');

    // STEP 4: Navigate to user view - theme should persist
    await page.click('.btn-user');
    await page.waitForURL(/user-view\.html/);
    await page.waitForSelector('.user-info-bar', { timeout: 10000 });
    expect(await html.getAttribute('data-theme')).toBe('light');

    // STEP 5: Reload page - theme should persist from localStorage
    await page.reload();
    await page.waitForSelector('.user-info-bar', { timeout: 10000 });
    expect(await html.getAttribute('data-theme')).toBe('light');

    // STEP 6: Toggle back to dark theme
    await page.click('.theme-toggle');
    await page.waitForTimeout(100);
    expect(await html.getAttribute('data-theme')).toBe('dark');

    // STEP 7: Navigate back to dashboard - dark theme persists
    await page.click('.breadcrumb-item.clickable');
    await page.waitForURL('/');
    expect(await html.getAttribute('data-theme')).toBe('dark');
  });

  /**
   * Tests sidebar keyboard shortcuts (Escape key to close)
   */
  test('sidebar responds to keyboard shortcuts across all views', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'keyboardproject',
              name: 'Keyboard Test',
              path: '/keyboard/test',
              stats: { agents: 1, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.route('/api/projects/keyboardproject/agents', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          agents: [
            {
              name: 'keyboard-test-agent',
              description: 'Test agent',
              content: 'Test content',
              filePath: '/test.md'
            }
          ]
        })
      });
    });

    // Mock other configuration endpoints
    ['commands', 'hooks', 'mcp'].forEach(endpoint => {
      page.route(`/api/projects/keyboardproject/${endpoint}`, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            [endpoint === 'mcp' ? 'mcpServers' : endpoint]: []
          })
        });
      });
    });

    // Navigate to project
    await page.goto('/project-detail.html?id=keyboardproject');
    await page.waitForSelector('.agent-card', { timeout: 10000 });
    await page.waitForTimeout(500);

    // Open sidebar
    const viewDetailsButton = page.locator('.agent-card .btn-view-details').first();
    await viewDetailsButton.click();

    const sidebar = page.locator('.detail-sidebar');
    await expect(sidebar).toBeVisible({ timeout: 5000 });

    // Press Escape key to close sidebar
    await page.keyboard.press('Escape');

    // Verify sidebar closes
    await expect(sidebar).not.toBeVisible();
  });
});

test.describe('E2E Integration: API Integration Points', () => {
  /**
   * Tests all API endpoints are called correctly during full user flow
   */
  test('complete user flow triggers all expected API calls', async ({ page }) => {
    const apiCalls = [];

    // Track all API calls
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiCalls.push(request.url());
      }
    });

    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'apiproject',
              name: 'API Test Project',
              path: '/api/test',
              stats: { agents: 1, commands: 1, hooks: 1, mcp: 1 }
            }
          ]
        })
      });
    });

    // Mock all project endpoints
    ['agents', 'commands', 'hooks', 'mcp'].forEach(endpoint => {
      page.route(`/api/projects/apiproject/${endpoint}`, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            [endpoint === 'mcp' ? 'mcpServers' : endpoint]: []
          })
        });
      });
    });

    // Mock all user endpoints
    ['agents', 'commands', 'hooks', 'mcp'].forEach(endpoint => {
      page.route(`/api/user/${endpoint}`, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            [endpoint === 'mcp' ? 'mcpServers' : endpoint]: []
          })
        });
      });
    });

    // Execute complete user flow
    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Click actual project card (not user card)
    await page.locator('.project-card').nth(1).click();
    await page.waitForURL(/project-detail\.html/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Navigate to user view via User button in header
    await page.click('.btn-user');
    await page.waitForURL(/user-view\.html/);
    await page.waitForSelector('.user-info-bar', { timeout: 10000 });

    // Verify expected API calls were made (check for includes since URLs are full paths)
    expect(apiCalls.some(url => url.includes('/api/projects'))).toBeTruthy();
    expect(apiCalls.some(url => url.includes('/api/projects/apiproject/agents'))).toBeTruthy();
    expect(apiCalls.some(url => url.includes('/api/projects/apiproject/commands'))).toBeTruthy();
    expect(apiCalls.some(url => url.includes('/api/projects/apiproject/hooks'))).toBeTruthy();
    expect(apiCalls.some(url => url.includes('/api/projects/apiproject/mcp'))).toBeTruthy();
    expect(apiCalls.some(url => url.includes('/api/user/agents'))).toBeTruthy();
    expect(apiCalls.some(url => url.includes('/api/user/commands'))).toBeTruthy();
    expect(apiCalls.some(url => url.includes('/api/user/hooks'))).toBeTruthy();
    expect(apiCalls.some(url => url.includes('/api/user/mcp'))).toBeTruthy();
  });

  /**
   * Tests warning display works correctly across views
   */
  test('warnings from API are displayed correctly in all views', async ({ page }) => {
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
              path: '/warning/test',
              stats: { agents: 1, commands: 0, hooks: 0, mcp: 0 }
            }
          ],
          warnings: ['Warning: .claude.json contains deprecated fields']
        })
      });
    });

    await page.route('/api/projects/warningproject/agents', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          agents: [],
          warnings: ['Warning: Malformed YAML in agent file', 'Warning: Missing frontmatter']
        })
      });
    });

    // Navigate to project
    await page.goto('/project-detail.html?id=warningproject');
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Wait for agents to load (which will trigger warnings)
    await page.waitForTimeout(1000);

    // Verify warning banner appears
    const warningBanner = page.locator('.warning-banner');
    await expect(warningBanner).toBeVisible({ timeout: 5000 });

    // Verify warning count (warnings from agents endpoint)
    const warningHeader = page.locator('.warning-header');
    await expect(warningHeader).toContainText('Warning');

    // Verify warning messages are displayed
    const warningList = page.locator('.warning-list li');
    expect(await warningList.count()).toBeGreaterThanOrEqual(1);
  });

  /**
   * Tests empty state displays correctly when no data exists
   */
  test('empty states display correctly across all configuration types', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'emptyproject',
              name: 'Empty Project',
              path: '/empty/test',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    // Mock empty responses for all endpoints
    ['agents', 'commands', 'hooks', 'mcp'].forEach(endpoint => {
      page.route(`/api/projects/emptyproject/${endpoint}`, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            [endpoint === 'mcp' ? 'mcpServers' : endpoint]: []
          })
        });
      });
    });

    // Navigate to project
    await page.goto('/project-detail.html?id=emptyproject');
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Wait for all cards to load
    await page.waitForTimeout(1000);

    // Verify all cards show empty states
    const agentEmptyState = page.locator('.agent-card .empty-state');
    await expect(agentEmptyState).toBeVisible();
    await expect(agentEmptyState).toContainText('No subagents configured');

    const commandEmptyState = page.locator('.command-card .empty-state');
    await expect(commandEmptyState).toBeVisible();
    await expect(commandEmptyState).toContainText('No slash commands configured');

    const hookEmptyState = page.locator('.hook-card .empty-state');
    await expect(hookEmptyState).toBeVisible();
    await expect(hookEmptyState).toContainText('No hooks configured');

    const mcpEmptyState = page.locator('.mcp-card .empty-state');
    await expect(mcpEmptyState).toBeVisible();
    await expect(mcpEmptyState).toContainText('No MCP servers configured');
  });
});

test.describe('E2E Integration: Error Handling & Recovery', () => {
  /**
   * Tests application handles network failures gracefully
   */
  test('application handles API failures and provides recovery options', async ({ page }) => {
    let requestCount = 0;

    await page.route('/api/projects', (route) => {
      requestCount++;
      if (requestCount === 1) {
        // First request fails
        route.abort('failed');
      } else {
        // Second request succeeds
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            projects: [
              {
                id: 'recoveryproject',
                name: 'Recovery Project',
                path: '/recovery/test',
                stats: { agents: 1, commands: 1, hooks: 1, mcp: 1 }
              }
            ]
          })
        });
      }
    });

    // Navigate to dashboard
    await page.goto('/');

    // Verify error state is displayed
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Failed to fetch');

    // Click retry button
    const retryButton = page.locator('.btn-retry');
    await expect(retryButton).toBeVisible();
    await retryButton.click();

    // Verify projects load successfully after retry
    await page.waitForSelector('.project-grid', { timeout: 10000 });
    const projectCard = page.locator('.project-card').first();
    await expect(projectCard).toBeVisible();
    await expect(projectCard).toContainText('Recovery Project');
  });

  /**
   * Tests invalid project ID handling
   */
  test('application handles invalid project ID gracefully', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'validproject',
              name: 'Valid Project',
              path: '/valid',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    // Navigate with invalid project ID
    await page.goto('/project-detail.html?id=nonexistentproject');

    // Verify error state is displayed
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible({ timeout: 10000 });
    await expect(errorState).toContainText('Project not found');

    // Verify user can navigate back to dashboard
    const dashboardBreadcrumb = page.locator('.breadcrumb-item.clickable');
    await dashboardBreadcrumb.click();
    await page.waitForURL('/');

    // Verify dashboard loads correctly
    const projectCard = page.locator('.project-card').first();
    await expect(projectCard).toBeVisible();
  });

  /**
   * Tests no console errors during complete user flow
   */
  test('no console errors occur during complete user flow', async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

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
              path: '/clean',
              stats: { agents: 1, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.route('/api/projects/cleanproject/agents', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          agents: [
            {
              name: 'test-agent',
              description: 'Test',
              content: 'Content',
              filePath: '/test.md'
            }
          ]
        })
      });
    });

    // Mock other configuration endpoints
    ['commands', 'hooks', 'mcp'].forEach(endpoint => {
      page.route(`/api/projects/cleanproject/${endpoint}`, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            [endpoint === 'mcp' ? 'mcpServers' : endpoint]: []
          })
        });
      });
    });

    // Mock user endpoints
    ['agents', 'commands', 'hooks', 'mcp'].forEach(endpoint => {
      page.route(`/api/user/${endpoint}`, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            [endpoint === 'mcp' ? 'mcpServers' : endpoint]: []
          })
        });
      });
    });

    // Execute complete user flow
    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Click actual project card (not user card)
    await page.locator('.project-card').nth(1).click();
    await page.waitForURL(/project-detail\.html/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    await page.waitForTimeout(500);
    const viewDetailsButton = page.locator('.agent-card .btn-view-details').first();
    await viewDetailsButton.click();

    const sidebar = page.locator('.detail-sidebar');
    await expect(sidebar).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
    await page.click('.theme-toggle');
    await page.waitForTimeout(100);

    await page.click('.btn-user');
    await page.waitForURL(/user-view\.html/);
    await page.waitForSelector('.user-info-bar', { timeout: 10000 });

    await page.click('.breadcrumb-item.clickable');
    await page.waitForURL('/');

    // Verify no errors occurred
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
});
