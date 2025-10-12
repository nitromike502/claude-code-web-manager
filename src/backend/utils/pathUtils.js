const path = require('path');
const os = require('os');

/**
 * Expands ~ to home directory in file paths
 * Respects process.env.HOME for testing purposes
 * @param {string} filePath - Path that may contain ~
 * @returns {string} Expanded absolute path
 */
function expandHome(filePath) {
  if (!filePath) return filePath;

  if (filePath.startsWith('~/') || filePath === '~') {
    // Use process.env.HOME if set (for testing), otherwise use os.homedir()
    const homeDir = process.env.HOME || os.homedir();
    return path.join(homeDir, filePath.slice(2));
  }

  return filePath;
}

/**
 * Converts a project path to a projectId (removes slashes and special chars)
 * Example: /home/user/projects/myapp -> homeuserprojectsmyapp
 * @param {string} projectPath - Full project path
 * @returns {string} Project ID
 */
function pathToProjectId(projectPath) {
  if (!projectPath) return '';

  return projectPath
    .replace(/^\//, '')           // Remove leading slash
    .replace(/\//g, '')           // Remove all slashes
    .replace(/\\/g, '')           // Remove backslashes (Windows)
    .replace(/:/g, '')            // Remove colons (Windows drive letters)
    .replace(/\s+/g, '')          // Remove spaces
    .toLowerCase();
}

/**
 * Converts a projectId back to its original path
 * Note: This requires looking up the original path from the projects map
 * @param {string} projectId - Project ID
 * @param {Object} projectsMap - Map of projectId -> projectPath
 * @returns {string|null} Original project path or null if not found
 */
function projectIdToPath(projectId, projectsMap) {
  if (!projectId || !projectsMap) return null;

  return projectsMap[projectId] || null;
}

/**
 * Validates that a directory path exists and is accessible
 * @param {string} dirPath - Directory path to validate
 * @returns {Promise<boolean>} True if valid, false otherwise
 */
async function isValidDirectory(dirPath) {
  const fs = require('fs').promises;

  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Safely joins paths and ensures they're within a base directory (security)
 * @param {string} basePath - Base directory path
 * @param {...string} pathSegments - Path segments to join
 * @returns {string} Safe joined path
 */
function safePath(basePath, ...pathSegments) {
  const fullPath = path.join(basePath, ...pathSegments);
  const normalizedFull = path.normalize(fullPath);
  const normalizedBase = path.normalize(basePath);

  // Ensure the result is within the base path (prevent directory traversal)
  if (!normalizedFull.startsWith(normalizedBase)) {
    throw new Error('Invalid path: directory traversal detected');
  }

  return normalizedFull;
}

module.exports = {
  expandHome,
  pathToProjectId,
  projectIdToPath,
  isValidDirectory,
  safePath
};
