# EPIC 1: Backend API Implementation

**Status:** In Progress (40% Complete)
**Priority:** High
**Dependencies:** None
**Estimated Time:** 8 hours

## Description
Implement complete backend API with all required endpoints for Phase 1 MVP. Includes project discovery, data parsing, and API route implementation.

## Success Criteria
- All API endpoints functional and tested
- Data parsers handle all config file types
- Error handling for missing/malformed files
- Cross-platform path handling (Windows/Mac/Linux)

## Stories

### Story 1.1: Project Discovery Service (COMPLETE)
- ✅ Basic Express server setup
- ✅ Read from ~/.claude.json
- ✅ Return project list

### Story 1.2: Agent Parser & API (INCOMPLETE)
**Remaining Tasks:**
- TASK-001: Implement agent markdown parser with YAML frontmatter (45 min)
- TASK-002: Create /api/projects/:id/agents endpoint (30 min)
- TASK-003: Create /api/user/agents endpoint (20 min)

### Story 1.3: Command Parser & API (INCOMPLETE)
**Remaining Tasks:**
- TASK-004: Implement command markdown parser with nested directory support (60 min)
- TASK-005: Create /api/projects/:id/commands endpoint (30 min)
- TASK-006: Create /api/user/commands endpoint (20 min)

### Story 1.4: Hooks Parser & API (INCOMPLETE)
**Remaining Tasks:**
- TASK-007: Implement hooks extractor from settings.json (45 min)
- TASK-008: Create /api/projects/:id/hooks endpoint (30 min)
- TASK-009: Create /api/user/hooks endpoint (20 min)

### Story 1.5: MCP Server Parser & API (INCOMPLETE)
**Remaining Tasks:**
- TASK-010: Implement MCP server configuration parser (45 min)
- TASK-011: Create /api/projects/:id/mcp endpoint (30 min)
- TASK-012: Create /api/user/mcp endpoint (20 min)

## Total Remaining: 12 tasks, ~7 hours
