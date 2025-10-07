/**
 * Subagent Parser
 * Parses subagent markdown files with YAML frontmatter from .claude/agents/*.md
 */

const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

/**
 * Parse a single subagent markdown file
 * @param {string} filePath - Absolute path to the subagent .md file
 * @param {string} scope - 'project' or 'user'
 * @returns {Promise<Object|null>} Parsed subagent object or null on error
 */
async function parseSubagent(filePath, scope = 'project') {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = matter(content);

    // Extract frontmatter fields
    const { data, content: systemPrompt } = parsed;

    // Get filename without extension as fallback name
    const filename = path.basename(filePath, '.md');

    // Handle tools field - can be string or array
    let tools = [];
    if (data.tools) {
      if (typeof data.tools === 'string') {
        // Split by comma and trim
        tools = data.tools.split(',').map(t => t.trim()).filter(Boolean);
      } else if (Array.isArray(data.tools)) {
        tools = data.tools;
      }
    }

    return {
      name: data.name || filename,
      description: data.description || '',
      tools: tools,
      model: data.model || 'inherit',
      color: data.color || null,
      systemPrompt: systemPrompt.trim(),
      filePath: filePath,
      scope: scope
    };
  } catch (error) {
    console.error(`Error parsing subagent ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Parse all subagent files in a directory
 * @param {string} directoryPath - Absolute path to the agents directory
 * @param {string} scope - 'project' or 'user'
 * @returns {Promise<Array>} Array of parsed subagent objects
 */
async function parseAllSubagents(directoryPath, scope = 'project') {
  try {
    // Check if directory exists
    try {
      await fs.access(directoryPath);
    } catch {
      return []; // Directory doesn't exist, return empty array
    }

    const files = await fs.readdir(directoryPath);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    const subagents = await Promise.all(
      mdFiles.map(file => parseSubagent(path.join(directoryPath, file), scope))
    );

    // Filter out null results (failed parses)
    return subagents.filter(agent => agent !== null);
  } catch (error) {
    console.error(`Error reading subagents directory ${directoryPath}:`, error.message);
    return [];
  }
}

/**
 * Get both project and user subagents
 * @param {string} projectPath - Absolute path to project root
 * @param {string} userHomePath - Absolute path to user home directory
 * @returns {Promise<Object>} Object with project and user subagent arrays
 */
async function getAllSubagents(projectPath, userHomePath) {
  const projectAgentsPath = path.join(projectPath, '.claude', 'agents');
  const userAgentsPath = path.join(userHomePath, '.claude', 'agents');

  const [projectAgents, userAgents] = await Promise.all([
    parseAllSubagents(projectAgentsPath, 'project'),
    parseAllSubagents(userAgentsPath, 'user')
  ]);

  return {
    project: projectAgents,
    user: userAgents
  };
}

module.exports = {
  parseSubagent,
  parseAllSubagents,
  getAllSubagents
};
