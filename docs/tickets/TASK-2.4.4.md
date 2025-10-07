# TASK-2.4.4: Create User Config Routes

**Epic:** EPIC-2
**Story:** Story 2.4 - API Endpoint Skeleton
**Status:** Pending
**Priority:** HIGH
**Assigned To:** backend-architect
**Dependencies:** TASK-2.4.1

## Description

Create API routes for fetching user/global configurations from ~/.claude/ directory (agents, commands, hooks, MCP servers). Initially return empty arrays until service layer is implemented.

## Acceptance Criteria

- [ ] GET /api/user/agents route created
- [ ] GET /api/user/commands route created
- [ ] GET /api/user/hooks route created
- [ ] GET /api/user/mcp route created
- [ ] Routes return appropriate status codes
- [ ] Mock data returned (empty arrays)
- [ ] Routes tested with curl

## Implementation Notes

Update src/backend/routes/api.js:

```javascript
// Get user agents
router.get('/user/agents', async (req, res, next) => {
  try {
    // TODO: Implement service layer to read ~/.claude/agents/*.md
    res.json({
      scope: 'user',
      agents: [],
      count: 0
    });
  } catch (error) {
    next(error);
  }
});

// Get user commands
router.get('/user/commands', async (req, res, next) => {
  try {
    // TODO: Implement service layer to read ~/.claude/commands/**/*.md
    res.json({
      scope: 'user',
      commands: [],
      count: 0
    });
  } catch (error) {
    next(error);
  }
});

// Get user hooks
router.get('/user/hooks', async (req, res, next) => {
  try {
    // TODO: Implement service layer to read ~/.claude/settings.json
    res.json({
      scope: 'user',
      hooks: [],
      count: 0
    });
  } catch (error) {
    next(error);
  }
});

// Get user MCP servers
router.get('/user/mcp', async (req, res, next) => {
  try {
    // TODO: Implement service layer to read ~/.claude/settings.json mcpServers
    res.json({
      scope: 'user',
      mcpServers: [],
      count: 0
    });
  } catch (error) {
    next(error);
  }
});
```

Test:
```bash
curl http://localhost:8420/api/user/agents
curl http://localhost:8420/api/user/commands
curl http://localhost:8420/api/user/hooks
curl http://localhost:8420/api/user/mcp
```

Expected response (for now):
```json
{
  "scope": "user",
  "agents": [],
  "count": 0
}
```

## References

- PRD Section 2.7: User/Global Configuration (implied)
- API endpoints for user configs
- Data sources: ~/.claude/agents/, ~/.claude/commands/, ~/.claude/settings.json
