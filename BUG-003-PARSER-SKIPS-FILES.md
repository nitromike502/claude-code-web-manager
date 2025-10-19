# BUG-003: Parser Silently Skips Files with Invalid YAML

**Severity:** HIGH
**Status:** OPEN
**Priority:** CRITICAL

## Description

When viewing a project in the Claude Code Manager, if any configuration files have parsing errors (e.g., invalid YAML in agent frontmatter), those files are silently skipped by the backend parser. No error indication is shown to the user beyond log output on the server.

## Current Behavior

- Backend server logs: `File skipped due to invalid YAML` (or similar)
- User sees: Incomplete configuration lists (missing files)
- No indication that data is incomplete or that errors occurred

## Expected Behavior

- All files should be parsed as much as possible
- Partial content should be displayed where possible
- Clear error indicators should show which files had problems
- Users should be aware that the configuration list is incomplete due to parse errors

## Impact

- Users cannot see that configuration files exist if they have parse errors
- No visibility into which files are problematic
- Difficult to debug configuration issues
- API response structure needs enhancement to include warnings/errors

## Solution Requirements

1. **Partial Parsing:** Parse as much as possible from each file, don't skip entirely
2. **Error Tracking:** Collect all parse errors during processing
3. **API Response:** Include warnings in API response (already has `warnings` field)
4. **UI Display:** Show warning banner indicating incomplete data
5. **File-Level Errors:** Indicate which specific files had problems

## Files Affected

- Backend API endpoints returning configuration data
- Parsers for: agents, commands, hooks, MCP servers
- API response structure (needs warnings field properly utilized)

## Related Issues

- Regression from Phase 1 architecture
- May affect Phase 2 test reliability if test data has parse errors

## Acceptance Criteria

- [ ] No files are skipped due to parse errors
- [ ] All parse errors are collected and returned in API response
- [ ] Frontend displays warning when errors are present
- [ ] Users can identify which files had parse errors
- [ ] Partial content is displayed where possible

---

**Created:** 2025-10-19
**Created By:** E2E Test Fix Session
**Component:** Backend Parser / API
**Labels:** bug, parser, high-priority, phase-2
