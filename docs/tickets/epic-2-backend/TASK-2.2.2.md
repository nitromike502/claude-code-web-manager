# TASK-2.2.2: Configure Static File Serving

**Epic:** EPIC-2
**Story:** Story 2.2 - Express Server Setup
**Status:** Pending
**Priority:** HIGH
**Assigned To:** backend-architect
**Dependencies:** TASK-2.2.1

## Description

Configure Express to serve the frontend files (HTML, CSS, JS) from the src/frontend/ directory as static assets.

## Acceptance Criteria

- [ ] Static file serving configured for src/frontend/
- [ ] index.html route configured
- [ ] MIME types handled correctly
- [ ] 404 fallback to index.html (for Vue Router SPA routing)
- [ ] Static files accessible at http://localhost:8420

## Implementation Notes

This is already partially implemented in TASK-2.2.1, but verify:

```javascript
// In server.js
const path = require('path');

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Root route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// SPA fallback - redirect all non-API routes to index.html
// (This allows Vue Router to handle routing)
app.get('*', (req, res) => {
  // Only if route doesn't start with /api
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});
```

Create placeholder index.html for testing:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Claude Code Manager</title>
</head>
<body>
  <h1>Claude Code Manager</h1>
  <p>Frontend will be implemented here.</p>
</body>
</html>
```

Test:
```bash
npm start
curl http://localhost:8420/
# Should return index.html
```

Note: The order matters - API routes must be registered before the catch-all route.

## References

- PRD Section 4.2: Frontend Requirements (CDN-hosted Vue)
- Express static file serving docs
