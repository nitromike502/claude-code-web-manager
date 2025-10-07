# SWARM Orchestrator
# Multi-Agent Claude Code Manager Development Coordinator

<task>
Launch the subagent-orchestrator to coordinate Claude Code Manager development through a structured 4-phase workflow with Epic/Story/Task breakdown.
</task>

<context>
**Project**: Claude Code Manager - Web-based tool for managing Claude Code projects
**Requirements**: See docs/PRD-Phase1-MVP.md for complete specifications
**Tech Stack**: Node.js + Express (backend), Vue 3 + PrimeVue (frontend, CDN)
**Architecture**: Local web server on port 8420, live file system reads
**Current Status**: Orchestrator will assess project state and coordinate development

**Development Method**: SWARM (Simultaneous Work And Resource Management)
**Team Structure**: See docs/Subagent-Team.md for complete team definitions
</context>

<execution>
Invoke the `subagent-orchestrator` agent to:
1. Assess current project state and determine active phase
2. Read docs/PRD-Phase1-MVP.md for complete project requirements
3. Review docs/Subagent-Team.md for team structure and workflow
4. Create comprehensive Epic/Story/Task breakdown with TodoWrite
5. Coordinate specialized agents through development workflow
6. Manage phase progression: Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4
7. Ensure developer → code-reviewer → git-workflow-specialist handoff chain
8. Include user review checkpoints after each significant feature
9. Deliver production-ready Claude Code Manager Phase 1 MVP

The orchestrator has full authority to coordinate all specialized agents and manage the complete development lifecycle using the approved workflow from Subagent-Team.md.
</execution>
