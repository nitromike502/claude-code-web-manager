# TASK-2.1.1: Initialize package.json

**Epic:** EPIC-2
**Story:** Story 2.1 - Node.js Project Initialization
**Status:** Pending
**Priority:** HIGH
**Assigned To:** backend-architect
**Dependencies:** None

## Description

Initialize the Node.js project with package.json, setting proper metadata, scripts, and Node.js version requirements.

## Acceptance Criteria

- [ ] package.json created
- [ ] Name set to "claude-code-manager"
- [ ] Version set to "0.1.0"
- [ ] Description included
- [ ] Main entry point set to "src/backend/server.js"
- [ ] Scripts added: start, dev, test
- [ ] Node.js version requirement specified (>=16.0.0)
- [ ] Author and license fields populated

## Implementation Notes

Run npm init to create package.json:

```bash
npm init -y
```

Then edit package.json to include:

```json
{
  "name": "claude-code-manager",
  "version": "0.1.0",
  "description": "Web-based tool for managing Claude Code projects, subagents, commands, hooks, and MCP servers",
  "main": "src/backend/server.js",
  "scripts": {
    "start": "node src/backend/server.js",
    "dev": "nodemon src/backend/server.js",
    "test": "echo \"No tests yet\" && exit 0"
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "keywords": ["claude-code", "manager", "subagents", "mcp"],
  "author": "",
  "license": "MIT"
}
```

## References

- PRD Section 4.1: Backend Requirements (lines 199-232)
- CLAUDE.md: Tech Stack (Node.js + Express)
