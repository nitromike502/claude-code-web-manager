const fs = require('fs').promises;
const path = require('path');
const YAML = require('yaml');

/**
 * Reads a file and returns its contents
 * @param {string} filePath - Absolute path to file
 * @returns {Promise<string|null>} File contents or null if file doesn't exist
 */
async function readFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null; // File doesn't exist
    }
    throw error; // Re-throw other errors
  }
}

/**
 * Reads and parses a JSON file
 * @param {string} filePath - Absolute path to JSON file
 * @returns {Promise<Object|null>} Parsed JSON or null if file doesn't exist
 */
async function readJSON(filePath) {
  try {
    const content = await readFile(filePath);
    if (content === null) return null;

    return JSON.parse(content);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Reads a markdown file and extracts YAML frontmatter if present
 * @param {string} filePath - Absolute path to markdown file
 * @returns {Promise<Object|null>} Object with {frontmatter, content} or null
 */
async function readMarkdownWithFrontmatter(filePath) {
  const content = await readFile(filePath);
  if (content === null) return null;

  // Check for YAML frontmatter (between --- markers)
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (match) {
    try {
      const frontmatter = YAML.parse(match[1]);
      const markdownContent = match[2];

      return {
        frontmatter: frontmatter || {},
        content: markdownContent,
        raw: content
      };
    } catch (error) {
      throw new Error(`Invalid YAML frontmatter in ${filePath}: ${error.message}`);
    }
  }

  // No frontmatter found
  return {
    frontmatter: {},
    content: content,
    raw: content
  };
}

/**
 * Lists all files in a directory (non-recursive)
 * @param {string} dirPath - Absolute path to directory
 * @returns {Promise<string[]>} Array of file names (not full paths)
 */
async function listFiles(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isFile())
      .map(entry => entry.name);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // Directory doesn't exist
    }
    throw error;
  }
}

/**
 * Lists all files in a directory recursively
 * @param {string} dirPath - Absolute path to directory
 * @param {string} [relativePath=''] - Internal parameter for tracking relative path
 * @returns {Promise<string[]>} Array of relative file paths
 */
async function listFilesRecursive(dirPath, relativePath = '') {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relPath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await listFilesRecursive(fullPath, relPath);
        files.push(...subFiles);
      } else {
        files.push(relPath);
      }
    }

    return files;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // Directory doesn't exist
    }
    throw error;
  }
}

/**
 * Checks if a file or directory exists
 * @param {string} filePath - Absolute path to check
 * @returns {Promise<boolean>} True if exists, false otherwise
 */
async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets file stats (size, modified time, etc.)
 * @param {string} filePath - Absolute path to file
 * @returns {Promise<Object|null>} File stats or null if doesn't exist
 */
async function getStats(filePath) {
  try {
    return await fs.stat(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

module.exports = {
  readFile,
  readJSON,
  readMarkdownWithFrontmatter,
  listFiles,
  listFilesRecursive,
  exists,
  getStats
};
