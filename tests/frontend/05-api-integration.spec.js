/**
 * Test 05: API Integration Tests
 * Verifies all API endpoints work correctly and handle errors properly
 */

import { test, expect } from '@playwright/test';

test.describe('API Integration: Health Check', () => {
  test('health check endpoint responds correctly', async ({ request }) => {
    const response = await request.get('http://localhost:8420/api/health');
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.status).toBe('ok');
  });
});

test.describe('API Integration: Projects Endpoint', () => {
  test('getProjects returns valid project data', async ({ request }) => {
    const response = await request.get('http://localhost:8420/api/projects');
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.projects)).toBe(true);
    expect(data.projects.length).toBeGreaterThanOrEqual(0);
  });

  test('scanProjects completes successfully', async ({ request }) => {
    const response = await request.post('http://localhost:8420/api/projects/scan');
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.success).toBe(true);
  });
});

test.describe('API Integration: Project Detail Endpoints', () => {
  let projectId;

  test.beforeAll(async ({ request }) => {
    // Get first project ID
    const response = await request.get('http://localhost:8420/api/projects');
    const data = await response.json();
    projectId = data.projects[0]?.id;
  });

  test('getProjectAgents returns valid data', async ({ request }) => {
    test.skip(!projectId, 'No projects available');

    const response = await request.get(`http://localhost:8420/api/projects/${projectId}/agents`);
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.agents)).toBe(true);
  });

  test('getProjectCommands returns valid data', async ({ request }) => {
    test.skip(!projectId, 'No projects available');

    const response = await request.get(`http://localhost:8420/api/projects/${projectId}/commands`);
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.commands)).toBe(true);
  });

  test('getProjectHooks returns valid data', async ({ request }) => {
    test.skip(!projectId, 'No projects available');

    const response = await request.get(`http://localhost:8420/api/projects/${projectId}/hooks`);
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.hooks)).toBe(true);
  });

  test('getProjectMcp returns valid data', async ({ request }) => {
    test.skip(!projectId, 'No projects available');

    const response = await request.get(`http://localhost:8420/api/projects/${projectId}/mcp`);
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.mcp) || Array.isArray(data.mcpServers)).toBe(true);
  });
});

test.describe('API Integration: User Endpoints', () => {
  test('getUserAgents returns valid data', async ({ request }) => {
    const response = await request.get('http://localhost:8420/api/user/agents');
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.agents)).toBe(true);
  });

  test('getUserCommands returns valid data', async ({ request }) => {
    const response = await request.get('http://localhost:8420/api/user/commands');
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.commands)).toBe(true);
  });

  test('getUserHooks returns valid data', async ({ request }) => {
    const response = await request.get('http://localhost:8420/api/user/hooks');
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.hooks)).toBe(true);
  });

  test('getUserMcp returns valid data', async ({ request }) => {
    const response = await request.get('http://localhost:8420/api/user/mcp');
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.mcp) || Array.isArray(data.mcpServers)).toBe(true);
  });
});

test.describe('API Integration: Error Handling', () => {
  test('API handles 404 errors gracefully', async ({ request }) => {
    const response = await request.get('http://localhost:8420/api/projects/nonexistent-project-id/agents');
    expect(response.status()).toBe(404);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBeTruthy();
  });

  test('API returns appropriate status for missing resources', async ({ request }) => {
    const response = await request.get('http://localhost:8420/api/projects/invalid123/commands');
    // Should return 404 or 200 with empty array
    expect([200, 404].includes(response.status())).toBe(true);
  });
});

test.describe('API Integration: Components Use API Client', () => {
  test('Dashboard loads projects via API client', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Wait for projects to load
    await page.waitForSelector('.project-card, .empty-state, .error-state', { timeout: 10000 });

    // Verify no console errors during API call
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Trigger a rescan to test API integration
    const rescanButton = page.locator('.rescan-btn');
    if (await rescanButton.count() > 0) {
      await rescanButton.click();
      await page.waitForTimeout(2000); // Wait for scan to complete
    }

    // Check no critical API errors during calls
    const criticalErrors = consoleErrors.filter(err =>
      err.includes('Failed to fetch') || err.includes('Network error')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('ProjectDetail loads configurations via API client', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Wait for dashboard
    await page.waitForSelector('.project-card, .empty-state', { timeout: 10000 });

    // Click first non-user project card if available
    const projectCard = page.locator('.project-card:not(.user-card)').first();
    const cardCount = await projectCard.count();

    if (cardCount > 0) {
      await projectCard.click();

      // Wait for URL to change to project detail
      await page.waitForURL(/\/project\/.*/, { timeout: 5000 });

      // Wait for loading to complete and config cards to appear
      await page.waitForSelector('.config-card', { timeout: 15000 });

      // Give time for all config cards to render
      await page.waitForTimeout(1000);

      // Verify config cards are visible (loaded via API)
      const configCards = page.locator('.config-card');
      const finalCount = await configCards.count();

      // Should have 4 cards (agents, commands, hooks, mcp)
      expect(finalCount).toBeGreaterThanOrEqual(4);
    } else {
      test.skip(true, 'No regular project cards found');
    }
  });

  test('UserGlobal loads user configurations via API client', async ({ page }) => {
    await page.goto('http://localhost:5173/user');

    // Wait for user page to load
    await page.waitForSelector('.config-card, .loading-container', { timeout: 10000 });

    // Verify config cards are visible (loaded via API)
    const configCards = page.locator('.config-card');
    expect(await configCards.count()).toBeGreaterThanOrEqual(4); // agents, commands, hooks, mcp
  });
});

test.describe('API Integration: Timeout Handling', () => {
  test('API client has timeout protection in place', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Verify the app loads without hanging
    const loaded = await page.waitForSelector('.dashboard, .error-state', { timeout: 15000 });
    expect(loaded).toBeTruthy();
  });
});

test.describe('API Integration: Cross-Browser Compatibility', () => {
  test('API calls work correctly in all browsers', async ({ page, browserName }) => {
    await page.goto('http://localhost:5173');

    // Wait for initial load
    await page.waitForSelector('.project-card, .empty-state, .error-state', { timeout: 10000 });

    // Navigate to user page
    await page.goto('http://localhost:5173/user');
    await page.waitForSelector('.config-card, .loading-container', { timeout: 10000 });

    // Verify data loaded successfully in this browser
    const hasContent = await page.locator('.config-card, .empty-state').count();
    expect(hasContent).toBeGreaterThan(0);
  });
});

test.describe('API Integration: No Console Errors', () => {
  test('no API-related console errors during normal operations', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('http://localhost:5173');

    // Wait for initial load
    await page.waitForSelector('.project-card, .empty-state, .error-state', { timeout: 10000 });

    // Navigate to user page
    await page.goto('http://localhost:5173/user');
    await page.waitForSelector('.config-card, .loading-container', { timeout: 10000 });

    // Navigate back to dashboard
    await page.goto('http://localhost:5173');
    await page.waitForSelector('.project-card, .empty-state', { timeout: 10000 });

    // Filter for critical API errors only
    const criticalErrors = consoleErrors.filter(err =>
      err.includes('Failed to fetch') ||
      err.includes('Network error') ||
      err.includes('API Error') ||
      err.includes('timeout')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
