# TASK-1.2.1: Design Project Detail Page Layout

**Epic:** EPIC-1
**Story:** Story 1.2 - Project Detail View Wireframes
**Status:** Pending
**Priority:** CRITICAL
**Assigned To:** wireframe-designer
**Dependencies:** TASK-1.1.3

## Description

Design the project detail page layout showing the 4-card layout for configuration types (agents, commands, hooks, MCP). Include navigation elements and responsive behavior.

## Acceptance Criteria

- [ ] 4-card layout designed (agents, commands, hooks, MCP)
- [ ] Navigation elements placed (breadcrumbs, back button)
- [ ] Card sizing and spacing defined
- [ ] Responsive behavior specified (stacking on mobile)
- [ ] Page header designed (project name/path)
- [ ] Empty state designed (no configurations found)

## Implementation Notes

Page structure:
- Header: Project name, path, breadcrumbs
- Navigation: Back to dashboard, breadcrumbs
- Body: 4 configuration cards in 2x2 or 4x1 layout
- Responsive: Stack vertically on mobile

Card layout options:
- 2x2 grid (agents top-left, commands top-right, hooks bottom-left, MCP bottom-right)
- 4x1 vertical stack
- Flexible grid (wraps based on screen size)

Navigation:
- Breadcrumb: Dashboard > Project Name
- Back button: "← Back to Projects"
- Or use Vue Router for URL-based navigation

## References

- PRD Section 2.2: Project Navigation (lines 59-83)
- PRD Section 3: UI Design Principles
