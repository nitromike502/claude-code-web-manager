# TASK-2.5.4: Test Error Handling

**Epic:** EPIC-2
**Story:** Story 2.5 - Error Handling Framework
**Status:** Pending
**Priority:** HIGH
**Assigned To:** backend-architect
**Dependencies:** TASK-2.5.1, TASK-2.5.2, TASK-2.5.3

## Description

Comprehensively test error handling by triggering each error type and verifying proper response format, status codes, and logging.

## Acceptance Criteria

- [ ] Each error type triggered and tested
- [ ] Response format validated
- [ ] Status codes verified (400, 404, 500)
- [ ] Error logging verified
- [ ] Missing files handled gracefully
- [ ] Malformed JSON handled gracefully
- [ ] Invalid parameters handled gracefully

## Implementation Notes

Create test script (tests/error-test.sh):

```bash
#!/bin/bash

BASE_URL="http://localhost:8420"

echo "Testing Error Handling"
echo "======================"

echo ""
echo "1. Test 404 - Unknown route"
curl -v $BASE_URL/api/nonexistent 2>&1 | grep "< HTTP"
curl -s $BASE_URL/api/nonexistent | jq .

echo ""
echo "2. Test 404 - Unknown project"
curl -v $BASE_URL/api/projects/invalidprojectid123/agents 2>&1 | grep "< HTTP"
curl -s $BASE_URL/api/projects/invalidprojectid123/agents | jq .

echo ""
echo "3. Test 400 - Invalid project ID format"
curl -v "$BASE_URL/api/projects/invalid@@@/agents" 2>&1 | grep "< HTTP"
curl -s "$BASE_URL/api/projects/invalid@@@/agents" | jq .

echo ""
echo "4. Test missing ~/.claude.json"
# Temporarily rename ~/.claude.json to test
if [ -f ~/.claude.json ]; then
  echo "Backing up ~/.claude.json"
  mv ~/.claude.json ~/.claude.json.backup
  curl -s $BASE_URL/api/projects | jq .
  echo "Restoring ~/.claude.json"
  mv ~/.claude.json.backup ~/.claude.json
else
  echo "~/.claude.json doesn't exist - error handling will be tested naturally"
  curl -s $BASE_URL/api/projects | jq .
fi

echo ""
echo "Error handling tests complete!"
```

Manual test checklist:

1. **NotFoundError:**
   - Request unknown project: `/api/projects/invalid123/agents`
   - Should return 404 with message "Project not found: invalid123"

2. **ValidationError:**
   - Invalid project ID: `/api/projects/invalid@@@/agents`
   - Should return 400 with validation error message

3. **FileSystemError:**
   - Request config from project with missing .claude directory
   - Should return 500 with file system error

4. **ParsingError:**
   - Create malformed JSON in settings.json
   - Request hooks from that project
   - Should return 500 with parsing error

5. **General 500 Error:**
   - Throw an uncaught error in route handler
   - Should return 500 with generic error message

Verify error logging:
- Check console output has formatted error logs
- Verify timestamp, error type, stack trace present
- Verify no sensitive data in logs

Verify error response format:
```json
{
  "error": "Error message",
  "statusCode": 404,
  "path": "/api/projects/invalid123/agents",
  "timestamp": "2024-10-06T20:00:00.000Z",
  "stack": "[only in development]"
}
```

## References

- All custom error classes (TASK-2.5.2)
- Error handler middleware (TASK-2.5.1)
- PRD Section 4.1: Backend Requirements (error handling)
