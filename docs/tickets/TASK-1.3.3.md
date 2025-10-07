# TASK-1.3.3: Design Command Detail View

**Epic:** EPIC-1
**Story:** Story 1.3 - Configuration Detail Interaction Wireframes
**Status:** Pending
**Priority:** HIGH
**Assigned To:** wireframe-designer
**Dependencies:** TASK-1.3.1

## Description

Design the detail view for slash commands, showing command name, description, markdown content, and nested directory representation.

## Acceptance Criteria

- [ ] Layout designed for command properties
- [ ] Syntax highlighting for markdown content
- [ ] Nested directory path display designed
- [ ] Copy-to-clipboard buttons placed
- [ ] Command invocation example shown

## Implementation Notes

Command properties to display:
- **Command Name**: /command-name (prominent, copy button)
- **Description**: Extracted from markdown or frontmatter
- **File Path**: Show full path including nested directories
- **Scope**: Project vs User (badge)
- **Content**: Full markdown with syntax highlighting

Layout sections:
1. Header: Command name (/command), scope badge
2. File Path: .claude/commands/nested/dir/command.md (with copy)
3. Description: Brief description if available
4. Usage Example: How to invoke the command
5. Content: Full markdown in code block

Nested directory representation:
- Show full path: .claude/commands/category/subcategory/command.md
- Breadcrumb style: commands › category › subcategory › command
- Help users understand command organization

Syntax highlighting:
- Markdown syntax highlighting for command content
- Or render as formatted markdown

Copy buttons:
- Copy command name (/command)
- Copy file path
- Copy entire command content

## References

- PRD Section 2.4: Slash Command Viewing (lines 104-121)
- CLAUDE.md: Command file format (.claude/commands/**/*.md)
