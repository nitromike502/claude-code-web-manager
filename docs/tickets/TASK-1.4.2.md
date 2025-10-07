# TASK-1.4.2: Design Global Navigation

**Epic:** EPIC-1
**Story:** Story 1.4 - User/Global Configuration View Wireframes
**Status:** Pending
**Priority:** MEDIUM
**Assigned To:** wireframe-designer
**Dependencies:** TASK-1.4.1

## Description

Design the global navigation system that allows users to navigate between the project dashboard, individual project views, and the user settings page.

## Acceptance Criteria

- [ ] "User Settings" link added to dashboard
- [ ] Persistent navigation defined (if needed)
- [ ] Breadcrumbs designed for user view
- [ ] Back navigation from user settings to dashboard
- [ ] Active page indication clear

## Implementation Notes

Navigation structure:
- Dashboard → Lists all projects
- Project Detail → Shows one project's configs
- User Settings → Shows user-level configs

Dashboard navigation:
- Add "User Settings" link (top-right, or sidebar)
- Icon: Settings icon or user icon
- Label: "User Settings" or "My Settings"

User Settings navigation:
- Breadcrumb: Dashboard > User Settings
- Back button: "← Back to Projects"
- Or top nav bar with "Projects | User Settings" tabs

Persistent navigation options:
- Top nav bar (always visible)
- Sidebar (collapsible)
- Breadcrumbs only (simpler)

Active page indication:
- Highlight current page in nav
- Different page title/header
- Breadcrumb shows current location

URL routing (if using Vue Router):
- / → Dashboard
- /project/:projectId → Project Detail
- /user → User Settings
- /project/:projectId/agent/:agentName → Agent Detail (if separate page)

## References

- PRD Section 2.2: Project Navigation (lines 59-83)
- PRD Section 4.2: Frontend Requirements (Vue 3 routing)
