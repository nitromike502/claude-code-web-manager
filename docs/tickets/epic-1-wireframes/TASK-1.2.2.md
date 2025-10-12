# TASK-1.2.2: Design Configuration Card Component

**Epic:** EPIC-1
**Story:** Story 1.2 - Project Detail View Wireframes
**Status:** Pending
**Priority:** HIGH
**Assigned To:** wireframe-designer
**Dependencies:** TASK-1.2.1

## Description

Design the configuration card component used on the project detail page. Each card represents one configuration type (agents, commands, hooks, or MCP servers).

## Acceptance Criteria

- [ ] Card header designed (title, count, actions)
- [ ] Card body designed (list preview)
- [ ] Empty state designed
- [ ] Loading state designed
- [ ] List item preview format defined
- [ ] "View details" interaction clear

## Implementation Notes

Card structure:
- Header:
  - Title: "Subagents" / "Slash Commands" / "Hooks" / "MCP Servers"
  - Count badge: (5) or (0)
  - Actions: Refresh icon (future: Add button)
- Body:
  - List of items (name, brief info)
  - Max 5 items visible, "View all" if more
  - Click item to see details
- Footer: Optional "View all" link

Empty state:
- Icon + "No [config type] found"
- Helpful message

Loading state:
- Skeleton loaders for list items
- Or spinner overlay

List item format:
- Agents: Name + description (first line)
- Commands: /command-name + description
- Hooks: Event type + action summary
- MCP: Server name + transport type

## References

- PRD Section 2.3-2.6: Configuration Viewing (lines 85-179)
- PrimeVue Card component
