# TASK-2.4.5: Test All Routes with curl

**Epic:** EPIC-2
**Story:** Story 2.4 - API Endpoint Skeleton
**Status:** Pending
**Priority:** MEDIUM
**Assigned To:** backend-architect
**Dependencies:** TASK-2.4.2, TASK-2.4.3, TASK-2.4.4

## Description

Comprehensively test all API routes using curl to verify they respond correctly, handle errors appropriately, and return expected data structures.

## Acceptance Criteria

- [ ] All 11 routes tested with curl
- [ ] Successful responses verified (200 status)
- [ ] Error responses tested (400, 404, 500)
- [ ] Response JSON structure validated
- [ ] Invalid parameters tested
- [ ] Documentation of example requests/responses created

## Implementation Notes

Create test script (tests/api-test.sh):

```bash
#!/bin/bash

BASE_URL="http://localhost:8420"

echo "Testing Claude Code Manager API"
echo "================================"

echo ""
echo "1. Health check"
curl -s $BASE_URL/api/health | jq .

echo ""
echo "2. API info"
curl -s $BASE_URL/api | jq .

echo ""
echo "3. Get all projects"
curl -s $BASE_URL/api/projects | jq .

echo ""
echo "4. Trigger rescan"
curl -s -X POST $BASE_URL/api/projects/scan | jq .

echo ""
echo "5. Get project agents (use first project ID from /api/projects)"
PROJECT_ID=$(curl -s $BASE_URL/api/projects | jq -r '.projects[0].id')
echo "Using project ID: $PROJECT_ID"
curl -s $BASE_URL/api/projects/$PROJECT_ID/agents | jq .

echo ""
echo "6. Get project commands"
curl -s $BASE_URL/api/projects/$PROJECT_ID/commands | jq .

echo ""
echo "7. Get project hooks"
curl -s $BASE_URL/api/projects/$PROJECT_ID/hooks | jq .

echo ""
echo "8. Get project MCP servers"
curl -s $BASE_URL/api/projects/$PROJECT_ID/mcp | jq .

echo ""
echo "9. Get user agents"
curl -s $BASE_URL/api/user/agents | jq .

echo ""
echo "10. Get user commands"
curl -s $BASE_URL/api/user/commands | jq .

echo ""
echo "11. Get user hooks"
curl -s $BASE_URL/api/user/hooks | jq .

echo ""
echo "12. Get user MCP servers"
curl -s $BASE_URL/api/user/mcp | jq .

echo ""
echo "13. Test invalid project ID (should return 404)"
curl -s $BASE_URL/api/projects/invalid123/agents | jq .

echo ""
echo "14. Test invalid route (should return 404)"
curl -s $BASE_URL/api/nonexistent | jq .

echo ""
echo "Tests complete!"
```

Make executable and run:
```bash
chmod +x tests/api-test.sh
./tests/api-test.sh
```

Document example responses in docs/API-Examples.md:

```markdown
# API Examples

## GET /api/health
```json
{
  "status": "healthy",
  "timestamp": "2024-10-06T20:00:00.000Z",
  "uptime": 123.456,
  "node_version": "v18.17.0"
}
```

## GET /api/projects
```json
{
  "projects": [
    {
      "id": "homeuserprojectsmyapp",
      "path": "/home/user/projects/myapp",
      "name": "myapp",
      "exists": true
    }
  ],
  "count": 1
}
```

[... more examples ...]
```

## References

- All API endpoints defined in PRD and CLAUDE.md
- curl documentation
- jq for JSON formatting
