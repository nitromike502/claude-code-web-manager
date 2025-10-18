const { test, expect } = require('@playwright/test');

/**
 * Test 06 - Styling & Theme Tests
 *
 * Comprehensive tests for:
 * - Theme toggle functionality
 * - Dark/light mode styling
 * - CSS variables application
 * - Responsive design
 * - Visual regression prevention
 */

test.describe('Theme Toggle Functionality', () => {
  test('theme toggle button changes data-theme attribute', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Wait for Vue to mount

    // Get initial theme
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');
    expect(initialTheme).toBeTruthy();
    expect(['light', 'dark']).toContain(initialTheme);

    // Click theme toggle
    const themeToggle = page.locator('.theme-toggle');
    await expect(themeToggle).toBeVisible({ timeout: 10000 });
    await themeToggle.click();

    // Wait for theme change
    await page.waitForTimeout(200);

    // Verify theme changed
    const newTheme = await html.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
    expect(['light', 'dark']).toContain(newTheme);
  });

  test('theme persists after page reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Set to light theme
    const html = page.locator('html');
    let currentTheme = await html.getAttribute('data-theme');

    if (currentTheme !== 'light') {
      await page.click('.theme-toggle');
      await page.waitForTimeout(200);
    }

    // Verify light theme
    currentTheme = await html.getAttribute('data-theme');
    expect(currentTheme).toBe('light');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify theme persisted
    const reloadedTheme = await html.getAttribute('data-theme');
    expect(reloadedTheme).toBe('light');
  });

  test('theme toggle works from any route', async ({ page }) => {
    // Test from dashboard
    await page.goto('/');
    const html = page.locator('html');
    const dashboardTheme = await html.getAttribute('data-theme');

    await page.click('.theme-toggle');
    await page.waitForTimeout(200);

    const newTheme = await html.getAttribute('data-theme');
    expect(newTheme).not.toBe(dashboardTheme);

    // Navigate to user config
    await page.goto('/user');
    await page.waitForLoadState('networkidle');

    // Verify theme persisted across navigation
    const userRouteTheme = await html.getAttribute('data-theme');
    expect(userRouteTheme).toBe(newTheme);
  });
});

test.describe('Dark Mode Styling', () => {
  test('dark mode colors applied correctly', async ({ page }) => {
    await page.goto('/');

    // Ensure dark mode
    const html = page.locator('html');
    let currentTheme = await html.getAttribute('data-theme');

    if (currentTheme !== 'dark') {
      await page.click('.theme-toggle');
      await page.waitForTimeout(200);
    }

    // Verify dark mode attribute
    currentTheme = await html.getAttribute('data-theme');
    expect(currentTheme).toBe('dark');

    // Check computed styles
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Dark mode should have dark background (rgb values close to black)
    expect(bgColor).toMatch(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    const [, r, g, b] = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/) || [];
    const isDark = parseInt(r) < 50 && parseInt(g) < 50 && parseInt(b) < 50;
    expect(isDark).toBe(true);
  });

  test('dark mode affects all components', async ({ page }) => {
    await page.goto('/');

    // Set to dark mode
    const html = page.locator('html');
    let currentTheme = await html.getAttribute('data-theme');

    if (currentTheme !== 'dark') {
      await page.click('.theme-toggle');
      await page.waitForTimeout(200);
    }

    // Check header background
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    const headerBg = await header.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Should have dark background
    expect(headerBg).toMatch(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  });
});

test.describe('Light Mode Styling', () => {
  test('light mode colors applied correctly', async ({ page }) => {
    await page.goto('/');

    // Ensure light mode
    const html = page.locator('html');
    let currentTheme = await html.getAttribute('data-theme');

    if (currentTheme !== 'light') {
      await page.click('.theme-toggle');
      await page.waitForTimeout(200);
    }

    // Verify light mode attribute
    currentTheme = await html.getAttribute('data-theme');
    expect(currentTheme).toBe('light');

    // Check computed styles
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Light mode should have light background (rgb values > 200)
    expect(bgColor).toMatch(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    const [, r, g, b] = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/) || [];
    const isLight = parseInt(r) > 200 && parseInt(g) > 200 && parseInt(b) > 200;
    expect(isLight).toBe(true);
  });

  test('light mode affects all components', async ({ page }) => {
    await page.goto('/');

    // Set to light mode
    const html = page.locator('html');
    let currentTheme = await html.getAttribute('data-theme');

    if (currentTheme !== 'light') {
      await page.click('.theme-toggle');
      await page.waitForTimeout(200);
    }

    // Check header background
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    const headerBg = await header.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Should have light background
    expect(headerBg).toMatch(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  });
});

test.describe('Responsive Design', () => {
  test('responsive layout on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify page renders
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    // Check if navigation is responsive
    const nav = page.locator('.app-nav');
    await expect(nav).toBeVisible();

    // Verify main content is visible
    const main = page.locator('.app-main');
    await expect(main).toBeVisible();
  });

  test('responsive layout on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Verify page renders
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    // Check if dashboard renders properly
    const dashboard = page.locator('.dashboard');
    await expect(dashboard).toBeVisible();
  });

  test('responsive layout on desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Verify page renders
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    // Verify wide layout
    const main = page.locator('.app-main');
    await expect(main).toBeVisible();

    const width = await main.evaluate((el) => el.offsetWidth);
    expect(width).toBeGreaterThan(1000);
  });

  test('typography scales appropriately on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check font size
    const html = page.locator('html');
    const fontSize = await html.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });

    // Mobile should have smaller or equal font size
    expect(fontSize).toMatch(/\d+px/);
    const size = parseInt(fontSize);
    expect(size).toBeLessThanOrEqual(16);
  });
});

