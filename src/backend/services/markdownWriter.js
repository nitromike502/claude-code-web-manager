/**
 * Markdown Writer Service
 * Handles writing agent markdown files with YAML frontmatter
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

/**
 * Writes an agent markdown file with YAML frontmatter
 * @param {string} filePath - Absolute path to the agent file
 * @param {Object} agentData - Agent data object
 * @param {string} agentData.name - Agent name
 * @param {string} agentData.description - Agent description (content)
 * @param {string} agentData.model - Model identifier
 * @param {Array<string>} [agentData.tools] - Optional array of tool names
 * @param {string} [agentData.color] - Optional color
 * @param {Object} [agentData.yamlFrontmatter] - Optional additional YAML fields
 * @returns {Promise<Object>} Object with success status and path
 */
async function writeAgentFile(filePath, agentData) {
  try {
    // Build YAML frontmatter object
    const frontmatter = {
      name: agentData.name,
      model: agentData.model
    };

    // Add optional fields
    if (agentData.tools && agentData.tools.length > 0) {
      frontmatter.tools = agentData.tools;
    }

    if (agentData.color) {
      frontmatter.color = agentData.color;
    }

    // Merge any additional YAML frontmatter fields
    if (agentData.yamlFrontmatter && typeof agentData.yamlFrontmatter === 'object') {
      Object.assign(frontmatter, agentData.yamlFrontmatter);
    }

    // Generate YAML string
    const yamlString = yaml.dump(frontmatter, {
      lineWidth: -1, // Don't wrap lines
      noRefs: true   // Don't use references
    });

    // Build markdown content
    const markdownContent = [
      '---',
      yamlString.trim(),
      '---',
      '',
      '# Description',
      '',
      agentData.description || ''
    ].join('\n');

    // Ensure parent directory exists
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });

    // Write file
    await fs.writeFile(filePath, markdownContent, 'utf-8');

    return {
      success: true,
      path: filePath
    };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error writing agent file ${filePath}:`, error.message);

    return {
      success: false,
      error: error.message,
      path: filePath
    };
  }
}

module.exports = {
  writeAgentFile
};
