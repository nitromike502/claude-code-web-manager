---
id: BUG-031
title: Slash Command details sidebar missing argument hint from YAML
status: open
priority: high
category: Data Display
assigned_to: null
created_at: 2025-10-23
updated_at: 2025-10-23
---

## Description
Slash command configuration sidebar detail view is not displaying the `argument_hint` field from command YAML frontmatter, even though the field is parsed and available.

## Current Behavior
- Command sidebar shows name, description, namespace, color, and tools
- The `argumentHint` field is parsed from YAML but not displayed in sidebar
- Users cannot see what arguments or parameters a command expects

## Expected Behavior
- Command detail sidebar should display argument hint field
- Argument hint should show usage information in readable format
- Should handle missing argument hint gracefully (show nothing if not set)

## Affected Component(s)
- ProjectDetail.vue (command sidebar metadata section)
- UserGlobal.vue (command sidebar metadata section)

## Data Source
- Command YAML frontmatter: `argument-hint` field (note: kebab-case in YAML, camelCase in JS)
- Example: `argument-hint: "[instructions] - Optional context for command"`
- Example: `argument-hint: "[date] [additional-instructions]"`

## Steps to Reproduce
1. Navigate to any project detail page or user global config
2. Scroll to commands section
3. Click on a command card to open sidebar
4. Observe that argument hint field is NOT displayed in metadata section
5. Verify the command YAML has an argument-hint field

## Acceptance Criteria
- [ ] Command sidebar detail view displays argument hint field
- [ ] Argument hint field is clearly labeled as "Argument Hint"
- [ ] Argument hint value is shown in readable format
- [ ] Handles missing argument hint gracefully (shows nothing if not set)
- [ ] Works in both ProjectDetail.vue and UserGlobal.vue
- [ ] NOTE: YAML field is `argument-hint` (kebab-case), JS property is `argumentHint` (camelCase)