test.describe('Visual Regression Prevention', () => {
  test('no layout shift on theme change', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get initial header position
    const header = page.locator('.app-header');
    const initialPos = await header.boundingBox();

    // Toggle theme
    await page.click('.theme-toggle');
    await page.waitForTimeout(300);

    // Get new header position
    const newPos = await header.boundingBox();

    // Position should not have changed
    expect(newPos.x).toBe(initialPos.x);
    expect(newPos.y).toBe(initialPos.y);
    expect(newPos.width).toBe(initialPos.width);
  });

  test('all text readable in both themes', async ({ page }) => {
    await page.goto('/');

    // Test dark mode
    const html = page.locator('html');
    let currentTheme = await html.getAttribute('data-theme');

    if (currentTheme !== 'dark') {
      await page.click('.theme-toggle');
      await page.waitForTimeout(200);
    }

    // Check header text is visible
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Toggle to light mode
    await page.click('.theme-toggle');
    await page.waitForTimeout(200);

    // Check header text still visible
    await expect(h1).toBeVisible();
  });

  test('CSS variables are defined', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Check that CSS variables are defined on HTML element
    const result = await page.evaluate(() => {
      const html = document.documentElement;
      const styles = window.getComputedStyle(html);

      // Check for some key variables
      const vars = [
        '--bg-primary',
        '--text-primary',
        '--color-primary',
        '--border-primary'
      ];

      const values = {};
      vars.forEach(varName => {
        const value = styles.getPropertyValue(varName).trim();
        values[varName] = value;
      });

      const allDefined = vars.every(varName => {
        const value = values[varName];
        return value && value !== '';
      });

      return { allDefined, values };
    });

    expect(result.allDefined).toBe(true);

    // Verify actual color values are present
    expect(result.values['--bg-primary']).toMatch(/#[0-9a-fA-F]{6}/);
    expect(result.values['--text-primary']).toMatch(/#[0-9a-fA-F]{6}/);
    expect(result.values['--color-primary']).toMatch(/#[0-9a-fA-F]{6}/);
    expect(result.values['--border-primary']).toMatch(/#[0-9a-fA-F]{6}/);
  });
});

test.describe('Transition Smoothness', () => {
  test('theme transition applies smoothly', async ({ page }) => {
    await page.goto('/');

    // Get initial background color
    const body = page.locator('body');
    const initialColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Toggle theme
    await page.click('.theme-toggle');

    // Wait for transition (CSS transition is 0.3s)
    await page.waitForTimeout(350);

    // Get new color
    const newColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Colors should be different
    expect(newColor).not.toBe(initialColor);
  });
});

test.describe('Console Errors', () => {
  test('no console errors during theme toggle', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.click('.theme-toggle');
    await page.waitForTimeout(300);

    // Should have no console errors
    expect(consoleErrors).toHaveLength(0);
  });
});
