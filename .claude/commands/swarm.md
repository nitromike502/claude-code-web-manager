# SWARM Orchestrator
# Multi-Agent Claude Code Manager Development Coordinator

<task>
Launch the subagent-orchestrator to coordinate Claude Code Manager development through a structured workflow with Epic/Story/Task breakdown. Automatically creates tickets if none exist.
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
Invoke the `subagent-orchestrator` agent to:

## Step 1: Check for Existing Tickets
1. Check if TodoWrite tickets/tasks already exist from previous `/plan` execution
2. Review any existing tickets to understand current work scope and status
3. Determine if tickets are sufficient to proceed with development

## Step 2: Auto-Plan if Needed
If NO tickets exist or tickets are stale/completed:
1. Assess current project state (read CLAUDE.md, check directory structure, git status)
2. Determine current phase and what work comes next
3. Identify appropriate PRD sections for planning
4. Create comprehensive Epic/Story/Task breakdown with TodoWrite tool:
   - **Epics**: Major feature areas (e.g., "Backend API Development", "Frontend UI Development")
   - **Stories**: User-facing features within each epic (e.g., "Project List View", "Subagent Viewer")
   - **Tasks**: Technical implementation steps for each story (e.g., "Create /api/projects endpoint")
5. Include agent assignments, dependencies, acceptance criteria, and phase gates

**Note**: This auto-planning mirrors the `/plan` command functionality, ensuring you can run `/swarm` at any time.

## Step 3: Execute Development Workflow
With tickets ready (existing or newly created):
1. Read relevant PRD documents (docs/PRD-Phase1-MVP.md, docs/Subagent-Team.md)
2. Coordinate specialized agents through development workflow:
   - wireframe-designer for UI mockups
   - backend-architect for API development
   - frontend-developer for Vue/PrimeVue components
   - data-parser for configuration file parsing
   - integration-tester for testing and verification
   - code-reviewer for quality assurance
   - documentation-engineer for documentation updates (after feature implementation)
   - git-workflow-specialist for commits and PRs
3. Manage phase progression through development lifecycle
4. Ensure proper handoff chain: developer → documentation-engineer → code-reviewer → git-workflow-specialist
5. Include user review checkpoints after each significant feature
6. Track progress and mark tickets as completed

## Step 4: Deliver Results
1. Provide summary of completed work
2. Identify any remaining tickets or next steps
3. Recommend running `/project-status` to see updated state
4. Suggest `/plan` if new phase or work area needs ticket breakdown

The orchestrator intelligently handles both planning and execution, allowing you to run `/swarm` at any stage of development - it will figure out what needs to happen next.
</execution>
