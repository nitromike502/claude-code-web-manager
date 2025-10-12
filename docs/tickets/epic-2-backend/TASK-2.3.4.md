# TASK-2.3.4: Create Project Scanner Utility

**Epic:** EPIC-2
**Story:** Story 2.3 - File System Utilities & Parsers
**Status:** Pending
**Priority:** CRITICAL
**Assigned To:** backend-architect
**Dependencies:** TASK-2.3.3

## Description

Create utility for scanning and discovering Claude Code projects from ~/.claude.json. Validate that project directories exist and return project list with metadata.

## Acceptance Criteria

- [ ] src/backend/utils/projectScanner.js created
- [ ] Reads ~/.claude.json
- [ ] Parses projects object (keys are paths)
- [ ] Validates project directories exist
- [ ] Returns project list with metadata
- [ ] Generates project IDs for API routing
- [ ] Handles missing ~/.claude.json gracefully
- [ ] Tested: scanProjects() returns project list from ~/.claude.json
- [ ] Tested: generateProjectId() creates valid URL-safe IDs
- [ ] Tested: getProjectById() finds project by ID
- [ ] Tested: Error handling works when ~/.claude.json missing
- [ ] Tested: Project directory existence validation works

## Implementation Notes

Create src/backend/utils/projectScanner.js:

```javascript
const path = require('path');
const { parseClaudeConfig } = require('./jsonParser');
const { dirExists, expandHome } = require('./fileUtils');

/**
 * Generate project ID from path
 * Removes slashes and special characters for use in URLs
 */
function generateProjectId(projectPath) {
  return projectPath
    .replace(/[\/\\]/g, '') // Remove slashes
    .replace(/[^a-zA-Z0-9]/g, '') // Remove special chars
    .toLowerCase();
}

/**
 * Scan all Claude Code projects from ~/.claude.json
 * Returns array of project objects with metadata
 */
async function scanProjects() {
  // Read ~/.claude.json
  const configResult = await parseClaudeConfig('~/.claude.json');

  if (!configResult.success) {
    return {
      success: false,
      projects: [],
      error: configResult.error
    };
  }

  const projects = [];
  const projectPaths = Object.keys(configResult.data.projects || {});

  // Check each project directory exists
  for (const projectPath of projectPaths) {
    const expandedPath = expandHome(projectPath);
    const exists = await dirExists(expandedPath);

    const project = {
      id: generateProjectId(projectPath),
      path: projectPath,
      expandedPath: expandedPath,
      exists: exists,
      name: path.basename(projectPath),
      // Count stats will be added by service layer
      agentsCount: 0,
      commandsCount: 0,
      hooksCount: 0,
      mcpCount: 0
    };

    projects.push(project);
  }

  return {
    success: true,
    projects,
    error: null
  };
}

/**
 * Get single project by ID
 */
async function getProjectById(projectId) {
  const result = await scanProjects();

  if (!result.success) {
    return { success: false, project: null, error: result.error };
  }

  const project = result.projects.find(p => p.id === projectId);

  if (!project) {
    return {
      success: false,
      project: null,
      error: `Project not found: ${projectId}`
    };
  }

  return {
    success: true,
    project,
    error: null
  };
}

/**
 * Refresh project list (re-scan ~/.claude.json)
 * Same as scanProjects, but can be called via API endpoint
 */
async function refreshProjects() {
  return scanProjects();
}

module.exports = {
  generateProjectId,
  scanProjects,
  getProjectById,
  refreshProjects
};
```

Test the scanner:
```javascript
const { scanProjects } = require('./projectScanner');

(async () => {
  const result = await scanProjects();
  console.log(JSON.stringify(result, null, 2));
})();
```

## References

- PRD Section 2.1: Project Discovery (lines 33-57)
- CLAUDE.md: Data Sources (~/.claude.json)
- API endpoint: POST /api/projects/scan (trigger refresh)
