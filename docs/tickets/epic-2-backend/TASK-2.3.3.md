# TASK-2.3.3: Create JSON Parser Utility

**Epic:** EPIC-2
**Story:** Story 2.3 - File System Utilities & Parsers
**Status:** Pending
**Priority:** HIGH
**Assigned To:** backend-architect
**Dependencies:** TASK-2.3.1

## Description

Create utility for safely parsing JSON files with comprehensive error handling. Return meaningful error messages for malformed JSON, missing files, and empty files.

## Acceptance Criteria

- [ ] src/backend/utils/jsonParser.js created
- [ ] Safe JSON parsing with try-catch
- [ ] Handles missing files gracefully
- [ ] Handles empty files gracefully
- [ ] Handles malformed JSON gracefully
- [ ] Returns meaningful error messages
- [ ] Returns consistent data structure

## Implementation Notes

Create src/backend/utils/jsonParser.js:

```javascript
const { readFileSafe } = require('./fileUtils');

/**
 * Safely parse JSON file
 * Returns { success, data, error }
 */
async function parseJSONFile(filepath) {
  // Read file
  const readResult = await readFileSafe(filepath);

  if (!readResult.success) {
    return {
      success: false,
      data: null,
      error: `Failed to read file: ${readResult.error}`
    };
  }

  // Handle empty file
  if (!readResult.content.trim()) {
    return {
      success: false,
      data: null,
      error: 'File is empty'
    };
  }

  // Parse JSON
  try {
    const data = JSON.parse(readResult.content);
    return {
      success: true,
      data,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: `Invalid JSON: ${error.message}`
    };
  }
}

/**
 * Safely parse JSON string
 */
function parseJSONString(jsonString) {
  if (!jsonString || !jsonString.trim()) {
    return {
      success: false,
      data: null,
      error: 'Empty JSON string'
    };
  }

  try {
    const data = JSON.parse(jsonString);
    return {
      success: true,
      data,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: `Invalid JSON: ${error.message}`
    };
  }
}

/**
 * Parse .claude.json (project list)
 */
async function parseClaudeConfig(filepath = '~/.claude.json') {
  const result = await parseJSONFile(filepath);

  if (!result.success) {
    return result;
  }

  // Validate structure
  if (!result.data.projects || typeof result.data.projects !== 'object') {
    return {
      success: false,
      data: null,
      error: '.claude.json is missing "projects" object'
    };
  }

  return {
    success: true,
    data: result.data,
    error: null
  };
}

/**
 * Parse .mcp.json (MCP servers)
 */
async function parseMCPConfig(filepath) {
  const result = await parseJSONFile(filepath);

  if (!result.success) {
    return result;
  }

  // Validate structure (mcpServers object)
  if (!result.data.mcpServers || typeof result.data.mcpServers !== 'object') {
    return {
      success: false,
      data: null,
      error: '.mcp.json is missing "mcpServers" object'
    };
  }

  return {
    success: true,
    data: result.data.mcpServers,
    error: null
  };
}

/**
 * Parse settings.json (hooks, user MCP servers)
 */
async function parseSettings(filepath) {
  const result = await parseJSONFile(filepath);

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: result.data,
    error: null
  };
}

module.exports = {
  parseJSONFile,
  parseJSONString,
  parseClaudeConfig,
  parseMCPConfig,
  parseSettings
};
```

## References

- PRD Section 2.1: Project Discovery (~/.claude.json)
- PRD Section 2.5: Hooks (settings.json)
- PRD Section 2.6: MCP Servers (.mcp.json, settings.json)
