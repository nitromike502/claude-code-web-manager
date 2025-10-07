# TASK-2.5.1: Create Error Handler Middleware

**Epic:** EPIC-2
**Story:** Story 2.5 - Error Handling Framework
**Status:** Pending
**Priority:** HIGH
**Assigned To:** backend-architect
**Dependencies:** TASK-2.1.3

## Description

Create global error handler middleware for Express to catch and format all errors consistently. Handle different error types appropriately.

## Acceptance Criteria

- [ ] src/backend/middleware/errorHandler.js created
- [ ] Handles different error types (validation, not found, file system)
- [ ] Formats error responses consistently
- [ ] Includes error logging
- [ ] Middleware added to Express app
- [ ] Development vs production error details

## Implementation Notes

Create src/backend/middleware/errorHandler.js:

```javascript
/**
 * Global error handler middleware
 * Must be registered AFTER all routes
 */
function errorHandler(err, req, res, next) {
  // Log error
  console.error('Error:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: err.message,
    stack: err.stack
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Prepare error response
  const errorResponse = {
    error: err.message || 'Internal server error',
    statusCode: statusCode,
    path: req.path
  };

  // Include stack trace in development only
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * 404 handler for unknown routes
 */
function notFoundHandler(req, res, next) {
  const error = new Error(`Not found: ${req.method} ${req.path}`);
  error.statusCode = 404;
  next(error);
}

module.exports = {
  errorHandler,
  notFoundHandler
};
```

Update server.js to use error handlers:

```javascript
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// ... all routes ...

// 404 handler (must be after all routes, before error handler)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);
```

Test error handling:
```bash
# Test 404
curl http://localhost:8420/api/nonexistent

# Test validation error
curl http://localhost:8420/api/projects/invalid@@@/agents
```

## References

- Express error handling documentation
- PRD Section 4.1: Backend Requirements (error handling)
