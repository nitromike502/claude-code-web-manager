# TASK-2.4.2: Create Project Routes

**Epic:** EPIC-2
**Story:** Story 2.4 - API Endpoint Skeleton
**Status:** Pending
**Priority:** HIGH
**Assigned To:** backend-architect
**Dependencies:** TASK-2.4.1, TASK-2.3.4

## Description

Create API routes for project listing and scanning. Initially return mock/empty data until service layer is implemented.

## Acceptance Criteria

- [ ] GET /api/projects route created
- [ ] POST /api/scan route created
- [ ] projectId parameter validation added
- [ ] Routes return appropriate status codes
- [ ] Mock data returned (empty arrays for now)
- [ ] Routes tested with curl

## Implementation Notes

Update src/backend/routes/api.js:

```javascript
const { scanProjects, refreshProjects } = require('../utils/projectScanner');

// Get all projects
router.get('/projects', async (req, res, next) => {
  try {
    const result = await scanProjects();

    if (!result.success) {
      return res.status(500).json({
        error: result.error
      });
    }

    res.json({
      projects: result.projects,
      count: result.projects.length
    });
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// Trigger project list refresh
router.post('/scan', async (req, res, next) => {
  try {
    const result = await refreshProjects();

    if (!result.success) {
      return res.status(500).json({
        error: result.error,
        message: 'Failed to scan projects'
      });
    }

    res.json({
      success: true,
      message: 'Projects rescanned successfully',
      count: result.projects.length
    });
  } catch (error) {
    next(error);
  }
});

// Validate projectId parameter middleware
function validateProjectId(req, res, next) {
  const { projectId } = req.params;

  if (!projectId || !/^[a-z0-9]+$/.test(projectId)) {
    return res.status(400).json({
      error: 'Invalid project ID format'
    });
  }

  next();
}

module.exports = router;
```

Test:
```bash
# Get all projects
curl http://localhost:8420/api/projects

# Trigger rescan
curl -X POST http://localhost:8420/api/scan
```

## References

- PRD Section 2.1: Project Discovery
- API endpoint: GET /api/projects
- API endpoint: POST /api/scan
