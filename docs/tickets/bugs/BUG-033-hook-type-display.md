---
id: BUG-033
title: Hook details sidebar missing type field
status: open
priority: high
category: Data Display
assigned_to: null
created_at: 2025-10-23
updated_at: 2025-10-23
---

## Description
Hook configuration sidebar detail view is not displaying the `type` field from hook configuration, even though the field is parsed and available.

## Current Behavior
- Hook sidebar shows event and potentially other fields
- The `type` field is parsed from settings.json but not displayed in sidebar
- Users cannot see whether a hook runs before or after an event (pre/post)

## Expected Behavior
- Hook detail sidebar should display the type field
- Type should clearly indicate hook timing (e.g., "pre-commit", "post-push")
- Should handle missing type gracefully (show default or nothing if not set)

## Affected Component(s)
- ProjectDetail.vue (hook sidebar metadata section)
- UserGlobal.vue (hook sidebar metadata section)

## Data Source
- Hook configuration: `type` field from `.claude/settings.json`
- Example: `"type": "pre-commit"`
- Example: `"type": "post-push"`
- Default: `"command"` (if not explicitly specified)

## Steps to Reproduce
1. Navigate to any project detail page or user global config
2. Scroll to hooks section
3. Click on a hook card to open sidebar
4. Observe that type field is NOT displayed in metadata section
5. Verify the settings.json has a type field for that hook

## Acceptance Criteria
- [ ] Hook sidebar detail view displays type field
- [ ] Type field is clearly labeled as "Type"
- [ ] Type value is shown in readable format
- [ ] Handles missing type gracefully (shows default or nothing if not set)
- [ ] Works in both ProjectDetail.vue and UserGlobal.vue
