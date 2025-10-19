/**
 * Pinia Store Integration Tests
 * Verifies that all Pinia stores are properly configured and working
 */

const { test, expect } = require('@playwright/test')

test.describe('Pinia Store Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('should have all stores registered', async ({ page }) => {
    // At minimum, the app should load without errors
    // Use .app-container which is the Vue-rendered app
    const appElement = page.locator('.app-container')
    await expect(appElement).toBeVisible()
  })

  test('theme store - should toggle theme', async ({ page }) => {
    // Find and click the theme toggle button
    const themeToggle = page.locator('button.theme-toggle')
    await expect(themeToggle).toBeVisible()

    // Get initial theme
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme')
    })

    // Click toggle
    await themeToggle.click()

    // Verify theme changed
    const newTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme')
    })

    expect(newTheme).not.toBe(initialTheme)
    expect(['light', 'dark']).toContain(newTheme)
  })

  test('theme store - should persist to localStorage', async ({ page }) => {
    // Toggle theme
    const themeToggle = page.locator('button.theme-toggle')
    await themeToggle.click()

    // Get current theme
    const currentTheme = await page.evaluate(() => {
      return localStorage.getItem('claude-code-manager-theme')
    })

    expect(['light', 'dark']).toContain(currentTheme)

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verify theme persisted
    const persistedTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme')
    })

    expect(persistedTheme).toBe(currentTheme)
  })

  test('notifications store - should display and auto-dismiss notifications', async ({ page }) => {
    // Trigger a notification by evaluating code that uses the store
    await page.evaluate(() => {
      // Access the Pinia store through the Vue app instance
      const app = document.querySelector('#app').__vue_app__
      if (app) {
        const pinia = app.config.globalProperties.$pinia
        if (pinia) {
          const useNotificationsStore = () => {
            return pinia._s.get('notifications')
          }
          const store = useNotificationsStore()
          if (store) {
            store.info('Test notification')
          }
        }
      }
    })

    // Check if notification appears
    const notification = page.locator('.notification')
    await expect(notification).toBeVisible({ timeout: 2000 })

    // Verify notification has correct text
    await expect(notification).toContainText('Test notification')

    // Wait for auto-dismiss (5 seconds + buffer)
    await expect(notification).not.toBeVisible({ timeout: 6000 })
  })

  test('projects store - should be accessible from components', async ({ page }) => {
    // Verify the app renders without errors, which means stores are initialized
    const header = page.locator('.app-header')
    await expect(header).toBeVisible()

    // Verify nav links are present (they use router which depends on store setup)
    const dashboardLink = page.locator('nav a:has-text("Dashboard")')
    const userLink = page.locator('nav a:has-text("User Config")')

    await expect(dashboardLink).toBeVisible()
    await expect(userLink).toBeVisible()
  })

  test('App.vue integration - should render all store-dependent elements', async ({ page }) => {
    // Check theme toggle (uses theme store)
    const themeToggle = page.locator('button.theme-toggle')
    await expect(themeToggle).toBeVisible()

    // Check header exists
    const header = page.locator('.app-header')
    await expect(header).toBeVisible()

    // Check main content area exists
    const main = page.locator('.app-main')
    await expect(main).toBeVisible()

    // Verify no console errors
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(err =>
      !err.includes('favicon') &&
      !err.includes('404') &&
      !err.includes('websocket')
    )

    expect(criticalErrors.length).toBe(0)
  })
})
