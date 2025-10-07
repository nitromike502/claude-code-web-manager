# TASK-2.2.3: Create Health Check Endpoint

**Epic:** EPIC-2
**Story:** Story 2.2 - Express Server Setup
**Status:** Pending
**Priority:** MEDIUM
**Assigned To:** backend-architect
**Dependencies:** TASK-2.2.1

## Description

Create a health check API endpoint to verify the server is running and provide basic system information.

## Acceptance Criteria

- [ ] GET /api/health endpoint created
- [ ] Returns server status, Node version, uptime
- [ ] Returns 200 status code
- [ ] JSON response format
- [ ] Endpoint tested with curl

## Implementation Notes

Add to server.js (before static file serving):

```javascript
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    node_version: process.version,
    platform: process.platform,
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
    }
  });
});
```

Test:
```bash
npm start
curl http://localhost:8420/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-10-06T20:00:00.000Z",
  "uptime": 123.456,
  "node_version": "v18.17.0",
  "platform": "linux",
  "memory": {
    "rss": "45MB",
    "heapUsed": "20MB",
    "heapTotal": "30MB"
  }
}
```

## References

- Standard health check endpoint patterns
- Node.js process API
