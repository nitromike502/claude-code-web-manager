# TASK-2.5.3: Add Error Logging

**Epic:** EPIC-2
**Story:** Story 2.5 - Error Handling Framework
**Status:** Pending
**Priority:** MEDIUM
**Assigned To:** backend-architect
**Dependencies:** TASK-2.5.1, TASK-2.5.2

## Description

Implement comprehensive error logging with timestamps, error types, and stack traces. Log to console for Phase 1, with structure to support file logging in future.

## Acceptance Criteria

- [ ] Error logging added to error handler middleware
- [ ] Logs include timestamp, error type, stack trace
- [ ] Console logging works
- [ ] Log format is structured (JSON or formatted text)
- [ ] Sensitive data not logged (passwords, tokens)
- [ ] Log levels considered (error, warn, info)

## Implementation Notes

Update src/backend/middleware/errorHandler.js:

```javascript
/**
 * Log error with structured format
 */
function logError(err, req) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    type: err.name || 'Error',
    message: err.message,
    statusCode: err.statusCode || 500,
    request: {
      method: req.method,
      path: req.path,
      query: req.query,
      // Don't log body - may contain sensitive data
    },
    stack: err.stack
  };

  // Format for console
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error(`[${logEntry.timestamp}] ${logEntry.type}: ${logEntry.message}`);
  console.error(`Request: ${logEntry.request.method} ${logEntry.request.path}`);
  console.error(`Status Code: ${logEntry.statusCode}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error('Stack:', logEntry.stack);
  }
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // TODO: In future, write to log file
  // fs.appendFileSync('logs/error.log', JSON.stringify(logEntry) + '\n');
}

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  // Log error
  logError(err, req);

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Prepare error response
  const errorResponse = {
    error: err.message || 'Internal server error',
    statusCode: statusCode,
    path: req.path,
    timestamp: new Date().toISOString()
  };

  // Include stack trace in development only
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
}
```

Create logs directory structure:
```bash
mkdir -p logs
echo "logs/" >> .gitignore
```

Consider adding winston or pino for advanced logging in Phase 2:
```javascript
// Future: use winston for file logging
// const winston = require('winston');
// const logger = winston.createLogger({
//   transports: [
//     new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
//     new winston.transports.Console()
//   ]
// });
```

## References

- Winston logging library
- Pino logging library
- Node.js console API
