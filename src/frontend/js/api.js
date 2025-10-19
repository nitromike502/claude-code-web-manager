// API Client for Claude Code Manager
// NOTE: This file re-exports the centralized API client for backwards compatibility

import * as apiClient from '../../api/client.js'

const API_BASE_URL = '/api';

// Helper function for fetch requests (kept for backwards compatibility)
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

// Projects API (using centralized client)
export const projectsAPI = {
  // Get all projects
  async getAll() {
    return apiClient.getProjects();
  },

  // Trigger rescan
  async scan() {
    return apiClient.scanProjects();
  },

  // Get project agents
  async getAgents(projectId) {
    return apiClient.getProjectAgents(projectId);
  },

  // Get project commands
  async getCommands(projectId) {
    return apiClient.getProjectCommands(projectId);
  },

  // Get project hooks
  async getHooks(projectId) {
    return apiClient.getProjectHooks(projectId);
  },

  // Get project MCP servers
  async getMCP(projectId) {
    return apiClient.getProjectMcp(projectId);
  },
};

// User API (using centralized client)
export const userAPI = {
  // Get user agents
  async getAgents() {
    return apiClient.getUserAgents();
  },

  // Get user commands
  async getCommands() {
    return apiClient.getUserCommands();
  },

  // Get user hooks
  async getHooks() {
    return apiClient.getUserHooks();
  },

  // Get user MCP servers
  async getMCP() {
    return apiClient.getUserMcp();
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
  return apiClient.healthCheck();
}

export default {
  projects: projectsAPI,
  user: userAPI,
  healthCheck,
};
