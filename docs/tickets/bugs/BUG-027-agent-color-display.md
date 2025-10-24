---
id: BUG-027
title: Agent details sidebar missing color from YAML
status: open
priority: high
category: Data Display
assigned_to: null
created_at: 2025-10-23
updated_at: 2025-10-23
---

## Description
Agent configuration sidebar detail view is not displaying the `color` field from agent YAML frontmatter, even though the field is parsed and available.

## Current Behavior
- Agent sidebar shows name, description, and allowed tools
- The `color` field is parsed from YAML but not displayed
- Users cannot see what color the agent is configured to use

## Expected Behavior
- Agent detail sidebar should display the color field
- Color field should be clearly labeled and readable
- Should handle missing color gracefully

## Affected Component(s)
- ProjectDetail.vue (agent sidebar metadata section)
- UserGlobal.vue (agent sidebar metadata section)

## Data Source
- Agent YAML frontmatter: `color` field
- Example: `color: blue`, `color: cyan`

## Steps to Reproduce
1. Navigate to any project detail page or user global config
2. Scroll to agents section
3. Click on an agent card to open sidebar
4. Observe that color field is NOT displayed in metadata section
5. Verify the agent YAML has a color field

## Acceptance Criteria
- [ ] Agent sidebar detail view displays color field
- [ ] Color field is clearly labeled
- [ ] Color value is shown in readable format
- [ ] Handles missing color gracefully (shows nothing if not set)
- [ ] Works in both ProjectDetail.vue and UserGlobal.vue
