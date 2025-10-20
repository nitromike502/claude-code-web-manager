/**
 * Test Mock Data Fixtures
 *
 * Centralized mock data for all frontend tests
 * Provides consistent test data across component, E2E, and responsive tests
 *
 * Usage:
 * const { mockProjects, mockProjectDetails, setupMocks } = require('../fixtures/mock-data');
 *
 * In tests:
 * await setupMocks(page);
 */

const mockProjects = [
  {
    id: 'homeusertestproject',
    name: 'Test Project',
    path: '/home/user/test-project',
    stats: { agents: 3, commands: 5, hooks: 2, mcp: 1 }
  },
  {
    id: 'testproject',
    name: 'Test Project',
    path: '/test/project',
    stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
  },
  {
    id: 'myproject',
    name: 'My Awesome Project',
    path: '/home/user/projects/awesome',
    stats: { agents: 2, commands: 3, hooks: 1, mcp: 0 }
  },
  {
    id: 'configproject',
    name: 'Configuration Project',
    path: '/home/user/config-project',
    stats: { agents: 5, commands: 12, hooks: 3, mcp: 2 }
  },
  {
    id: 'project1',
    name: 'Project 1',
    path: '/project/one',
    stats: { agents: 1, commands: 2, hooks: 1, mcp: 0 }
  },
  {
    id: 'project2',
    name: 'Project 2',
    path: '/project/two',
    stats: { agents: 3, commands: 5, hooks: 2, mcp: 1 }
  },
  {
    id: 'emptyproject',
    name: 'Empty Project',
    path: '/empty/project',
    stats: { agents: 0, commands: 0, hooks: 0, mcp: 0 }
  },
  {
    id: 'searchproject',
    name: 'Search Project',
    path: '/search/project',
    stats: { agents: 2, commands: 4, hooks: 1, mcp: 0 }
  },
  {
    id: 'integrityproject',
    name: 'Integrity Project',
    path: '/integrity/project',
    stats: { agents: 1, commands: 3, hooks: 0, mcp: 0 }
  },
  {
    id: 'iconproject',
    name: 'Icon Project',
    path: '/icon/project',
    stats: { agents: 4, commands: 8, hooks: 2, mcp: 1 }
  },
  {
    id: 'largeproject',
    name: 'Large Project',
    path: '/large/project',
    stats: { agents: 10, commands: 20, hooks: 5, mcp: 3 }
  },
  {
    id: 'responsiveproject',
    name: 'Responsive Project',
    path: '/responsive/project',
    stats: { agents: 2, commands: 4, hooks: 1, mcp: 0 }
  },
  {
    id: 'cleanproject',
    name: 'Clean Project',
    path: '/clean/project',
    stats: { agents: 1, commands: 2, hooks: 0, mcp: 0 }
  },
  {
    id: 'copyproject',
    name: 'Copy Project',
    path: '/copy/project',
    stats: { agents: 2, commands: 3, hooks: 1, mcp: 0 }
  },
];

const mockProjectDetails = {
  homeusertestproject: {
    agents: [
      { id: 'agent1', name: 'Test Agent', description: 'Test agent for testing' }
    ],
    commands: [
      { id: 'cmd1', name: 'test-command', path: 'commands/test.md' }
    ],
    hooks: [
      { id: 'hook1', name: 'pre-commit', condition: 'always' }
    ],
    mcp: [
      { id: 'mcp1', name: 'test-mcp', type: 'stdio' }
    ]
  },
  testproject: {
    agents: [],
    commands: [],
    hooks: [],
    mcp: []
  },
  myproject: {
    agents: [
      { id: 'agent1', name: 'Agent A' },
      { id: 'agent2', name: 'Agent B' }
    ],
    commands: [
      { id: 'cmd1', name: 'build' },
      { id: 'cmd2', name: 'test' },
      { id: 'cmd3', name: 'deploy' }
    ],
    hooks: [
      { id: 'hook1', name: 'pre-commit' }
    ],
    mcp: []
  },
  configproject: {
    agents: [
      { id: 'a1', name: 'Agent 1' },
      { id: 'a2', name: 'Agent 2' },
      { id: 'a3', name: 'Agent 3' },
      { id: 'a4', name: 'Agent 4' },
      { id: 'a5', name: 'Agent 5' }
    ],
    commands: Array.from({ length: 12 }, (_, i) => ({ id: `cmd${i+1}`, name: `Command ${i+1}` })),
    hooks: [
      { id: 'h1', name: 'Hook 1' },
      { id: 'h2', name: 'Hook 2' },
      { id: 'h3', name: 'Hook 3' }
    ],
    mcp: [
      { id: 'm1', name: 'MCP 1' },
      { id: 'm2', name: 'MCP 2' }
    ]
  },
  emptyproject: {
    agents: [],
    commands: [],
    hooks: [],
    mcp: []
  },
};

