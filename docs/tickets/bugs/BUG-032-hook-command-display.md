---
id: BUG-032
title: Hook details sidebar missing command field
status: open
priority: high
category: Data Display
assigned_to: null
created_at: 2025-10-23
updated_at: 2025-10-23
---

## Description
Hook configuration sidebar detail view is not displaying the `command` field from hook configuration, even though the field is parsed and available.

## Current Behavior
- Hook sidebar shows event and potentially other fields
- The `command` field is parsed from settings.json but not displayed in sidebar
- Users cannot see what shell command a hook executes

## Expected Behavior
- Hook detail sidebar should display the command field
- Command should be shown in code block or monospace format for readability
- Should handle missing command gracefully (show nothing if not set)

## Affected Component(s)
- ProjectDetail.vue (hook sidebar metadata section)
- UserGlobal.vue (hook sidebar metadata section)

## Data Source
- Hook configuration: `command` field from `.claude/settings.json`
- Example: `"command": "npm test"`
- Example: `"command": "git add ."`

## Steps to Reproduce
1. Navigate to any project detail page or user global config
2. Scroll to hooks section
3. Click on a hook card to open sidebar
4. Observe that command field is NOT displayed in metadata section
5. Verify the settings.json has a command field for that hook

## Acceptance Criteria
- [ ] Hook sidebar detail view displays command field
- [ ] Command field is clearly labeled as "Command"
- [ ] Command is shown in code block or monospace format
- [ ] Handles missing command gracefully (shows nothing if not set)
- [ ] Works in both ProjectDetail.vue and UserGlobal.vue
