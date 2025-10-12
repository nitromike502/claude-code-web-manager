# BUG-002: User Hooks Endpoint Type Error

**Type:** Bug Fix
**Priority:** MEDIUM
**Component:** Backend API
**Endpoint:** GET /api/user/hooks
**Status:** RESOLVED
**Discovered:** 2025-10-11
**Resolved:** 2025-10-12
**Related PR:** #9 (Backend API Testing), feature/fix-hooks-error-handling

---

## Problem Description

The `GET /api/user/hooks` endpoint crashes with a TypeError when attempting to call `.map()` on `settings.hooks`, which may not be an array.

### Error Message
```json
{
    "success": false,
    "error": "settings.hooks.map is not a function"
}
```

### Impact
- **Severity:** MEDIUM
- **Effect:** User-level hooks cannot be viewed
- **Scope:** Affects users with non-array hooks configuration
- **User Experience:** Complete failure - no hooks displayed, error shown

---

## Root Cause

The code assumes `settings.hooks` is always an array and calls `.map()` directly without type checking. However, hooks in `~/.claude/settings.json` may be:
1. An object (keyed by event name)
2. Undefined (no hooks configured)
3. An array (expected format)

**Code Location:** `/home/claude/manager/src/backend/parsers/index.js` - likely in `parseUserHooks()` function

---

## Investigation Needed

Before fixing, check the actual data structure in `~/.claude/settings.json`:

```bash
cat ~/.claude/settings.json | python3 -m json.tool | grep -A 20 "hooks"
```

Determine if hooks are:
- Array: `"hooks": [...]`
- Object: `"hooks": { "pre-commit": {...}, "post-commit": {...} }`
- Missing: `"hooks"` key doesn't exist

---

## Expected Behavior

The endpoint should:
1. Check if `settings.hooks` exists
2. Handle both array and object formats
3. Return empty array if hooks are undefined
4. Never crash on unexpected data types

**Example Expected Response:**
```json
{
    "success": true,
    "hooks": [
        {
            "event": "pre-commit",
            "command": "npm run lint",
            "scope": "user"
        }
    ]
}
```

---

## Proposed Solution

### Add Type Checking Before `.map()`

```javascript
async function parseUserHooks() {
    try {
        const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');

        if (!fs.existsSync(settingsPath)) {
            return { success: true, hooks: [] };
        }

        const settings = JSON.parse(await fs.readFile(settingsPath, 'utf8'));

        // Handle missing hooks
        if (!settings.hooks) {
            return { success: true, hooks: [] };
        }

        // Handle array format
        if (Array.isArray(settings.hooks)) {
            return {
                success: true,
                hooks: settings.hooks.map(h => ({ ...h, scope: 'user' }))
            };
        }

        // Handle object format (keyed by event)
        if (typeof settings.hooks === 'object') {
            const hooks = Object.entries(settings.hooks).map(([event, config]) => ({
                event,
                ...config,
                scope: 'user'
            }));
            return { success: true, hooks };
        }

        // Unexpected type
        console.warn('Unexpected hooks format:', typeof settings.hooks);
        return { success: true, hooks: [] };

    } catch (error) {
        console.error('Error parsing user hooks:', error);
        return { success: false, error: error.message };
    }
}
```

---

## Acceptance Criteria

- [x] Endpoint handles undefined hooks gracefully
- [x] Endpoint handles array format correctly
- [x] Endpoint handles object format correctly
- [x] Endpoint returns empty array for missing/invalid hooks
- [x] Error messages are helpful and actionable
- [x] No TypeErrors thrown

---

## Testing Steps

1. **Test with undefined hooks:**
   - Remove or comment out `hooks` in `~/.claude/settings.json`
   - Verify endpoint returns empty array

2. **Test with array format:**
   ```json
   {
       "hooks": [
           { "event": "pre-commit", "command": "npm test" }
       ]
   }
   ```
   - Verify hooks are returned correctly

3. **Test with object format:**
   ```json
   {
       "hooks": {
           "pre-commit": { "command": "npm test" },
           "post-commit": { "command": "git push" }
       }
   }
   ```
   - Verify hooks are converted to array correctly

4. **Test with invalid format:**
   ```json
   {
       "hooks": "invalid string"
   }
   ```
   - Verify endpoint returns empty array, no crash

---

## Investigation Commands

```bash
# Check user settings structure
cat ~/.claude/settings.json | python3 -m json.tool

# Test endpoint
curl -s http://localhost:8420/api/user/hooks | python3 -m json.tool

# Check backend logs for errors
# (look at server console output)
```

---

## Related Issues

- **PR #9:** Backend API Testing (discovered this bug)
- **BUG-001:** User agents YAML parsing error
- **EPIC-1:** Backend API Implementation

---

## Additional Context

This bug was discovered during comprehensive backend API testing (SWARM Option A). It prevents the frontend from displaying user-level hooks.

**Testing Report:** `docs/testing/backend-api-test-report-20251011.md`

---

## Time Estimate

**20-30 minutes** (type checking + handle both formats)

---

## Notes

- Same pattern should be applied to project-level hooks endpoint
- Consider creating a shared `normalizeHooks()` utility function
- Hook format varies between Claude Code versions - need to support both
- Document the expected format in API documentation

---

## Resolution

**Date:** 2025-10-12
**Commit:** e394704
**Branch:** feature/fix-hooks-error-handling

### Changes Made

1. **Updated `getProjectHooks()` function** in `/home/claude/manager/src/backend/services/projectDiscovery.js`:
   - Added type checking before calling `.map()`
   - Handle array format: direct mapping with source annotation
   - Handle object format: parse event -> array of matchers structure
   - Track warnings for malformed JSON and unexpected types
   - Return `{hooks, warnings}` structure instead of plain array

2. **Updated `getUserHooks()` function** in the same file:
   - Applied identical error handling pattern
   - Support both array and object formats
   - Return `{hooks, warnings}` structure

3. **Updated `getProjectCounts()` function**:
   - Handle new return structure from `getProjectHooks()`
   - Access `hooksResult.hooks.length` instead of `hooks.length`

4. **Updated API routes**:
   - `/home/claude/manager/src/backend/routes/projects.js`: Return warnings array
   - `/home/claude/manager/src/backend/routes/user.js`: Return warnings array

### Hooks Data Structure

Discovered that hooks in settings.json use this structure:
```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [...]
      }
    ],
    "Notification": [...]
  }
}
```

Each event maps to an array of matcher configurations. The parser now correctly handles this by:
- Iterating over event entries
- Extracting matcher and hooks arrays
- Creating structured hook objects with event, matcher, hooks, source, and matcherIndex fields

### Testing

All tests passed:
- ✓ Project hooks endpoint returns success with hooks and warnings arrays
- ✓ User hooks endpoint returns success with hooks and warnings arrays
- ✓ Hook structure includes event, matcher, hooks, and source fields
- ✓ No TypeErrors when parsing object format hooks
- ✓ Empty warnings array when all files parse successfully

### Impact

- **User hooks endpoint now fully functional**
- **Project hooks endpoint also improved with error handling**
- **Both endpoints return warnings for malformed data instead of crashing**
- **Supports both array and object hook formats**
