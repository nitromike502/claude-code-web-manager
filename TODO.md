# TODO - Future Tasks & Ideas

## Purpose

This file is a **personal idea backlog** for the Claude Code Manager project. It serves as a collection point for:
- Feature ideas and enhancement suggestions
- Potential improvements discovered during development
- Nice-to-have functionality for future phases
- Technical debt or refactoring opportunities worth exploring

**This is NOT a project status tracker.** Project progress and task completion are tracked via:
- Git commits (one commit per completed task)
- Pull requests and code reviews
- Test suite execution and results
- Documentation in `CLAUDE.md` (for architecture/feature status)

## Guidelines

- **Add freely**: Capture ideas as they emerge during development
- **Keep it rough**: Ideas don't need to be fully fleshed out
- **Organize loosely**: Group related ideas by category/phase when it makes sense
- **Review occasionally**: Periodically review to identify patterns or priorities
- **Link to PR/commits**: When an idea becomes a task, link it to the PR/commit that implements it

**Note:** Changes to this file can be included in any branch/PR regardless of the feature being developed.

---

## Future Enhancement Ideas

### Phase 3 - Subagent CRUD (Next Major Feature)
- [ ] Create, edit, and delete subagent definitions
- [ ] YAML frontmatter validation
- [ ] Live preview of subagent content
- [ ] Template system for common subagent types

### Phase 4 - Command Management
- [ ] Create, edit, and delete slash commands
- [ ] Command testing and validation
- [ ] Nested directory support
- [ ] Import/export command libraries

### Phase 5 - Hooks Configuration
- [ ] Visual hook editor
- [ ] Hook testing and validation
- [ ] Pre-built hook templates
- [ ] Hook dependency management

### Phase 6 - MCP Server Management
- [ ] Add, edit, and remove MCP servers
- [ ] Server configuration validation
- [ ] Connection testing
- [ ] Server discovery and recommendations

### Workflow Analyzer Script Integration
- [ ] Update `/analyze-workflow` slash command to utilize condense-transcript.js helper script
- [ ] Update `workflow-analyzer` agent instructions to leverage condense-transcript.js for large transcripts
- [ ] Add documentation in workflow-analyzer about when/how to use the transcript condenser
- [ ] Test workflow analysis with condensed vs. raw transcripts for efficiency comparison

### YAML Frontmatter Validation & Auto-Fix
- [ ] Add YAML validation UI that highlights files with parsing errors
- [ ] Implement "Fix YAML" button/feature to auto-correct common issues
- [ ] Support unquoted text values (add quotes where needed)
- [ ] Handle special characters in YAML values (colons, brackets, etc.)
- [ ] Provide diff preview before applying fixes
- [ ] Add option to bulk-fix all YAML errors in a project

### UI/UX Enhancements
_(Add UI improvement ideas here as they come up)_

### Performance Optimization Ideas
_(Add performance improvement ideas here)_

### Developer Experience Ideas
_(Add DX improvement ideas here)_

---

## Ideas That Have Been Implemented

These ideas were originally captured in this TODO and have since been completed:

- ✅ **Vite Migration (Phase 2)** - Modernize frontend architecture with Vite build system, Vue Router, and Pinia state management (Completed 2025-10-20)
- ✅ **NPX Support** - Allow running Claude Code Manager via `npx claude-code-config-manager` without local installation (Completed 2025-10-17)
