const path = require('path');
const { expandHome, pathToProjectId, isValidDirectory } = require('../utils/pathUtils');
const { readJSON, exists, listFiles, listFilesRecursive, readMarkdownWithFrontmatter } = require('./fileReader');

/**
 * Reads and parses ~/.claude.json to get all Claude Code projects
 * @returns {Promise<Object>} Map of projectId -> projectData
 */
async function discoverProjects() {
  const claudeJsonPath = expandHome('~/.claude.json');

  try {
    const config = await readJSON(claudeJsonPath);

    if (!config || !config.projects) {
      return {
        projects: {},
        error: null
      };
    }

    // Build projects map with validation
    const projects = {};

    for (const projectPath of Object.keys(config.projects)) {
      const expandedPath = expandHome(projectPath);
      const isValid = await isValidDirectory(expandedPath);
      const projectId = pathToProjectId(expandedPath);

      projects[projectId] = {
        id: projectId,
        path: expandedPath,
        name: path.basename(expandedPath),
        exists: isValid,
        config: config.projects[projectPath]
      };
    }

    return {
      projects,
      error: null
    };
  } catch (error) {
    return {
      projects: {},
      error: error.message
    };
  }
}

/**
 * Gets subagents for a specific project
 * @param {string} projectPath - Absolute project path
 * @returns {Promise<Object>} Object with agents array and warnings array
 */
async function getProjectAgents(projectPath) {
  const agentsDir = path.join(projectPath, '.claude', 'agents');

  try {
    const files = await listFiles(agentsDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    const agents = [];
    const warnings = [];

    for (const file of mdFiles) {
      const filePath = path.join(agentsDir, file);

      try {
        const parsed = await readMarkdownWithFrontmatter(filePath);

        if (parsed) {
          agents.push({
            name: file.replace('.md', ''),
            file: file,
            path: filePath,
            frontmatter: parsed.frontmatter,
            content: parsed.content,
            description: parsed.frontmatter.description || ''
          });
        }
      } catch (parseError) {
        // Log warning for malformed file and continue processing
        console.warn(`Skipping agent file ${filePath}: ${parseError.message}`);
        warnings.push({
          file: filePath,
          error: parseError.message,
          skipped: true
        });
      }
    }

    return { agents, warnings };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { agents: [], warnings: [] }; // No agents directory
    }
    throw error;
  }
}

/**
 * Gets slash commands for a specific project (supports nested directories)
 * @param {string} projectPath - Absolute project path
 * @returns {Promise<Object>} Object with commands array and warnings array
 */
async function getProjectCommands(projectPath) {
  const commandsDir = path.join(projectPath, '.claude', 'commands');

  try {
    const files = await listFilesRecursive(commandsDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    const commands = [];
    const warnings = [];

    for (const relFile of mdFiles) {
      const filePath = path.join(commandsDir, relFile);

      try {
        const parsed = await readMarkdownWithFrontmatter(filePath);

        if (parsed) {
          // Command name is derived from file path (e.g., "git/commit.md" -> "git/commit")
          const commandName = relFile.replace('.md', '');

          commands.push({
            name: commandName,
            file: relFile,
            path: filePath,
            frontmatter: parsed.frontmatter,
            content: parsed.content,
            description: parsed.frontmatter.description || ''
          });
        }
      } catch (parseError) {
        // Log warning for malformed file and continue processing
        console.warn(`Skipping command file ${filePath}: ${parseError.message}`);
        warnings.push({
          file: filePath,
          error: parseError.message,
          skipped: true
        });
      }
    }

    return { commands, warnings };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { commands: [], warnings: [] }; // No commands directory
    }
    throw error;
  }
}

/**
 * Gets hooks for a specific project (from settings.json and settings.local.json)
 * @param {string} projectPath - Absolute project path
 * @returns {Promise<Array>} Array of hook objects
 */
async function getProjectHooks(projectPath) {
  const settingsPath = path.join(projectPath, '.claude', 'settings.json');
  const localSettingsPath = path.join(projectPath, '.claude', 'settings.local.json');

  const hooks = [];

  try {
    // Read main settings
    const settings = await readJSON(settingsPath);
    if (settings && settings.hooks) {
      hooks.push(...settings.hooks.map(hook => ({
        ...hook,
        source: 'settings.json'
      })));
    }
  } catch (error) {
    // Ignore if file doesn't exist
  }

  try {
    // Read local settings
    const localSettings = await readJSON(localSettingsPath);
    if (localSettings && localSettings.hooks) {
      hooks.push(...localSettings.hooks.map(hook => ({
        ...hook,
        source: 'settings.local.json'
      })));
    }
  } catch (error) {
    // Ignore if file doesn't exist
  }

  return hooks;
}

/**
 * Gets MCP servers for a specific project (from .mcp.json)
 * @param {string} projectPath - Absolute project path
 * @returns {Promise<Array>} Array of MCP server objects
 */
