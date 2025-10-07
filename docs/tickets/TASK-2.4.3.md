# TASK-2.4.3: Create Project Config Routes

**Epic:** EPIC-2
**Story:** Story 2.4 - API Endpoint Skeleton
**Status:** Pending
**Priority:** HIGH
**Assigned To:** backend-architect
**Dependencies:** TASK-2.4.2

## Description

Create API routes for fetching project-level configurations (agents, commands, hooks, MCP servers). Initially return empty arrays until service layer is implemented.

## Acceptance Criteria

- [ ] GET /api/projects/:projectId/agents route created
- [ ] GET /api/projects/:projectId/commands route created
- [ ] GET /api/projects/:projectId/hooks route created
- [ ] GET /api/projects/:projectId/mcp route created
- [ ] projectId parameter validated
- [ ] Routes return appropriate status codes
- [ ] Mock data returned (empty arrays)
- [ ] 404 returned for invalid projectId

## Implementation Notes

Update src/backend/routes/api.js:

```javascript
const { getProjectById } = require('../utils/projectScanner');

// Get project agents
router.get('/projects/:projectId/agents', validateProjectId, async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const projectResult = await getProjectById(projectId);
    if (!projectResult.success) {
      return res.status(404).json({ error: projectResult.error });
    }

    // TODO: Implement service layer to read agents
    // For now, return empty array
    res.json({
      projectId,
      agents: [],
      count: 0
    });
  } catch (error) {
    next(error);
  }
});

// Get project commands
router.get('/projects/:projectId/commands', validateProjectId, async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const projectResult = await getProjectById(projectId);
    if (!projectResult.success) {
      return res.status(404).json({ error: projectResult.error });
    }

    // TODO: Implement service layer
    res.json({
      projectId,
      commands: [],
      count: 0
    });
  } catch (error) {
    next(error);
  }
});

// Get project hooks
router.get('/projects/:projectId/hooks', validateProjectId, async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const projectResult = await getProjectById(projectId);
    if (!projectResult.success) {
      return res.status(404).json({ error: projectResult.error });
    }

    // TODO: Implement service layer
    res.json({
      projectId,
      hooks: [],
      count: 0
    });
  } catch (error) {
    next(error);
  }
});

// Get project MCP servers
router.get('/projects/:projectId/mcp', validateProjectId, async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const projectResult = await getProjectById(projectId);
    if (!projectResult.success) {
      return res.status(404).json({ error: projectResult.error });
    }

    // TODO: Implement service layer
    res.json({
      projectId,
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
# Get agents for a project (use actual project ID from /api/projects)
curl http://localhost:8420/api/projects/homeuserprojectsmyapp/agents

# Test invalid project ID
curl http://localhost:8420/api/projects/invalid123/agents
# Should return 404
```

## References

- PRD Section 2.3-2.6: Configuration Viewing
- API endpoints for project configs
