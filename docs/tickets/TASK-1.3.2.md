# TASK-1.3.2: Design Subagent Detail View

**Epic:** EPIC-1
**Story:** Story 1.3 - Configuration Detail Interaction Wireframes
**Status:** Pending
**Priority:** HIGH
**Assigned To:** wireframe-designer
**Dependencies:** TASK-1.3.1

## Description

Design the detail view for subagents, showing all agent properties including name, description, tools, model, and system prompt with syntax highlighting.

## Acceptance Criteria

- [ ] Layout designed for all agent properties
- [ ] Syntax highlighting areas identified
- [ ] Copy-to-clipboard buttons placed
- [ ] Long content handling defined (scrolling/truncation)
- [ ] Responsive behavior specified

## Implementation Notes

Agent properties to display:
- **Name**: Prominent heading
- **Description**: Subheading or first section
- **Tools**: List with icons/badges
- **Model**: Badge or info line
- **System Prompt**: Code block with syntax highlighting
- **Scope**: Project vs User (badge)
- **File Path**: Subdued, with copy button

Layout sections:
1. Header: Name, scope badge, file path
2. Description: Full text paragraph
3. Configuration: Tools list, model info
4. System Prompt: Large code block, scrollable

Syntax highlighting:
- Use Prism.js or highlight.js for markdown
- Or PrimeVue's built-in code highlighting

Copy buttons:
- Copy file path
- Copy system prompt
- Copy entire agent config (JSON)

Long content:
- System prompts can be 1000+ lines
- Use scrollable container with max-height
- Or "Show more/less" toggle

## References

- PRD Section 2.3: Subagent Viewing (lines 85-102)
- CLAUDE.md: Subagent file format (.claude/agents/*.md)