async function getProjectMCP(projectPath) {
  const mcpPath = path.join(projectPath, '.mcp.json');

  try {
    const config = await readJSON(mcpPath);

    if (!config || !config.mcpServers) {
      return [];
    }

    // Convert mcpServers object to array
    return Object.entries(config.mcpServers).map(([name, serverConfig]) => ({
      name,
      ...serverConfig,
      source: '.mcp.json'
    }));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // No MCP config
    }
    throw error;
  }
}

/**
 * Gets user-level subagents from ~/.claude/agents/
 * @returns {Promise<Object>} Object with agents array and warnings array
 */
async function getUserAgents() {
  const agentsDir = expandHome('~/.claude/agents');

  try {
    const files = await listFiles(agentsDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    const agents = [];
    const warnings = [];

    for (const file of mdFiles) {
      const filePath = path.join(agentsDir, file);

      try {
        const parsed = await readMarkdownWithFrontmatter(filePath);

        if (parsed) {
          agents.push({
            name: file.replace('.md', ''),
            file: file,
            path: filePath,
            frontmatter: parsed.frontmatter,
            content: parsed.content,
            description: parsed.frontmatter.description || ''
          });
        }
      } catch (parseError) {
        // Log warning for malformed file and continue processing
        console.warn(`Skipping user agent file ${filePath}: ${parseError.message}`);
        warnings.push({
          file: filePath,
          error: parseError.message,
          skipped: true
        });
      }
    }

    return { agents, warnings };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { agents: [], warnings: [] }; // No user agents directory
    }
    throw error;
  }
}

/**
 * Gets user-level slash commands from ~/.claude/commands/
 * @returns {Promise<Object>} Object with commands array and warnings array
 */
async function getUserCommands() {
  const commandsDir = expandHome('~/.claude/commands');

  try {
    const files = await listFilesRecursive(commandsDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    const commands = [];
    const warnings = [];

    for (const relFile of mdFiles) {
      const filePath = path.join(commandsDir, relFile);

      try {
        const parsed = await readMarkdownWithFrontmatter(filePath);

        if (parsed) {
          const commandName = relFile.replace('.md', '');

          commands.push({
            name: commandName,
            file: relFile,
            path: filePath,
            frontmatter: parsed.frontmatter,
            content: parsed.content,
            description: parsed.frontmatter.description || ''
          });
        }
      } catch (parseError) {
        // Log warning for malformed file and continue processing
        console.warn(`Skipping user command file ${filePath}: ${parseError.message}`);
        warnings.push({
          file: filePath,
          error: parseError.message,
          skipped: true
        });
      }
    }

    return { commands, warnings };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { commands: [], warnings: [] }; // No user commands directory
    }
    throw error;
  }
}

/**
 * Gets user-level hooks from ~/.claude/settings.json
 * @returns {Promise<Array>} Array of hook objects
 */
async function getUserHooks() {
  const settingsPath = expandHome('~/.claude/settings.json');

  try {
    const settings = await readJSON(settingsPath);

    if (!settings || !settings.hooks) {
      return [];
    }

    return settings.hooks.map(hook => ({
      ...hook,
      source: '~/.claude/settings.json'
    }));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // No user settings
    }
    throw error;
  }
}

/**
 * Gets user-level MCP servers from ~/.claude/settings.json
 * @returns {Promise<Array>} Array of MCP server objects
 */
async function getUserMCP() {
  const settingsPath = expandHome('~/.claude/settings.json');

  try {
    const settings = await readJSON(settingsPath);

    if (!settings || !settings.mcpServers) {
      return [];
    }

    // Convert mcpServers object to array
    return Object.entries(settings.mcpServers).map(([name, serverConfig]) => ({
      name,
      ...serverConfig,
      source: '~/.claude/settings.json'
    }));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // No user settings
    }
    throw error;
  }
}

/**
 * Counts configuration items for a project (for summary display)
 * @param {string} projectPath - Absolute project path
 * @returns {Promise<Object>} Object with counts
 */
async function getProjectCounts(projectPath) {
  try {
    const [agentsResult, commandsResult, hooks, mcp] = await Promise.all([
      getProjectAgents(projectPath),
      getProjectCommands(projectPath),
      getProjectHooks(projectPath),
      getProjectMCP(projectPath)
    ]);

    return {
      agents: agentsResult.agents.length,
      commands: commandsResult.commands.length,
      hooks: hooks.length,
      mcp: mcp.length
    };
  } catch (error) {
    return {
      agents: 0,
      commands: 0,
      hooks: 0,
      mcp: 0
    };
  }
}

module.exports = {
  discoverProjects,
  getProjectAgents,
  getProjectCommands,
  getProjectHooks,
  getProjectMCP,
  getUserAgents,
  getUserCommands,
  getUserHooks,
  getUserMCP,
  getProjectCounts
};
