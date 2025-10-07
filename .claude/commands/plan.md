# Project Planning & Ticket Creation
# Creates Epic/Story/Task breakdown for Claude Code Manager development

<task>
Launch the project-manager agent to assess current project state and create appropriate Epic/Story/Task breakdown based on what's next in the development workflow.
</task>

<context>
**Project**: Claude Code Manager - Web-based tool for managing Claude Code projects
**Tech Stack**: Node.js + Express (backend), Vue 3 + PrimeVue (frontend, CDN)
**Architecture**: Local web server on port 8420, live file system reads

**Development Method**: SWARM (Simultaneous Work And Resource Management)
**Team Structure**: See docs/Subagent-Team.md for complete team definitions

**Available PRDs**:
- docs/PRD-Phase1-MVP.md (reviewed & approved)
- docs/PRD-Phase2-*.md (future phases, not reviewed)
</context>

<execution>
Invoke the `project-manager` agent to:

## Step 1: Assess Current Project State
1. Read CLAUDE.md to understand project structure and success criteria
2. Check current directory structure (src/, package.json, wireframes/, etc.)
3. Review git status and recent commits to understand completed work
4. Check for existing TodoWrite tickets/tasks
5. Determine current phase based on CLAUDE.md success criteria:
   - Phase 0: Requirements/Planning (wireframes needed?)
   - Phase 1: MVP Development (backend/frontend work?)
   - Testing/Polish phase?
   - Phase 2: Future features?

## Step 2: Identify Next Development Work
Based on current state, determine which PRD sections need tickets:
- If wireframes not done: Create tickets for wireframe design phase
- If backend not started: Create tickets from PRD backend requirements
- If frontend not started: Create tickets from PRD frontend requirements
- If integration needed: Create integration and testing tickets
- If Phase 1 complete: Check if user wants Phase 2 planning

## Step 3: Create Appropriate Ticket Breakdown
Use TodoWrite tool to create Epic/Story/Task breakdown for identified next work:
- **Epics**: Major feature areas (e.g., "Backend API Development", "Frontend UI Development")
- **Stories**: User-facing features within each epic (e.g., "Project List View", "Subagent Viewer")
- **Tasks**: Technical implementation steps for each story (e.g., "Create /api/projects endpoint")

Include:
- Appropriate specialized agent assignments based on team structure
- Dependencies between tasks
- Acceptance criteria for each story
- Phase gates and review checkpoints

## Step 4: Output Plan Summary
Provide clear summary including:
- What phase/work area these tickets address
- Which PRD sections were used for planning
- High-level overview of epics and stories created
- Recommendation to run `/swarm` to begin execution

The project-manager will intelligently generate tickets for whatever work comes next, ensuring continuity in the development workflow.
</execution>
