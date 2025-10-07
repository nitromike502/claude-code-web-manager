# TASK-2.2.4: Add Startup Script and Test

**Epic:** EPIC-2
**Story:** Story 2.2 - Express Server Setup
**Status:** Pending
**Priority:** HIGH
**Assigned To:** backend-architect
**Dependencies:** TASK-2.2.1, TASK-2.2.2, TASK-2.2.3

## Description

Verify npm start script works correctly and add nodemon script for development. Test that the server starts successfully and is accessible.

## Acceptance Criteria

- [ ] npm start script works
- [ ] npm run dev script works (with nodemon)
- [ ] Server starts without errors
- [ ] Port 8420 accessible
- [ ] Basic HTTP requests successful
- [ ] Server can be stopped with Ctrl+C

## Implementation Notes

Package.json scripts (should already be in TASK-2.1.1):
```json
{
  "scripts": {
    "start": "node src/backend/server.js",
    "dev": "nodemon src/backend/server.js",
    "test": "echo \"No tests yet\" && exit 0"
  }
}
```

Test npm start:
```bash
npm start
# Should see: 🚀 Claude Code Manager running at http://localhost:8420
# Press Ctrl+C to stop
```

Test npm run dev (with auto-restart):
```bash
npm run dev
# Should see nodemon start message
# Edit server.js - should auto-restart
# Press Ctrl+C to stop
```

Test HTTP requests:
```bash
# In another terminal while server is running:
curl http://localhost:8420/
# Should return index.html

curl http://localhost:8420/api/health
# Should return health check JSON
```

Test port accessibility:
```bash
lsof -i :8420
# Should show node process listening on port 8420
```

If port 8420 is already in use:
```bash
# Kill existing process
lsof -ti :8420 | xargs kill -9
```

## References

- package.json scripts documentation
- nodemon configuration
