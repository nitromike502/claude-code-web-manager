/**
 * Page Object Models for E2E Testing
 *
 * These helpers provide reusable methods for interacting with pages,
 * improving test maintainability and reducing code duplication.
 */

/**
 * Dashboard Page Object
 * Encapsulates interactions with the main dashboard page (/)
 */
class DashboardPage {
  constructor(page) {
    this.page = page;
    this.url = '/';
  }

  // Locators
  get projectGrid() {
    return this.page.locator('.project-grid');
  }

  get projectCards() {
    return this.page.locator('.project-card');
  }

  get searchInput() {
    return this.page.locator('.search-input');
  }

  get refreshButton() {
    return this.page.locator('.btn-refresh');
  }

  get themeToggle() {
    return this.page.locator('.theme-toggle');
  }

  get loadingState() {
    return this.page.locator('.loading-state');
  }

  get errorState() {
    return this.page.locator('.error-state');
  }

  get emptyState() {
    return this.page.locator('.empty-state');
  }

  // Actions
  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForProjectsToLoad() {
    await this.projectGrid.waitFor({ state: 'visible', timeout: 10000 });
  }

  async searchProjects(query) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(200); // Allow filter to process
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(200);
  }

  async selectProject(index = 0) {
    const card = this.projectCards.nth(index);
    await card.click();
    await this.page.waitForURL(/project-detail\.html/);
  }

  async selectProjectById(projectId) {
    const cards = await this.projectCards.all();
    for (const card of cards) {
      const nameElement = await card.locator('.project-name');
      const text = await nameElement.textContent();
      if (text.toLowerCase().includes(projectId.toLowerCase())) {
        await card.click();
        await this.page.waitForURL(/project-detail\.html/);
        return;
      }
    }
    throw new Error(`Project with ID containing '${projectId}' not found`);
  }

  async toggleTheme() {
    await this.themeToggle.click();
    await this.page.waitForTimeout(100);
  }

  async refreshProjects() {
    await this.refreshButton.click();
  }

  // Assertions
  async expectProjectCount(count) {
    const actual = await this.projectCards.count();
    if (actual !== count) {
      throw new Error(`Expected ${count} projects, but found ${actual}`);
    }
  }

  async expectLoadingState() {
    await this.loadingState.waitFor({ state: 'visible', timeout: 5000 });
  }

  async expectErrorState() {
    await this.errorState.waitFor({ state: 'visible', timeout: 5000 });
  }

  async expectEmptyState() {
    await this.emptyState.waitFor({ state: 'visible', timeout: 5000 });
  }
}

/**
 * Project Detail Page Object
 * Encapsulates interactions with project detail page (/project-detail.html)
 */
class ProjectDetailPage {
  constructor(page) {
    this.page = page;
  }

  // Locators
  get projectContent() {
    return this.page.locator('.project-content');
  }

  get projectTitle() {
    return this.page.locator('.project-info-title');
  }

  get projectPath() {
    return this.page.locator('.project-info-subtitle');
  }

  get breadcrumbs() {
    return this.page.locator('.breadcrumbs');
  }

  get dashboardBreadcrumb() {
    return this.page.locator('.breadcrumb-item.clickable');
  }

  get activeBreadcrumb() {
    return this.page.locator('.breadcrumb-item.active');
  }

  get stats() {
    return this.page.locator('.placeholder-stat');
  }

  get searchInput() {
    return this.page.locator('.search-input');
  }

  get themeToggle() {
    return this.page.locator('.theme-toggle');
  }

  get warningBanner() {
    return this.page.locator('.warning-banner');
  }

  get warningList() {
    return this.page.locator('.warning-list li');
  }

  get loadingState() {
    return this.page.locator('.loading-state');
  }

  get errorState() {
    return this.page.locator('.error-state');
  }

  get retryButton() {
    return this.page.locator('.btn-retry');
  }

