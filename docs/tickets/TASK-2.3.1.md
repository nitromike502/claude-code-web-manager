# TASK-2.3.1: Create File System Utilities

**Epic:** EPIC-2
**Story:** Story 2.3 - File System Utilities & Parsers
**Status:** Pending
**Priority:** CRITICAL
**Assigned To:** backend-architect
**Dependencies:** TASK-2.1.3

## Description

Create utility functions for safe file system operations including home directory expansion, safe file reading with error handling, and directory scanning.

## Acceptance Criteria

- [ ] src/backend/utils/fileUtils.js created
- [ ] Home directory expansion works (~/)
- [ ] Safe file reading with try-catch
- [ ] Directory exists check function
- [ ] Recursive directory scanning function
- [ ] All functions handle errors gracefully
- [ ] Functions return consistent error format

## Implementation Notes

Create src/backend/utils/fileUtils.js:

```javascript
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

/**
 * Expand home directory in path (~/ -> /home/user/)
 */
function expandHome(filepath) {
  if (filepath.startsWith('~/') || filepath === '~') {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}

/**
 * Safely read file contents, return null on error
 */
async function readFileSafe(filepath) {
  try {
    const expandedPath = expandHome(filepath);
    const content = await fs.readFile(expandedPath, 'utf8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if directory exists
 */
async function dirExists(dirpath) {
  try {
    const expandedPath = expandHome(dirpath);
    const stats = await fs.stat(expandedPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if file exists
 */
async function fileExists(filepath) {
  try {
    const expandedPath = expandHome(filepath);
    const stats = await fs.stat(expandedPath);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * Recursively scan directory for files matching pattern
 */
async function scanDirectory(dirpath, pattern = null) {
  const results = [];
  const expandedPath = expandHome(dirpath);

  try {
    const entries = await fs.readdir(expandedPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(expandedPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        const subResults = await scanDirectory(fullPath, pattern);
        results.push(...subResults);
      } else if (entry.isFile()) {
        // Check if file matches pattern (if provided)
        if (!pattern || entry.name.match(pattern)) {
          results.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Return empty array on error (directory doesn't exist, no permission, etc.)
  }

  return results;
}

module.exports = {
  expandHome,
  readFileSafe,
  dirExists,
  fileExists,
  scanDirectory
};
```

## References

- PRD Section 4.1: Backend Requirements (file system operations)
- Node.js fs/promises API
- Node.js os.homedir()
