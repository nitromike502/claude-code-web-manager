# TASK-1.3.4: Design Hooks Detail View

**Epic:** EPIC-1
**Story:** Story 1.3 - Configuration Detail Interaction Wireframes
**Status:** Pending
**Priority:** HIGH
**Assigned To:** wireframe-designer
**Dependencies:** TASK-1.3.1

## Description

Design the detail view for hooks, showing event type, matcher pattern, action command, and JSON structure clearly. Handle display of multiple hooks.

## Acceptance Criteria

- [ ] Layout designed for hook properties
- [ ] JSON structure displayed clearly
- [ ] Event type prominently shown
- [ ] Matcher pattern highlighted
- [ ] Action command visible
- [ ] Multiple hooks handled gracefully

## Implementation Notes

Hook properties to display:
- **Event Type**: on_tool_call, on_message_submit, etc. (badge or heading)
- **Matcher**: Pattern to match (regex, glob, etc.)
- **Action**: Shell command to execute
- **Scope**: Project vs User settings (badge)
- **File Path**: .claude/settings.json or ~/.claude/settings.json

Layout sections:
1. Header: Event type badge, scope badge
2. Matcher: Pattern shown in code font
3. Action: Command shown in code block
4. Full JSON: Collapsible section with formatted JSON

Multiple hooks:
- If multiple hooks for same event type, show as list
- Each hook as separate card or section
- Group by event type

JSON display:
- Pretty-printed with indentation
- Syntax highlighting
- Copy button for full JSON

Example hook structure:
```json
{
  "on_tool_call": [
    {
      "match": "Edit",
      "action": "npm run lint"
    }
  ]
}
```

## References

- PRD Section 2.5: Hooks Viewing (lines 123-142)
- CLAUDE.md: Hooks configuration in settings files
