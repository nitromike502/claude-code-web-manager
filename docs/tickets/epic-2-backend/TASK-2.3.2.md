# TASK-2.3.2: Create Markdown Parser Utility

**Epic:** EPIC-2
**Story:** Story 2.3 - File System Utilities & Parsers
**Status:** Pending
**Priority:** CRITICAL
**Assigned To:** backend-architect
**Dependencies:** TASK-2.1.2, TASK-2.3.1

## Description

Create utility for parsing markdown files with YAML frontmatter (used for subagents and slash commands). Handle files without frontmatter and malformed YAML gracefully.

## Acceptance Criteria

- [ ] src/backend/utils/markdownParser.js created
- [ ] Parses YAML frontmatter using gray-matter
- [ ] Parses markdown content using marked
- [ ] Handles files without frontmatter
- [ ] Handles malformed YAML gracefully
- [ ] Returns consistent data structure
- [ ] Extracts common fields (name, description, tools, model)

## Implementation Notes

Create src/backend/utils/markdownParser.js:

```javascript
const matter = require('gray-matter');
const { marked } = require('marked');

/**
 * Parse markdown file with YAML frontmatter
 * Returns { frontmatter, content, html, error }
 */
function parseMarkdown(fileContent) {
  try {
    // Parse frontmatter and content
    const parsed = matter(fileContent);

    // Convert markdown to HTML (optional, for rendering)
    const html = marked(parsed.content);

    return {
      success: true,
      frontmatter: parsed.data || {},
      content: parsed.content,
      html: html,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      frontmatter: {},
      content: fileContent,
      html: null,
      error: error.message
    };
  }
}

/**
 * Parse subagent file specifically
 * Extracts common agent fields
 */
function parseAgent(fileContent) {
  const result = parseMarkdown(fileContent);

  if (!result.success) {
    return result;
  }

  // Extract common agent fields from frontmatter
  const agent = {
    name: result.frontmatter.name || 'Unnamed Agent',
    description: result.frontmatter.description || '',
    tools: result.frontmatter.tools || [],
    model: result.frontmatter.model || 'default',
    systemPrompt: result.content,
    ...result.frontmatter // Include all other frontmatter fields
  };

  return {
    success: true,
    agent,
    html: result.html,
    error: null
  };
}

/**
 * Parse slash command file specifically
 * Commands may not have frontmatter
 */
function parseCommand(fileContent) {
  const result = parseMarkdown(fileContent);

  if (!result.success) {
    return result;
  }

  // Extract command info
  const command = {
    description: result.frontmatter.description || extractFirstLine(result.content),
    content: result.content,
    ...result.frontmatter
  };

  return {
    success: true,
    command,
    html: result.html,
    error: null
  };
}

/**
 * Extract first non-empty line from content
 */
function extractFirstLine(content) {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      return trimmed;
    }
  }
  return '';
}

module.exports = {
  parseMarkdown,
  parseAgent,
  parseCommand
};
```

Test the parser:
```javascript
const { parseAgent } = require('./markdownParser');

const testContent = `---
name: test-agent
description: A test agent
tools: [Read, Write]
model: claude-3-sonnet
---

You are a test agent.
Do test things.
`;

const result = parseAgent(testContent);
console.log(result);
```

## References

- PRD Section 2.3: Subagent Viewing (markdown with frontmatter)
- PRD Section 2.4: Slash Command Viewing (markdown files)
- gray-matter documentation
- marked documentation
