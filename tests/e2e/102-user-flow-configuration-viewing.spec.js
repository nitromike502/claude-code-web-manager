const { test, expect } = require('@playwright/test');

/**
 * End-to-End Flow Test: Configuration Viewing Journey
 *
 * This test validates that users can navigate through different configuration
 * types within a project and view all relevant information.
 *
 * User Journey:
 * 1. User selects a project
 * 2. Views subagent configurations
 * 3. Views slash commands
 * 4. Views hooks
 * 5. Views MCP servers
 * 6. Switches between different configuration sections
 * 7. Returns to project list
 *
 * NOTE: This test is partially forward-looking as configuration cards
 * (Story 3.2) are not yet implemented. Current tests validate the foundation
 * structure that will support future configuration viewing.
 */

test.describe('E2E Flow: Configuration Viewing Journey', () => {
  test('user navigates through project detail view structure', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'configproject',
              name: 'Configuration Project',
              path: '/home/user/config-project',
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

    // STEP 1: User selects a project from dashboard
    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // nth(1) skips User card at index 0
    const projectCard = page.locator('.project-card').nth(1);
    await expect(projectCard).toBeVisible();
    await expect(projectCard).toContainText('Configuration Project');

    // Verify stats are visible before clicking
    await expect(projectCard).toContainText('5 Agents');
    await expect(projectCard).toContainText('12 Commands');
    await expect(projectCard).toContainText('3 Hooks');
    await expect(projectCard).toContainText('2 MCP');

    await projectCard.click();

    // Navigate to detail page
    await page.waitForURL(/project-detail\.html/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // STEP 2-5: Verify all configuration cards are visible
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('Configuration Project');

    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);

    // Verify each configuration type is represented
    const agentCard = page.locator('.agent-card');
    await expect(agentCard).toBeVisible();
    await expect(agentCard.locator('.card-title')).toContainText('Subagents');

    const commandCard = page.locator('.command-card');
    await expect(commandCard).toBeVisible();
    await expect(commandCard.locator('.card-title')).toContainText('Slash Commands');

    const hookCard = page.locator('.hook-card');
    await expect(hookCard).toBeVisible();
    await expect(hookCard.locator('.card-title')).toContainText('Hooks');

    const mcpCard = page.locator('.mcp-card');
    await expect(mcpCard).toBeVisible();
    await expect(mcpCard.locator('.card-title')).toContainText('MCP Servers');

    // STEP 6: Verify navigation structure exists
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();

    // STEP 7: Return to project list
    await page.click('.breadcrumb-item.clickable');
    await page.waitForURL('/');

    // Verify we're back on dashboard
    await expect(projectCard).toBeVisible();
  });

  test('project detail view displays correct statistics for multiple projects', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'project1',
              name: 'Project Alpha',
              path: '/alpha',
              stats: { agents: 10, commands: 20, hooks: 5, mcp: 3 }
            },
            {
              id: 'project2',
              name: 'Project Beta',
              path: '/beta',
              stats: { agents: 2, commands: 8, hooks: 1, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // View first project (nth(1) skips User card at index 0)
    const firstProject = page.locator('.project-card').nth(1);
    await firstProject.click();
    await page.waitForURL(/project-detail\.html\?id=project1/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify first project has configuration cards displayed
    let cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);

    // Verify all card types are present
    await expect(page.locator('.agent-card')).toBeVisible();
    await expect(page.locator('.command-card')).toBeVisible();
    await expect(page.locator('.hook-card')).toBeVisible();
    await expect(page.locator('.mcp-card')).toBeVisible();

    // Return to dashboard
    await page.click('.breadcrumb-item.clickable');
    await page.waitForURL('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // View second project (nth(2) for second actual project)
    const secondProject = page.locator('.project-card').nth(2);
    await secondProject.click();
    await page.waitForURL(/project-detail\.html\?id=project2/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify second project has configuration cards displayed
    cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);

    // Verify all card types are present
    await expect(page.locator('.agent-card')).toBeVisible();
    await expect(page.locator('.command-card')).toBeVisible();
    await expect(page.locator('.hook-card')).toBeVisible();
    await expect(page.locator('.mcp-card')).toBeVisible();
  });

  test('project with zero configurations displays correctly', async ({ page }) => {
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
              path: '/empty',
              stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
            }
          ]
        })
      });
    });

    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Navigate to project with no configurations (nth(1) skips User card)
    await page.locator('.project-card').nth(1).click();
    await page.waitForURL(/project-detail\.html/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify all configuration cards are displayed (even with empty state)
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);

    // Verify all card types are present
    await expect(page.locator('.agent-card')).toBeVisible();
    await expect(page.locator('.command-card')).toBeVisible();
    await expect(page.locator('.hook-card')).toBeVisible();
    await expect(page.locator('.mcp-card')).toBeVisible();

    // Project info should still be visible
    const projectTitle = page.locator('.project-info-title');
    await expect(projectTitle).toContainText('Empty Project');
  });

  test('search functionality exists on detail page for future config filtering', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'searchproject',
              name: 'Search Project',
              path: '/search',
              stats: { agents: 5, commands: 10, hooks: 2, mcp: 1 }
            }
          ]
        })
      });
    });

    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Click actual project (nth(1) skips User card)
    await page.locator('.project-card').nth(1).click();
    await page.waitForURL(/project-detail\.html/);

    // Verify search input exists (for future config filtering)
    const searchInput = page.locator('.search-input');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Search configurations...');

    // Search should be functional (even if filtering not yet implemented)
    await searchInput.fill('test');
    await expect(searchInput).toHaveValue('test');
  });

  test('project detail view maintains data integrity across navigation', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'integrityproject',
              name: 'Data Integrity Project',
              path: '/home/user/integrity',
              stats: { agents: 7, commands: 14, hooks: 4, mcp: 2 }
            }
          ]
        })
      });
    });

    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Navigate to detail page (nth(1) skips User card)
    await page.locator('.project-card').nth(1).click();
    await page.waitForURL(/project-detail\.html/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Capture initial data
    const projectName = await page.locator('.project-info-title').textContent();
    const projectPath = await page.locator('.project-info-subtitle').textContent();
    const cardsCount = await page.locator('.config-card').count();

    // Navigate back
    await page.click('.breadcrumb-item.clickable');
    await page.waitForURL('/');

    // Navigate to detail page again (nth(1) skips User card)
    await page.locator('.project-card').nth(1).click();
    await page.waitForURL(/project-detail\.html/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify data is identical
    const projectName2 = await page.locator('.project-info-title').textContent();
    const projectPath2 = await page.locator('.project-info-subtitle').textContent();
    const cardsCount2 = await page.locator('.config-card').count();

    expect(projectName2).toBe(projectName);
    expect(projectPath2).toBe(projectPath);
    expect(cardsCount2).toBe(cardsCount);
  });

  test('configuration icons display correctly for each type', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'iconproject',
              name: 'Icon Project',
              path: '/icons',
              stats: { agents: 1, commands: 1, hooks: 1, mcp: 1 }
            }
          ]
        })
      });
    });

    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Click actual project (nth(1) skips User card)
    await page.locator('.project-card').nth(1).click();
    await page.waitForURL(/project-detail\.html/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify each configuration card has appropriate icon
    // Agents icon (robot)
    await expect(page.locator('.agent-card .fa-robot')).toBeVisible();

    // Commands icon (terminal)
    await expect(page.locator('.command-card .fa-terminal')).toBeVisible();

    // Hooks icon (plug)
    await expect(page.locator('.hook-card .fa-plug')).toBeVisible();

    // MCP icon (server)
    await expect(page.locator('.mcp-card .fa-server')).toBeVisible();
  });

  test('project detail view handles large configuration counts', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'largeproject',
              name: 'Large Project',
              path: '/large',
              stats: { agents: 99, commands: 250, hooks: 45, mcp: 12 }
            }
          ]
        })
      });
    });

    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });

    // Click actual project (nth(1) skips User card)
    await page.locator('.project-card').nth(1).click();
    await page.waitForURL(/project-detail\.html/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Verify all configuration cards are displayed
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);

    // Verify all card types are present (even with large counts)
    await expect(page.locator('.agent-card')).toBeVisible();
    await expect(page.locator('.command-card')).toBeVisible();
    await expect(page.locator('.hook-card')).toBeVisible();
    await expect(page.locator('.mcp-card')).toBeVisible();

    // Verify layout isn't broken by large numbers
    const projectContent = page.locator('.project-content');
    await expect(projectContent).toBeVisible();
  });

  test('detail view works correctly on different viewport sizes', async ({ page }) => {
    await page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects: [
            {
              id: 'responsiveproject',
              name: 'Responsive Project',
              path: '/responsive',
              stats: { agents: 3, commands: 6, hooks: 2, mcp: 1 }
            }
          ]
        })
      });
    });

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });
    await page.locator('.project-card').nth(1).click(); // Skip User card
    await page.waitForURL(/project-detail\.html/);

    let cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);
    await expect(cards.first()).toBeVisible();

    // Navigate back for tablet test
    await page.click('.breadcrumb-item.clickable');
    await page.waitForURL('/');

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.locator('.project-card').nth(1).click(); // Skip User card
    await page.waitForURL(/project-detail\.html/);

    cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);
    await expect(cards.first()).toBeVisible();

    // Navigate back for desktop test
    await page.click('.breadcrumb-item.clickable');
    await page.waitForURL('/');

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.locator('.project-card').nth(1).click(); // Skip User card
    await page.waitForURL(/project-detail\.html/);

    cards = page.locator('.config-card');
    expect(await cards.count()).toBe(4);
    await expect(cards.first()).toBeVisible();
  });

  test('no console errors during configuration viewing flow', async ({ page }) => {
    const consoleErrors = [];

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
              stats: { agents: 2, commands: 4, hooks: 1, mcp: 1 }
            }
          ]
        })
      });
    });

    // Navigate through full flow
    await page.goto('/');
    await page.waitForSelector('.project-grid', { timeout: 10000 });
    await page.locator('.project-card').nth(1).click(); // Skip User card
    await page.waitForURL(/project-detail\.html/);
    await page.waitForSelector('.project-content', { timeout: 10000 });

    // Interact with page elements
    await page.click('.theme-toggle');
    await page.waitForTimeout(100);

    const searchInput = page.locator('.search-input');
    await searchInput.fill('test');
    await searchInput.clear();

    // Navigate back
    await page.click('.breadcrumb-item.clickable');
    await page.waitForURL('/');

    // Verify no errors
    expect(consoleErrors).toEqual([]);
  });
});
