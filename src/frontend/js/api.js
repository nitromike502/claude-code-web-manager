// API Client for Claude Code Manager

const API_BASE_URL = '/api';

// Helper function for fetch requests
async function fetchJSON(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Projects API
export const projectsAPI = {
  // Get all projects
  async getAll() {
    return fetchJSON(`${API_BASE_URL}/projects`);
  },

  // Trigger rescan
  async scan() {
    return fetchJSON(`${API_BASE_URL}/projects/scan`, {
      method: 'POST',
    });
  },

  // Get project agents
  async getAgents(projectId) {
    return fetchJSON(`${API_BASE_URL}/projects/${projectId}/agents`);
  },

  // Get project commands
  async getCommands(projectId) {
    return fetchJSON(`${API_BASE_URL}/projects/${projectId}/commands`);
  },

  // Get project hooks
  async getHooks(projectId) {
    return fetchJSON(`${API_BASE_URL}/projects/${projectId}/hooks`);
  },

  // Get project MCP servers
  async getMCP(projectId) {
    return fetchJSON(`${API_BASE_URL}/projects/${projectId}/mcp`);
  },
};

// User API
export const userAPI = {
  // Get user agents
  async getAgents() {
    return fetchJSON(`${API_BASE_URL}/user/agents`);
  },

  // Get user commands
  async getCommands() {
    return fetchJSON(`${API_BASE_URL}/user/commands`);
  },

  // Get user hooks
  async getHooks() {
    return fetchJSON(`${API_BASE_URL}/user/hooks`);
  },

  // Get user MCP servers
  async getMCP() {
    return fetchJSON(`${API_BASE_URL}/user/mcp`);
  },

  // Get user stats (counts for all categories)
  async getStats() {
    const [agents, commands, hooks, mcp] = await Promise.all([
      this.getAgents(),
      this.getCommands(),
      this.getHooks(),
      this.getMCP(),
    ]);

    return {
      agents: agents.agents?.length || 0,
      commands: commands.commands?.length || 0,
      hooks: hooks.hooks?.length || 0,
      mcp: mcp.mcp?.length || 0,
    };
  },
};

// Health check
export async function healthCheck() {
  return fetchJSON(`${API_BASE_URL}/health`);
}

export default {
  projects: projectsAPI,
  user: userAPI,
  healthCheck,
};