  // Actions
  async goto(projectId) {
    await this.page.goto(`/project-detail.html?id=${projectId}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForContentToLoad() {
    await this.projectContent.waitFor({ state: 'visible', timeout: 10000 });
  }

  async goToDashboard() {
    await this.dashboardBreadcrumb.click();
    await this.page.waitForURL('/');
  }

  async toggleTheme() {
    await this.themeToggle.click();
    await this.page.waitForTimeout(100);
  }

  async searchConfigurations(query) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(200);
  }

  async retry() {
    await this.retryButton.click();
  }

  // Assertions
  async expectProjectName(name) {
    await this.projectTitle.waitFor({ state: 'visible', timeout: 5000 });
    const actual = await this.projectTitle.textContent();
    if (!actual.includes(name)) {
      throw new Error(`Expected project name to contain '${name}', but got '${actual}'`);
    }
  }

  async expectStatCount(type, count) {
    const index = { agents: 0, commands: 1, hooks: 2, mcp: 3 }[type];
    if (index === undefined) {
      throw new Error(`Invalid stat type: ${type}`);
    }
    const stat = this.stats.nth(index);
    await stat.waitFor({ state: 'visible', timeout: 5000 });
    const text = await stat.textContent();
    const expectedText = `${count} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    if (!text.includes(String(count))) {
      throw new Error(`Expected ${expectedText}, but got '${text}'`);
    }
  }

  async expectWarningCount(count) {
    if (count === 0) {
      await this.warningBanner.waitFor({ state: 'hidden', timeout: 5000 });
    } else {
      await this.warningBanner.waitFor({ state: 'visible', timeout: 5000 });
      const actual = await this.warningList.count();
      if (actual !== count) {
        throw new Error(`Expected ${count} warnings, but found ${actual}`);
      }
    }
  }
}

/**
 * API Mock Helper
 * Provides common API mocking patterns for testing
 */
class ApiMock {
  constructor(page) {
    this.page = page;
  }

  /**
   * Mock projects API with custom data
   */
  async mockProjects(projects, warnings = []) {
    await this.page.route('/api/projects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          projects,
          warnings
        })
      });
    });
  }

  /**
   * Mock projects API with error
   */
  async mockProjectsError(errorMessage = 'Server error') {
    await this.page.route('/api/projects', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: errorMessage
        })
      });
    });
  }

  /**
   * Mock network failure
   */
  async mockNetworkFailure() {
    await this.page.route('/api/projects', (route) => {
      route.abort('failed');
    });
  }

  /**
   * Create sample project data
   */
  createProject(overrides = {}) {
    const defaults = {
      id: 'sampleproject',
      name: 'Sample Project',
      path: '/sample/project',
      stats: {
        agents: 1,
        commands: 2,
        hooks: 1,
        mcp: 0
      }
    };
    return { ...defaults, ...overrides };
  }

  /**
   * Create multiple sample projects
   */
  createProjects(count) {
    return Array.from({ length: count }, (_, i) => ({
      id: `project${i}`,
      name: `Project ${i}`,
      path: `/path/to/project${i}`,
      stats: {
        agents: i,
        commands: i * 2,
        hooks: i % 3,
        mcp: i % 2
      }
    }));
  }
}

/**
 * Theme Helper
 * Utilities for testing theme functionality
 */
class ThemeHelper {
  constructor(page) {
    this.page = page;
  }

  async getCurrentTheme() {
    const html = this.page.locator('html');
    return await html.getAttribute('data-theme');
  }

  async getStoredTheme() {
    return await this.page.evaluate(() => localStorage.getItem('theme'));
  }

  async setStoredTheme(theme) {
    await this.page.evaluate((t) => localStorage.setItem('theme', t), theme);
  }

  async clearStoredTheme() {
    await this.page.evaluate(() => localStorage.removeItem('theme'));
  }

  async expectTheme(expectedTheme) {
    const actual = await this.getCurrentTheme();
    if (actual !== expectedTheme) {
      throw new Error(`Expected theme '${expectedTheme}', but got '${actual}'`);
    }
  }

  async expectThemeIcon(isDark) {
    const themeToggle = this.page.locator('.theme-toggle i');
    const iconClass = isDark ? 'fa-sun' : 'fa-moon';
    const hasClass = await themeToggle.evaluate((el, cls) => {
      return el.classList.contains(cls);
    }, iconClass);
    if (!hasClass) {
      throw new Error(`Expected theme icon '${iconClass}', but not found`);
    }
  }
}

/**
 * Console Error Tracker
 * Tracks console errors during test execution
 */
class ConsoleErrorTracker {
  constructor(page) {
    this.page = page;
    this.errors = [];
    this.warnings = [];

    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        this.errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        this.warnings.push(msg.text());
      }
    });

    this.page.on('pageerror', (error) => {
      this.errors.push(error.message);
    });
  }

  getErrors() {
    return this.errors;
  }

  getWarnings() {
    return this.warnings;
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  expectNoErrors() {
    if (this.hasErrors()) {
      throw new Error(`Found ${this.errors.length} console errors: ${this.errors.join(', ')}`);
    }
  }

  reset() {
    this.errors = [];
    this.warnings = [];
  }
}

module.exports = {
  DashboardPage,
  ProjectDetailPage,
  ApiMock,
  ThemeHelper,
  ConsoleErrorTracker
};
