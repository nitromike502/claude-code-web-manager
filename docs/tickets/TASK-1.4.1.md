# TASK-1.4.1: Design User Configuration Page Layout

**Epic:** EPIC-1
**Story:** Story 1.4 - User/Global Configuration View Wireframes
**Status:** Pending
**Priority:** MEDIUM
**Assigned To:** wireframe-designer
**Dependencies:** TASK-1.3.5

## Description

Design the user/global configuration page layout, reusing the project detail card layout but with visual distinction to indicate these are user-level (not project-level) configurations.

## Acceptance Criteria

- [ ] User config page layout designed
- [ ] Reuses project detail 4-card layout
- [ ] Visual distinction added (color, label, icon)
- [ ] Navigation path defined
- [ ] Page header clearly indicates "User Settings"

## Implementation Notes

Page structure:
- Reuse project detail page layout
- Same 4-card structure: User Agents, User Commands, User Hooks, User MCP Servers
- Add visual distinction to indicate global scope

Visual distinction options:
- Different header color (blue for user, default for project)
- Icon in header (user icon, globe icon)
- Label: "User Settings" or "Global Configuration"
- Badge on each card: "User" or "Global"

Page header:
- Title: "User Settings" or "Global Configuration"
- Subtitle: "~/.claude/" path
- Icon: User icon or settings icon

Card titles:
- "User Subagents" (instead of "Subagents")
- "User Slash Commands"
- "User Hooks"
- "User MCP Servers"

Data sources:
- Agents: ~/.claude/agents/*.md
- Commands: ~/.claude/commands/**/*.md
- Hooks: ~/.claude/settings.json
- MCP: ~/.claude/settings.json (mcpServers section)

## References

- PRD Section 2.7: User/Global Configuration (implied by API endpoints)
- API endpoints: /api/user/agents, /api/user/commands, etc.
