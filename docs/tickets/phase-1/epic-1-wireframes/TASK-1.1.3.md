# TASK-1.1.3: Design Project Card Component

**Epic:** EPIC-1
**Story:** Story 1.1 - Dashboard & Project List Wireframes
**Status:** Pending
**Priority:** HIGH
**Assigned To:** wireframe-designer
**Dependencies:** TASK-1.1.2

## Description

Design the individual project card component that will be repeated in the project list. Define card content layout, status indicators, and interaction states.

## Acceptance Criteria

- [ ] Card content layout defined
- [ ] Project name prominently displayed
- [ ] Project path shown (with truncation if needed)
- [ ] Configuration counts displayed clearly
- [ ] Status indicators designed (valid/missing project)
- [ ] Hover state designed
- [ ] Click affordance clear
- [ ] Loading state designed

## Implementation Notes

Card content structure:
- Header: Project name
- Subheader: Project path (truncated if long)
- Body: Configuration counts (4 types)
- Footer: Status indicator

Status indicators:
- Valid project: Green checkmark or normal state
- Missing project: Red warning icon + text

Interaction states:
- Default state
- Hover state (highlight, shadow)
- Active/clicked state
- Loading state (skeleton or spinner)

## References

- PRD Section 2.1: Project Discovery
- PrimeVue Card component documentation
