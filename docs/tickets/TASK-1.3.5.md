# TASK-1.3.5: Design MCP Server Detail View

**Epic:** EPIC-1
**Story:** Story 1.3 - Configuration Detail Interaction Wireframes
**Status:** Pending
**Priority:** HIGH
**Assigned To:** wireframe-designer
**Dependencies:** TASK-1.3.1

## Description

Design the detail view for MCP servers, showing server name, transport type, configuration, and environment variables. Handle different transport types (stdio, HTTP, SSE).

## Acceptance Criteria

- [ ] Layout designed for MCP server properties
- [ ] Different transport types handled (stdio, HTTP, SSE)
- [ ] Command and arguments displayed clearly (stdio)
- [ ] URL displayed clearly (HTTP, SSE)
- [ ] Environment variables shown securely
- [ ] JSON configuration visible

## Implementation Notes

MCP server properties to display:
- **Server Name**: Prominent heading
- **Transport Type**: stdio / http / sse (badge)
- **Configuration**: Varies by transport type
- **Environment Variables**: Key names only (hide values for security)
- **Scope**: Project (.mcp.json) vs User (~/.claude/settings.json)
- **File Path**: Source file with copy button

Transport-specific layouts:

**stdio transport:**
- Command: Executable path
- Arguments: Array of command arguments
- Working Directory: If specified

**http transport:**
- URL: HTTP endpoint
- Headers: If specified

**sse transport:**
- URL: SSE endpoint
- Headers: If specified

Environment variables:
- Show variable names (FOO, BAR)
- Hide values (*****, or "[hidden]")
- Note: Values stored in system env, not in config

JSON display:
- Pretty-printed configuration
- Syntax highlighting
- Copy button

Example structures to handle:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": {
        "API_KEY": "[hidden]"
      }
    }
  }
}
```

## References

- PRD Section 2.6: MCP Server Viewing (lines 144-179)
- CLAUDE.md: MCP configuration in .mcp.json and settings files
