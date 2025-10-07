# TASK-2.2.1: Create Express Server Entry Point

**Epic:** EPIC-2
**Story:** Story 2.2 - Express Server Setup
**Status:** Pending
**Priority:** CRITICAL
**Assigned To:** backend-architect
**Dependencies:** TASK-2.1.2, TASK-2.1.3

## Description

Create the main Express server entry point (src/backend/server.js) with basic configuration including JSON middleware and CORS.

## Acceptance Criteria

- [ ] src/backend/server.js created
- [ ] Express app initialized
- [ ] JSON body parser configured
- [ ] CORS configured for frontend access
- [ ] Server listens on port 8420
- [ ] Startup message logged
- [ ] Server can be started with `npm start`

## Implementation Notes

Create src/backend/server.js:

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8420;

// Middleware
app.use(cors()); // Enable CORS for frontend API calls
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes will be added here
// app.use('/api', require('./routes/api'));

// Root route - serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Claude Code Manager running at http://localhost:${PORT}`);
  console.log(`📁 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});

module.exports = app;
```

Test server:
```bash
npm start
# Should see startup message
# Server should be accessible at http://localhost:8420
```

## References

- PRD Section 4.1: Backend Requirements (Express, port 8420)
- CLAUDE.md: Deployment (localhost:8420)
