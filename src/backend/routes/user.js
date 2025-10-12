const express = require('express');
const router = express.Router();
const {
  getUserAgents,
  getUserCommands,
  getUserHooks,
  getUserMCP
} = require('../services/projectDiscovery');

/**
 * GET /api/user/agents
 * Returns user-level subagents from ~/.claude/agents/
 */
router.get('/agents', async (req, res) => {
  try {
    const result = await getUserAgents();

    res.json({
      success: true,
      agents: result.agents,
      warnings: result.warnings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/user/commands
 * Returns user-level slash commands from ~/.claude/commands/
 */
router.get('/commands', async (req, res) => {
  try {
    const commands = await getUserCommands();

    res.json({
      success: true,
      commands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/user/hooks
 * Returns user-level hooks from ~/.claude/settings.json
 */
router.get('/hooks', async (req, res) => {
  try {
    const hooks = await getUserHooks();

    res.json({
      success: true,
      hooks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/user/mcp
 * Returns user-level MCP servers from ~/.claude/settings.json
 */
router.get('/mcp', async (req, res) => {
  try {
    const mcp = await getUserMCP();

    res.json({
      success: true,
      mcp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
