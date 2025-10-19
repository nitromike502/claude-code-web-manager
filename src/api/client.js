/**
 * Centralized API client for all backend requests
 * Provides consistent error handling, timeout management, and request/response interceptors
 */

// Detect API base URL (development vs production)
function getBaseUrl() {
  // In development, backend runs on 8420, frontend on 5173
  if (window.location.hostname === 'localhost' && window.location.port === '5173') {
    return 'http://localhost:8420'
  }
  // In production, use same origin
  return window.location.origin
}

const BASE_URL = getBaseUrl()
const DEFAULT_TIMEOUT = 30000 // 30 seconds

/**
 * Fetch with timeout support
 * @param {string} url - Request URL
 * @param {object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      // Try to get error message from response body
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response
  } catch (error) {
    clearTimeout(timeoutId)

    // Handle abort errors (timeout)
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`)
    }

    throw error
  }
}

/**
 * Get all projects
 * @returns {Promise<Object>} - { projects: [], warnings: [] }
 */
export async function getProjects() {
  const response = await fetchWithTimeout(`${BASE_URL}/api/projects`)
  return response.json()
}

/**
 * Scan/refresh projects
 * @returns {Promise<Object>} - { message: string }
 */
export async function scanProjects() {
  const response = await fetchWithTimeout(`${BASE_URL}/api/projects/scan`, {
    method: 'POST'
  })
  return response.json()
}

/**
 * Get project agents
 * @param {string} projectId - Project identifier
 * @returns {Promise<Object>} - { agents: [], warnings: [] }
 */
export async function getProjectAgents(projectId) {
  const response = await fetchWithTimeout(`${BASE_URL}/api/projects/${projectId}/agents`)
  return response.json()
}

/**
 * Get project commands
 * @param {string} projectId - Project identifier
 * @returns {Promise<Object>} - { commands: [], warnings: [] }
 */
export async function getProjectCommands(projectId) {
  const response = await fetchWithTimeout(`${BASE_URL}/api/projects/${projectId}/commands`)
  return response.json()
}

/**
 * Get project hooks
 * @param {string} projectId - Project identifier
 * @returns {Promise<Object>} - { hooks: [], warnings: [] }
 */
export async function getProjectHooks(projectId) {
  const response = await fetchWithTimeout(`${BASE_URL}/api/projects/${projectId}/hooks`)
  return response.json()
}

/**
 * Get project MCP servers
 * @param {string} projectId - Project identifier
 * @returns {Promise<Object>} - { mcpServers: [], warnings: [] }
 */
export async function getProjectMcp(projectId) {
  const response = await fetchWithTimeout(`${BASE_URL}/api/projects/${projectId}/mcp`)
  return response.json()
}

/**
 * Get user agents
 * @returns {Promise<Object>} - { agents: [], warnings: [] }
 */
export async function getUserAgents() {
  const response = await fetchWithTimeout(`${BASE_URL}/api/user/agents`)
  return response.json()
}

/**
 * Get user commands
 * @returns {Promise<Object>} - { commands: [], warnings: [] }
 */
export async function getUserCommands() {
  const response = await fetchWithTimeout(`${BASE_URL}/api/user/commands`)
  return response.json()
}

/**
 * Get user hooks
 * @returns {Promise<Object>} - { hooks: [], warnings: [] }
 */
export async function getUserHooks() {
  const response = await fetchWithTimeout(`${BASE_URL}/api/user/hooks`)
  return response.json()
}

/**
 * Get user MCP servers
 * @returns {Promise<Object>} - { mcp: [], warnings: [] }
 */
export async function getUserMcp() {
  const response = await fetchWithTimeout(`${BASE_URL}/api/user/mcp`)
  return response.json()
}

/**
 * Health check endpoint
 * @returns {Promise<Object>} - { status: string }
 */
export async function healthCheck() {
  const response = await fetchWithTimeout(`${BASE_URL}/api/health`)
  return response.json()
}

// Default export with all API functions
export default {
  BASE_URL,
  getProjects,
  scanProjects,
  getProjectAgents,
  getProjectCommands,
  getProjectHooks,
  getProjectMcp,
  getUserAgents,
  getUserCommands,
  getUserHooks,
  getUserMcp,
  healthCheck
}
