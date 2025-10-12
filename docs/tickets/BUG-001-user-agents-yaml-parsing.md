# BUG-001: User Agents Endpoint YAML Parsing Error

**Type:** Bug Fix
**Priority:** HIGH
**Component:** Backend API
**Endpoint:** GET /api/user/agents
**Status:** Open
**Discovered:** 2025-10-11
**Related PR:** #9 (Backend API Testing)

---

## Problem Description

The `GET /api/user/agents` endpoint crashes with a YAML parsing error when encountering malformed frontmatter in user agent files.

### Error Message
```json
{
    "success": false,
    "error": "Invalid YAML frontmatter in /home/meckert/.claude/agents/ui-ux-designer.md: incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line at line 3, column 398:\n     ... tecting design systems. Examples: <example>Context: User is work ... \n                                         ^"
}
```

### Impact
- **Severity:** HIGH
- **Effect:** User-level agents cannot be viewed at all
- **Scope:** Affects all users with malformed agent files
- **User Experience:** Complete failure - no agents displayed, error shown

---

## Root Cause

The YAML parser fails when encountering malformed frontmatter and throws an error that crashes the entire endpoint. The code does not handle parsing errors gracefully.

**Problem File:** `/home/meckert/.claude/agents/ui-ux-designer.md`
**Problem Line:** Line 3, column 398 (frontmatter contains unescaped special characters)

**Code Location:** `/home/claude/manager/src/backend/parsers/index.js` - likely in `parseAllSubagents()` function

---

## Expected Behavior

When a malformed agent file is encountered:
1. Log a warning with file path and error details
2. Skip the malformed file and continue parsing remaining files
3. Return all valid agents successfully parsed
4. Optionally include a `warnings` array in response with skipped files

**Example Expected Response:**
```json
{
    "success": true,
    "agents": [
        { "name": "backend-architect", ... },
        { "name": "frontend-developer", ... }
    ],
    "warnings": [
        {
            "file": "/home/meckert/.claude/agents/ui-ux-designer.md",
            "error": "Invalid YAML frontmatter: incomplete explicit mapping pair",
            "skipped": true
        }
    ]
}
```

---

## Proposed Solution

### Option A: Resilient Error Handling (Recommended)
Add try-catch blocks around YAML parsing to handle errors gracefully:

```javascript
async function parseAllSubagents(agentsDir, scope) {
    const agents = [];
    const warnings = [];
    const files = await fs.readdir(agentsDir);

    for (const file of files) {
        if (!file.endsWith('.md')) continue;

        try {
            const agent = await parseSubagentFile(path.join(agentsDir, file));
            agents.push(agent);
        } catch (error) {
            console.warn(`Failed to parse agent file ${file}:`, error.message);
            warnings.push({
                file: path.join(agentsDir, file),
                error: error.message,
                skipped: true
            });
        }
    }

    return { agents, warnings };
}
```

### Option B: Stricter Validation
Validate YAML frontmatter before parsing and provide helpful error messages.

### Recommendation
Implement **Option A** first for resilience, then optionally add **Option B** for better user feedback.

---

## Acceptance Criteria

- [ ] Endpoint returns 200 status even with malformed files
- [ ] Valid agent files are parsed and returned successfully
- [ ] Malformed files are skipped with warnings logged
- [ ] Response includes `warnings` array with skipped files
- [ ] Error messages are helpful and actionable
- [ ] No single malformed file blocks entire endpoint

---

## Testing Steps

1. Start server: `npm start`
2. Test with malformed file present:
   ```bash
   curl -s http://localhost:8420/api/user/agents | python3 -m json.tool
   ```
3. Verify response includes valid agents and warnings array
4. Fix malformed file and verify it appears in next request
5. Test with all valid files - warnings array should be empty

---

## Related Issues

- **PR #9:** Backend API Testing (discovered this bug)
- **BUG-002:** User hooks endpoint type error
- **EPIC-1:** Backend API Implementation

---

## Additional Context

This bug was discovered during comprehensive backend API testing (SWARM Option A). It prevents the frontend from displaying user-level agents.

**Testing Report:** `docs/testing/backend-api-test-report-20251011.md`

---

## Time Estimate

**15-30 minutes** (simple error handling addition)

---

## Notes

- This is a defensive programming issue - should handle malformed user data gracefully
- Same pattern should be applied to other parsers (commands, hooks, MCP)
- Consider creating a shared `parseWithErrorHandling()` utility function
