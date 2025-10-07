# TASK-2.1.3: Create Directory Structure

**Epic:** EPIC-2
**Story:** Story 2.1 - Node.js Project Initialization
**Status:** Pending
**Priority:** HIGH
**Assigned To:** backend-architect
**Dependencies:** TASK-2.1.1

## Description

Create the complete directory structure for the backend and frontend code, following the project organization defined in CLAUDE.md.

## Acceptance Criteria

- [ ] src/ directory created
- [ ] src/backend/ directory created
- [ ] src/backend/routes/ directory created
- [ ] src/backend/services/ directory created
- [ ] src/backend/utils/ directory created
- [ ] src/backend/middleware/ directory created
- [ ] src/frontend/ directory created (placeholder)
- [ ] All directories committed to git

## Implementation Notes

Create directories:
```bash
mkdir -p src/backend/routes
mkdir -p src/backend/services
mkdir -p src/backend/utils
mkdir -p src/backend/middleware
mkdir -p src/frontend
```

Directory purposes:
- **src/backend/**: All backend code
  - **routes/**: Express route handlers (API endpoints)
  - **services/**: Business logic (project scanning, config reading)
  - **utils/**: Utility functions (file operations, parsers)
  - **middleware/**: Express middleware (error handling, CORS)
- **src/frontend/**: All frontend code (Vue 3 + PrimeVue)

Verify structure:
```bash
tree src/
```

Expected output:
```
src/
├── backend/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── utils/
└── frontend/
```

Add .gitkeep files to preserve empty directories:
```bash
touch src/frontend/.gitkeep
```

## References

- CLAUDE.md: Project Structure (lines 18-25)
- PRD Section 4.1: Backend Requirements
