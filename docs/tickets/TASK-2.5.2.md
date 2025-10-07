# TASK-2.5.2: Create Custom Error Classes

**Epic:** EPIC-2
**Story:** Story 2.5 - Error Handling Framework
**Status:** Pending
**Priority:** MEDIUM
**Assigned To:** backend-architect
**Dependencies:** TASK-2.5.1

## Description

Create custom error classes for different error types (NotFoundError, ValidationError, FileSystemError, ParsingError) to provide better error categorization and handling.

## Acceptance Criteria

- [ ] src/backend/utils/errors.js created
- [ ] NotFoundError class created
- [ ] ValidationError class created
- [ ] FileSystemError class created
- [ ] ParsingError class created
- [ ] All classes extend Error properly
- [ ] All classes include statusCode

## Implementation Notes

Create src/backend/utils/errors.js:

```javascript
/**
 * Base API Error class
 */
class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found Error
 */
class NotFoundError extends APIError {
  constructor(resource, identifier) {
    super(`${resource} not found: ${identifier}`, 404);
  }
}

/**
 * 400 Validation Error
 */
class ValidationError extends APIError {
  constructor(message) {
    super(`Validation error: ${message}`, 400);
  }
}

/**
 * File System Error
 */
class FileSystemError extends APIError {
  constructor(operation, path, originalError) {
    super(`File system error (${operation}): ${path} - ${originalError}`, 500);
    this.operation = operation;
    this.path = path;
    this.originalError = originalError;
  }
}

/**
 * Parsing Error (JSON, YAML, Markdown)
 */
class ParsingError extends APIError {
  constructor(fileType, path, originalError) {
    super(`Failed to parse ${fileType}: ${path} - ${originalError}`, 500);
    this.fileType = fileType;
    this.path = path;
    this.originalError = originalError;
  }
}

module.exports = {
  APIError,
  NotFoundError,
  ValidationError,
  FileSystemError,
  ParsingError
};
```

Usage example in routes:

```javascript
const { NotFoundError, ValidationError } = require('../utils/errors');

// In a route handler:
router.get('/projects/:projectId/agents', async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Validate
    if (!projectId) {
      throw new ValidationError('Project ID is required');
    }

    // Check if project exists
    const project = await getProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project', projectId);
    }

    // ... rest of handler
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
});
```

## References

- JavaScript Error class
- Express error handling patterns
