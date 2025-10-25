# TASK-2.1.2: Install Backend Dependencies

**Epic:** EPIC-2
**Story:** Story 2.1 - Node.js Project Initialization
**Status:** Pending
**Priority:** HIGH
**Assigned To:** backend-architect
**Dependencies:** TASK-2.1.1

## Description

Install all required backend dependencies including Express, CORS, markdown parsers, and development tools.

## Acceptance Criteria

- [ ] express installed
- [ ] cors installed
- [ ] gray-matter installed (YAML frontmatter parsing)
- [ ] marked installed (markdown parsing)
- [ ] nodemon installed (dev dependency)
- [ ] All dependencies recorded in package.json
- [ ] package-lock.json created

## Implementation Notes

Install production dependencies:
```bash
npm install express cors gray-matter marked
```

Install development dependencies:
```bash
npm install --save-dev nodemon
```

Expected dependencies in package.json:
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "gray-matter": "^4.0.3",
    "marked": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

Verify installation:
```bash
node -e "require('express'); console.log('OK')"
node -e "require('cors'); console.log('OK')"
node -e "require('gray-matter'); console.log('OK')"
node -e "require('marked'); console.log('OK')"
```

## References

- PRD Section 4.1: Backend Requirements (Express, file parsing)
- gray-matter: Parse YAML frontmatter from markdown
- marked: Parse markdown content to HTML