const mockUserConfig = {
  agents: [
    { id: 'user-agent', name: 'User Agent', description: 'Global agent' }
  ],
  commands: [
    { id: 'user-cmd', name: 'global-command' }
  ],
  hooks: [
    { id: 'user-hook', name: 'global-hook' }
  ],
  mcp: [
    { id: 'user-mcp', name: 'global-mcp' }
  ]
};

/**
 * Setup all mock routes for a test
 * IMPORTANT: Call this BEFORE navigating to any page
 *
 * @param {Page} page - Playwright page object
 * @param {Object} options - Configuration options
 * @param {string} options.projectId - Specific project to mock (optional)
 * @param {Array} options.projects - Custom projects list (optional, defaults to mockProjects)
 */
async function setupMocks(page, options = {}) {
  const { projectId, projects = mockProjects } = options;

  // IMPORTANT: Set specific routes BEFORE generic wildcard routes
  // This prevents the wildcard from catching detail endpoint calls

  // 1. Mock user configuration endpoints (before projects)
  await page.route('**/api/user/agents', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, agents: mockUserConfig.agents })
    });
  });

  await page.route('**/api/user/commands', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, commands: mockUserConfig.commands })
    });
  });

  await page.route('**/api/user/hooks', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, hooks: mockUserConfig.hooks })
    });
  });

  await page.route('**/api/user/mcp', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, mcp: mockUserConfig.mcp })
    });
  });

  // 2. Mock specific project detail endpoints for each project
  for (const proj of projects) {
    const details = mockProjectDetails[proj.id] || {
      agents: [],
      commands: [],
      hooks: [],
      mcp: []
    };

    // Mock agents endpoint for this project
    await page.route(`**/api/projects/${proj.id}/agents`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, agents: details.agents })
      });
    });

    // Mock commands endpoint for this project
    await page.route(`**/api/projects/${proj.id}/commands`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, commands: details.commands })
      });
    });

    // Mock hooks endpoint for this project
    await page.route(`**/api/projects/${proj.id}/hooks`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, hooks: details.hooks })
      });
    });

    // Mock MCP endpoint for this project
    await page.route(`**/api/projects/${proj.id}/mcp`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, mcp: details.mcp })
      });
    });
  }

  // 3. Mock projects list endpoint LAST (most general wildcard)
  await page.route('**/api/projects', (route) => {
    // Only intercept GET requests to avoid interfering with POSTs
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, projects })
      });
    } else {
      route.continue();
    }
  });
}

/**
 * Get a specific project by ID from fixtures
 */
function getProject(projectId) {
  return mockProjects.find(p => p.id === projectId);
}

/**
 * Get details for a specific project
 */
function getProjectDetails(projectId) {
  return mockProjectDetails[projectId] || {
    agents: [],
    commands: [],
    hooks: [],
    mcp: []
  };
}

module.exports = {
  mockProjects,
  mockProjectDetails,
  mockUserConfig,
  setupMocks,
  getProject,
  getProjectDetails
};
