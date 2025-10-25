# TASK-2.4.1: Create API Router

**Epic:** EPIC-2
**Story:** Story 2.4 - API Endpoint Skeleton
**Status:** Pending
**Priority:** HIGH
**Assigned To:** backend-architect
**Dependencies:** TASK-2.2.1

## Description

Create the main API router (src/backend/routes/api.js) and mount it on the Express app at /api. This will be the foundation for all API endpoints.

## Acceptance Criteria

- [ ] src/backend/routes/api.js created
- [ ] Express Router initialized
- [ ] Router imported in server.js
- [ ] Router mounted at /api
- [ ] Basic test route works
- [ ] Tested: curl command returns expected JSON response
- [ ] Tested: Response includes API name and version
- [ ] Tested: Response includes list of endpoints

## Implementation Notes

Create src/backend/routes/api.js:

```javascript
const express = require('express');
const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.json({
    name: 'Claude Code Manager API',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/projects',
      'POST /api/projects/scan',
      'GET /api/projects/:projectId/agents',
      'GET /api/projects/:projectId/commands',
      'GET /api/projects/:projectId/hooks',
      'GET /api/projects/:projectId/mcp',
      'GET /api/user/agents',
      'GET /api/user/commands',
      'GET /api/user/hooks',
      'GET /api/user/mcp'
    ]
  });
});

// Project routes will be added in next tasks
// User routes will be added in next tasks

module.exports = router;
```

Update server.js to mount router:

```javascript
// In server.js, add after middleware setup:
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);
```

Test:
```bash
npm start
curl http://localhost:8420/api
# Should return API information JSON
```

## References

- PRD Section 4.1: Backend Requirements (API endpoints)
- CLAUDE.md: API Endpoints section
