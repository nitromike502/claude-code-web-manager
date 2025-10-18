const express = require('express');
const router = express.Router();
const path = require('path');
const { expandHome } = require('../utils/pathUtils');
const { writeAgentFile } = require('../services/markdownWriter');
const validateAgent = require('../middleware/validateAgent');

// Cache for projects (shared with projects.js via require cache)
// In production, this would be better handled via a shared state manager
let projectsCache = null;

// Helper to get projects cache
function getProjectsCache() {
  // Import here to avoid circular dependency
  const { discoverProjects } = require('../services/projectDiscovery');
  return projectsCache;
}

// Helper to set projects cache
function setProjectsCache(cache) {
  projectsCache = cache;
}

/**
 * PUT /api/projects/:projectId/agents/:agentId
 * Updates a project-level subagent
 */
router.put('/projects/:projectId/agents/:agentId', validateAgent, async (req, res) => {
  try {
    const { projectId, agentId } = req.params;
    const agentData = req.body;

    // Import discovery service to access cache
    const { discoverProjects } = require('../services/projectDiscovery');

    // Ensure projects are loaded
    if (!projectsCache) {
      const result = await discoverProjects();
      projectsCache = result;
    }

    // Find project path
    const projectData = projectsCache.projects[projectId];

    if (!projectData) {
      return res.status(404).json({
        success: false,
        error: `Project not found: ${projectId}`
      });
    }

    if (!projectData.exists) {
      return res.status(404).json({
        success: false,
        error: `Project directory does not exist: ${projectData.path}`
      });
    }

    // Build file path
    const agentFilePath = path.join(projectData.path, '.claude', 'agents', `${agentId}.md`);

    // Write agent file
    const result = await writeAgentFile(agentFilePath, agentData);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to write agent file'
      });
    }

    // Return updated agent
    res.json({
      success: true,
      agent: {
        id: agentId,
        name: agentData.name,
        description: agentData.description,
        model: agentData.model,
        tools: agentData.tools || [],
        color: agentData.color || null,
        path: result.path,
        scope: 'project'
      }
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error updating project agent:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/user/agents/:agentId
 * Updates a user-level subagent
 */
router.put('/user/agents/:agentId', validateAgent, async (req, res) => {
  try {
    const { agentId } = req.params;
    const agentData = req.body;

    // Build file path for user agent
    const userAgentsDir = expandHome('~/.claude/agents');
    const agentFilePath = path.join(userAgentsDir, `${agentId}.md`);

    // Write agent file
    const result = await writeAgentFile(agentFilePath, agentData);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to write agent file'
      });
    }

    // Return updated agent
    res.json({
      success: true,
      agent: {
        id: agentId,
        name: agentData.name,
        description: agentData.description,
        model: agentData.model,
        tools: agentData.tools || [],
        color: agentData.color || null,
        path: result.path,
        scope: 'user'
      }
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error updating user agent:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
