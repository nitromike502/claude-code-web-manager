---
id: BUG-030
title: Slash Command details sidebar missing allowed tools from YAML
status: open
priority: high
category: Data Display
assigned_to: null
created_at: 2025-10-23
updated_at: 2025-10-23
---

## Description
Slash command configuration sidebar detail view is not displaying the `allowed_tools` (or `tools`) field from command YAML frontmatter, even though the field is parsed and available.

## Current Behavior
- Command sidebar shows name, description, and namespace
- The `tools` field is parsed from YAML but not displayed in sidebar
- Users cannot see which tools the command is allowed to use

## Expected Behavior
- Command detail sidebar should display allowed tools field
- Tools field should show list of allowed tools in readable format
- Should handle missing tools gracefully (show "None specified" or empty state)

## Affected Component(s)
- ProjectDetail.vue (command sidebar metadata section)
- UserGlobal.vue (command sidebar metadata section)

## Data Source
- Command YAML frontmatter: `tools` field (note: field name is `tools`, not `allowed_tools`)
- Example: `tools: Read, Write, Edit, Bash, Glob, Grep`
- Can be comma-separated string or YAML array

## Steps to Reproduce
1. Navigate to any project detail page or user global config
2. Scroll to commands section
3. Click on a command card to open sidebar
4. Observe that allowed tools field is NOT displayed in metadata section
5. Verify the command YAML has a tools field

## Acceptance Criteria
- [ ] Command sidebar detail view displays allowed tools field
- [ ] Tools field is clearly labeled as "Allowed Tools"
- [ ] Tools are shown as comma-separated list or badge format
- [ ] Handles missing tools gracefully (shows "None specified")
- [ ] Works in both ProjectDetail.vue and UserGlobal.vue
- [ ] NOTE: Frontend code currently references this as `tools`, not `allowed_tools`
