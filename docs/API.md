# Claude Code Manager - API Documentation

Complete API reference for the Claude Code Manager backend.

**Base URL:** `http://localhost:8420/api`

**Version:** 1.0.0 (Phase 1 MVP)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Response Format](#response-format)
3. [Error Handling](#error-handling)
4. [Endpoints](#endpoints)
   - [Health Check](#health-check)
   - [Projects](#projects)
   - [User Configuration](#user-configuration)

---

## Authentication

**Phase 1 MVP:** No authentication required. This is a local-only tool designed to run on `localhost`.

**Future Phases:** Authentication may be added for remote access scenarios.

---

## Response Format

All API responses follow a consistent JSON structure:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## Error Handling

### HTTP Status Codes

- **200 OK** - Request succeeded
- **404 Not Found** - Resource not found (project ID, file, etc.)
- **500 Internal Server Error** - Server error (file read error, parsing error, etc.)

### Common Error Scenarios

1. **Project Not Found**
   ```json
   {
     "success": false,
     "error": "Project not found: homeuserprojectsmyapp"
   }
   ```

2. **Project Directory Missing**
   ```json
   {
     "success": false,
     "error": "Project directory does not exist: /home/user/projects/myapp"
   }
   ```

3. **File Parsing Error**
   ```json
   {
     "success": false,
     "error": "Failed to parse JSON: Unexpected token..."
   }
   ```

### Graceful Degradation

- Missing files (agents, commands, hooks, MCP) return **empty arrays**, not errors
- Invalid project paths are marked with `exists: false` in the response
- Malformed YAML/JSON files throw descriptive parsing errors

---

## Endpoints

### Health Check

#### `GET /api/health`

Returns server health status and version information.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-10-07T12:34:56.789Z",
  "version": "1.0.0",
  "service": "Claude Code Manager Backend"
}
```

**Use Case:** Check if the server is running and responsive.

---

## Projects

### List All Projects

#### `GET /api/projects`

Returns all Claude Code projects discovered from `~/.claude.json`.

**Response:**
```json
{
  "success": true,
  "projects": {
    "homeuserprojectsmyapp": {
      "id": "homeuserprojectsmyapp",
      "path": "/home/user/projects/myapp",
      "name": "myapp",
      "exists": true,
      "config": {},
      "counts": {
        "agents": 5,
        "commands": 12,
        "hooks": 3,
        "mcp": 2
      }
    },
    "homeuserprojectsanother": {
      "id": "homeuserprojectsanother",
      "path": "/home/user/projects/another",
      "name": "another",
      "exists": true,
      "config": {},
      "counts": {
        "agents": 0,
        "commands": 5,
        "hooks": 0,
        "mcp": 1
      }
    }
  },
  "error": null
}
```

**Response Fields:**
- `id` (string) - URL-safe project identifier (path with special chars removed)
- `path` (string) - Absolute file system path to project
- `name` (string) - Project name (derived from directory name)
- `exists` (boolean) - Whether the project directory exists
- `config` (object) - Additional project configuration from `~/.claude.json`
- `counts` (object) - Count of agents, commands, hooks, and MCP servers

**Notes:**
- Projects are cached in memory (use `/api/projects/scan` to refresh)
- Counts are calculated by scanning each project's `.claude/` directory
- Non-existent projects are included with `exists: false`

---

### Rescan Projects

#### `POST /api/projects/scan`

Triggers a rescan of `~/.claude.json` to refresh the project list.

**Response:**
```json
{
  "success": true,
  "projectCount": 10,
  "error": null
}
```

**Use Case:** Call after adding/removing projects in `~/.claude.json` or when project directories change.

**Note:** Clears the in-memory project cache and re-reads from the file system.

---

### Get Project Agents

#### `GET /api/projects/:projectId/agents`

Returns all subagents for a specific project from `.claude/agents/*.md`.

**Parameters:**
- `projectId` (string) - URL-safe project identifier

**Response:**
```json
{
  "success": true,
  "agents": [
    {
      "name": "backend-architect",
      "file": "backend-architect.md",
      "path": "/absolute/path/to/.claude/agents/backend-architect.md",
      "frontmatter": {
        "description": "Expert backend architect specializing in API design",
        "capabilities": ["node", "express", "rest-api"]
      },
      "content": "# Backend Architect\n\nYou are an expert backend architect...",
      "description": "Expert backend architect specializing in API design"
    }
  ],
  "projectId": "homeuserprojectsmyapp",
  "projectPath": "/home/user/projects/myapp"
}
```

**Response Fields (per agent):**
- `name` (string) - Agent name (filename without .md)
- `file` (string) - Filename with extension
- `path` (string) - Absolute path to agent file
- `frontmatter` (object) - Parsed YAML frontmatter (between `---` delimiters)
- `content` (string) - Full markdown content including frontmatter
- `description` (string) - From frontmatter or empty string

**Notes:**
- Returns empty array if `.claude/agents/` directory doesn't exist
- Parses YAML frontmatter using `gray-matter` library
- Only includes `.md` files

---

### Get Project Commands

#### `GET /api/projects/:projectId/commands`

Returns all slash commands for a project from `.claude/commands/**/*.md` (supports nested directories).

**Parameters:**
- `projectId` (string) - URL-safe project identifier

**Response:**
```json
{
  "success": true,
  "commands": [
    {
      "name": "git/commit",
      "file": "git/commit.md",
      "path": "/absolute/path/to/.claude/commands/git/commit.md",
      "frontmatter": {
        "description": "Create a git commit with conventional commit format"
      },
      "content": "Creates a git commit following conventional commit standards...",
      "description": "Create a git commit with conventional commit format"
    },
    {
      "name": "docs",
      "file": "docs.md",
      "path": "/absolute/path/to/.claude/commands/docs.md",
      "frontmatter": {},
      "content": "Review and update project documentation...",
      "description": ""
    }
  ],
  "projectId": "homeuserprojectsmyapp",
  "projectPath": "/home/user/projects/myapp"
}
```

**Response Fields (per command):**
- `name` (string) - Command name with path (e.g., "git/commit" for nested commands)
- `file` (string) - Relative path from `.claude/commands/`
- `path` (string) - Absolute path to command file
- `frontmatter` (object) - Parsed YAML frontmatter
- `content` (string) - Full markdown content
- `description` (string) - From frontmatter or empty string

**Notes:**
- Supports nested directory structures (e.g., `git/commit.md`, `git/push.md`)
- Returns empty array if `.claude/commands/` directory doesn't exist
- Command name includes directory path for organization

---

### Get Project Hooks

#### `GET /api/projects/:projectId/hooks`

Returns all hooks from `.claude/settings.json` and `.claude/settings.local.json`.

**Parameters:**
- `projectId` (string) - URL-safe project identifier

**Response:**
```json
{
  "success": true,
  "hooks": [
    {
      "event": "on_code_change",
      "matcher": "*.js",
      "action": "lint",
      "source": "settings.json"
    },
    {
      "event": "before_commit",
      "action": "test",
      "source": "settings.local.json"
    }
  ],
  "projectId": "homeuserprojectsmyapp",
  "projectPath": "/home/user/projects/myapp"
}
```

**Response Fields (per hook):**
- `event` (string) - Hook event name
- `matcher` (string, optional) - File pattern matcher
- `action` (string) - Action to execute
- `source` (string) - Which settings file the hook came from

**Notes:**
- Merges hooks from both `settings.json` and `settings.local.json`
- Local settings take precedence over project settings
- Returns empty array if no hooks configured

---

### Get Project MCP Servers

#### `GET /api/projects/:projectId/mcp`

Returns all MCP servers from `.mcp.json` at the project root.

**Parameters:**
- `projectId` (string) - URL-safe project identifier

**Response:**
```json
{
  "success": true,
  "mcp": [
    {
      "name": "filesystem",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed"],
      "env": {},
      "source": ".mcp.json"
    },
    {
      "name": "sqlite",
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "/path/to/db.sqlite"],
      "source": ".mcp.json"
    }
  ],
  "projectId": "homeuserprojectsmyapp",
  "projectPath": "/home/user/projects/myapp"
}
```

**Response Fields (per MCP server):**
- `name` (string) - MCP server name
- `command` (string) - Command to execute
- `args` (array) - Command arguments
- `env` (object, optional) - Environment variables
- `source` (string) - Configuration file source

**Notes:**
- Reads from `.mcp.json` in project root
- Returns empty array if `.mcp.json` doesn't exist
- MCP servers are defined at project level, not in `.claude/` directory

---

## User Configuration

User-level configurations are stored in the home directory (`~/.claude/`).

### Get User Agents

#### `GET /api/user/agents`

Returns user-level subagents from `~/.claude/agents/*.md`.

**Response:** Same format as project agents (see [Get Project Agents](#get-project-agents))

---

### Get User Commands

#### `GET /api/user/commands`

Returns user-level slash commands from `~/.claude/commands/**/*.md`.

**Response:** Same format as project commands (see [Get Project Commands](#get-project-commands))

---

### Get User Hooks

#### `GET /api/user/hooks`

Returns user-level hooks from `~/.claude/settings.json`.

**Response:** Same format as project hooks (see [Get Project Hooks](#get-project-hooks))

---

### Get User MCP Servers

#### `GET /api/user/mcp`

Returns user-level MCP servers from `~/.claude/settings.json` (MCP servers section).

**Response:** Same format as project MCP servers (see [Get Project MCP Servers](#get-project-mcp-servers))

**Note:** User MCP servers are typically defined in `~/.claude/settings.json` under an MCP section, not in a separate `.mcp.json` file.

---

## Project ID Format

Project IDs are derived from absolute file paths by removing special characters to create URL-safe identifiers:

**Examples:**
```
/home/user/projects/myapp        → homeuserprojectsmyapp
C:\Users\user\projects\myapp     → Cusersuserprojectsmyapp
/Users/user/projects/my-app      → Usersuserprojectsmyapp
```

**Algorithm:**
1. Take absolute project path
2. Remove all non-alphanumeric characters (slashes, backslashes, dashes, etc.)
3. Result is URL-safe project identifier

**Reverse Lookup:**
The backend maintains a mapping of project IDs to paths in memory (from `~/.claude.json`), so IDs can be resolved back to paths for file operations.

---

## Data Parsing

### Markdown Files (Agents & Commands)

Files are parsed using `gray-matter` library:
1. Extract YAML frontmatter between `---` delimiters
2. Parse frontmatter as YAML
3. Return both parsed frontmatter and full content

**Example:**
```markdown
---
description: Expert backend architect
capabilities:
  - node
  - express
---

# Backend Architect

You are an expert backend architect...
```

**Parsed Result:**
```json
{
  "frontmatter": {
    "description": "Expert backend architect",
    "capabilities": ["node", "express"]
  },
  "content": "---\ndescription: Expert backend architect\n...\n\nYou are an expert backend architect..."
}
```

### JSON Files (Settings & MCP)

Files are parsed as standard JSON:
1. Read file contents
2. Parse with `JSON.parse()`
3. Extract relevant sections (hooks, MCP servers, etc.)

---

## CORS Configuration

CORS is enabled for all origins to support local development:
```javascript
app.use(cors());
```

**Production Note:** In a production deployment, restrict CORS to specific origins.

---

## Caching Strategy

**Project List Cache:**
- Projects are cached in memory on first request to `/api/projects`
- Cache is cleared when `/api/projects/scan` is called
- Cache persists until server restart or manual refresh

**Why Caching:**
- Reduces file system reads
- Improves response time
- Acceptable for MVP (manual refresh available)

**Future Enhancement:** File watching to auto-refresh cache on file system changes.

---

## Security Considerations

### Path Traversal Prevention
All file paths are validated to prevent directory traversal attacks:
- Paths must resolve within allowed directories (project paths, `~/.claude/`)
- Relative paths like `../../../etc/passwd` are rejected

### No Authentication (Phase 1)
- Designed for local-only use on `localhost`
- No authentication or authorization required
- Do not expose to network without adding authentication

### Input Validation
- Project IDs are validated against discovered project list
- Invalid IDs return 404 error
- File paths are sanitized before file system access

---

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:8420/api/health

# Get all projects
curl http://localhost:8420/api/projects

# Rescan projects
curl -X POST http://localhost:8420/api/projects/scan

# Get project agents (replace PROJECT_ID)
curl http://localhost:8420/api/projects/PROJECT_ID/agents

# Get user agents
curl http://localhost:8420/api/user/agents
```

### Using Browser Console

```javascript
// Get all projects
fetch('/api/projects')
  .then(r => r.json())
  .then(data => console.log(data));

// Get project agents
fetch('/api/projects/homeuserprojectsmyapp/agents')
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## Future API Enhancements (Phase 2+)

### CRUD Operations
- `POST /api/projects/:id/agents` - Create new agent
- `PUT /api/projects/:id/agents/:name` - Update agent
- `DELETE /api/projects/:id/agents/:name` - Delete agent
- Similar endpoints for commands, hooks, and MCP servers

### Validation
- `POST /api/projects/:id/validate` - Validate all configurations
- `POST /api/projects/:id/agents/:name/validate` - Validate single agent

### Real-time Updates
- WebSocket support for live configuration updates
- File system watching for automatic cache refresh

### Search & Filter
- `GET /api/search?q=query` - Full-text search across all configurations
- Query parameters for filtering by type, project, etc.

---

## Support

For issues or questions about the API:
1. Check server logs for error details
2. Verify file paths and permissions
3. Ensure `~/.claude.json` is properly formatted
4. Review this documentation for correct endpoint usage
5. Report issues with detailed error messages and reproduction steps
