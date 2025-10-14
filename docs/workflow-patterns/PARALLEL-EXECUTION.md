# Parallel Execution Pattern

## Overview

Parallel execution enables multiple agents to work simultaneously on independent tasks, dramatically reducing development time. When tasks have no file conflicts or logical dependencies, parallelization can reduce execution time by 50-70%.

**Key Insight:** 4 tasks × 5 minutes each = 5 minutes total in parallel (not 20 minutes sequential)

---

## When to Use Parallel Execution

Use parallel execution when tasks meet **ALL** these criteria:

✅ **Independent Files**
- Each task modifies separate files, OR
- Multiple tasks append to shared files (CSS, HTML) without conflicting edits

✅ **No Logical Dependencies**
- Task B doesn't need Task A's output to function
- No integration points requiring sequential ordering

✅ **Same Branch**
- All work happens on the same feature branch
- No cross-branch dependencies

✅ **Similar Scope**
- All tasks are small (15-30 minutes each)
- Roughly equivalent complexity

---

## When NOT to Use Parallel Execution

❌ **File Conflicts**
- Multiple tasks edit the same line of the same file
- Modifications would create merge conflicts

❌ **Logical Dependencies**
- Task B requires Task A's output (e.g., integration test needs component implementation)
- Sequential ordering is semantically required

❌ **Shared State**
- Tasks manipulate shared data structures that would conflict
- Race conditions or data corruption risk

❌ **Testing Dependencies**
- Cannot test Task B until Task A is complete
- Integration points require sequential validation

---

## Pattern 1: Parallel Component Development

### Use Case
Building multiple independent UI components (cards, views, forms, services) that share no dependencies.

### Example: Configuration Cards (Story 3.2)

**Tasks:**
- Task 3.2.1: Create `AgentCard.js` (6 min)
- Task 3.2.2: Create `CommandCard.js` (4 min)
- Task 3.2.3: Create `HookCard.js` (3 min)
- Task 3.2.4: Create `MCPCard.js` (3 min)

**Dependency Analysis:**
- ✅ Each component in separate file → No file conflicts
- ✅ Styling appended to shared `components.css` → Append-only, no conflicts
- ✅ Integration in `project-detail.html` → Append-only, no conflicts
- ✅ Independent API endpoints → No shared state
- ✅ Isolated Vue components → No cross-component dependencies

**Execution:**
```
Orchestrator launches 4 frontend-developers in parallel:

@frontend-developer-1: Implement Task 3.2.1 (AgentCard)
@frontend-developer-2: Implement Task 3.2.2 (CommandCard)
@frontend-developer-3: Implement Task 3.2.3 (HookCard)
@frontend-developer-4: Implement Task 3.2.4 (MCPCard)

[Wait for ALL to complete: 6 minutes (longest task)]

@git-workflow-specialist: Commit all 4 components together

Continue with Task 3.2.5 (integration) sequentially
```

**Results:**
- Sequential time: 20m 49s (6+4+3+3 + 4 separate commits)
- Parallel time: 7m 23s (6 min + 1 batch commit)
- **Time saved: 13m 26s (64% reduction)**

---

## Pattern 2: Parallel API Endpoints

### Use Case
Creating multiple independent REST API endpoints with no shared business logic.

### Example: CRUD Endpoints

**Tasks:**
- Task 4.1: Implement `GET /api/agents`
- Task 4.2: Implement `GET /api/commands`
- Task 4.3: Implement `GET /api/hooks`
- Task 4.4: Implement `GET /api/mcp`

**Dependency Analysis:**
- ✅ Each endpoint in separate route handler
- ✅ Independent parsers (no shared code)
- ✅ No cross-endpoint dependencies

**Execution:**
```
@backend-architect-1: Implement Task 4.1
@backend-architect-2: Implement Task 4.2
@backend-architect-3: Implement Task 4.3
@backend-architect-4: Implement Task 4.4

[All complete] → Single commit
```

---

## Pattern 3: Parallel Parser Development

### Use Case
Creating multiple file parsers for different configuration types.

### Example: Configuration Parsers

**Tasks:**
- Task 5.1: Agent parser (YAML frontmatter)
- Task 5.2: Command parser (Markdown)
- Task 5.3: Hook parser (JSON)
- Task 5.4: MCP parser (JSON)

**Dependency Analysis:**
- ✅ Each parser in separate module
- ✅ Independent test fixtures
- ✅ No shared parsing logic

**Execution:**
```
@data-parser-1: Implement Task 5.1
@data-parser-2: Implement Task 5.2
@data-parser-3: Implement Task 5.3
@data-parser-4: Implement Task 5.4

[All complete] → Single commit
```

---

## Pattern 4: Parallel Documentation Updates

### Use Case
Updating multiple documentation files that don't reference each other.

### Example: Phase 2 PRDs

**Tasks:**
- Task 6.1: Update `PRD-Phase2-Subagents.md`
- Task 6.2: Update `PRD-Phase2-Commands.md`
- Task 6.3: Update `PRD-Phase2-Hooks.md`
- Task 6.4: Update `PRD-Phase2-MCP.md`

**Dependency Analysis:**
- ✅ Each PRD in separate file
- ✅ No cross-references between docs
- ✅ Independent content

**Execution:**
```
@documentation-engineer-1: Update Task 6.1
@documentation-engineer-2: Update Task 6.2
@documentation-engineer-3: Update Task 6.3
@documentation-engineer-4: Update Task 6.4

[All complete] → Single commit
```

---

## Implementation Guide for Orchestrator

### Step 1: Assess Tasks for Parallelization

```markdown
**Before executing Story tasks, analyze dependencies:**

For each pair of tasks (A, B):
1. Do they modify the same files? (Conflict check)
2. Does B need A's output? (Dependency check)
3. Can both run on same branch? (Branch check)

If ALL answers are:
- No conflict + No dependency + Same branch → Parallel-capable
```

### Step 2: Launch Parallel Agents

Use **one message with multiple Task tool calls** to launch parallel agents:

```markdown
I'm launching 4 frontend-developers in parallel to implement independent components:

[Use Task tool 4 times in single message]
- Task 3.2.1: AgentCard
- Task 3.2.2: CommandCard
- Task 3.2.3: HookCard
- Task 3.2.4: MCPCard
```

### Step 3: Wait for All Completions

Monitor all parallel agents for completion. Do not proceed until **ALL** tasks finish.

### Step 4: Batch Commit

After all parallel tasks complete, invoke git-workflow-specialist **once** to commit all changes together:

```markdown
@git-workflow-specialist: Commit all 4 card components completed in parallel

Files modified:
- src/frontend/components/AgentCard.js
- src/frontend/components/CommandCard.js
- src/frontend/components/HookCard.js
- src/frontend/components/MCPCard.js
- src/frontend/styles/components.css
- src/frontend/views/project-detail.html

Commit message: "feat: implement configuration cards for all 4 types (Tasks 3.2.1-3.2.4)"
```

---

## Commit Strategy for Parallel Work

### Default (Sequential Work)
**Commit after each task** (15-30 min intervals)
- Task A → Test → Commit → Task B → Test → Commit

### Parallel Work Exception
**Batch commit after all parallel tasks complete**
- Tasks A+B+C+D (parallel) → All complete → Single commit
- Still maintains the "commit every 15-30 min" guideline if total parallel time < 30 min

### Example Timeline

**Sequential:**
```
00:00 - Start Task A
00:05 - Complete Task A → Commit (5 min)
00:05 - Start Task B
00:09 - Complete Task B → Commit (4 min)
00:09 - Start Task C
00:12 - Complete Task C → Commit (3 min)
00:12 - Start Task D
00:15 - Complete Task D → Commit (3 min)

Total: 15 minutes + 4 commit operations
```

**Parallel:**
```
00:00 - Start Tasks A+B+C+D (parallel)
00:05 - All complete (longest task)
00:06 - Batch commit all 4 tasks

Total: 6 minutes + 1 commit operation
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Assuming Sequential by Default
**Wrong:** "Tasks are listed sequentially, so execute sequentially"
**Right:** "Analyze dependencies first, parallelize when possible"

### ❌ Mistake 2: Over-Committing in Parallel Work
**Wrong:** Commit each parallel task separately as they complete
**Right:** Wait for all parallel tasks to finish, then batch commit

### ❌ Mistake 3: Parallelizing Dependent Tasks
**Wrong:** Run Task B (integration test) in parallel with Task A (component implementation)
**Right:** Task A must complete before Task B can start (dependency exists)

### ❌ Mistake 4: Ignoring File Conflicts
**Wrong:** Parallel tasks editing same line of shared file
**Right:** Analyze file conflicts before parallelizing (append-only is safe)

### ❌ Mistake 5: No Testing Before Batch Commit
**Wrong:** Parallel tasks complete → Immediate batch commit
**Right:** Parallel tasks complete → Each tests independently → All pass → Batch commit

---

## Decision Tree

```
START: Orchestrator has N tasks to execute
│
├─ Are all tasks independent? (no file conflicts, no dependencies)
│  │
│  ├─ YES → Can tasks run on same branch?
│  │  │
│  │  ├─ YES → Are tasks similarly sized (15-30 min each)?
│  │  │  │
│  │  │  ├─ YES → ✅ USE PARALLEL EXECUTION
│  │  │  │         - Launch N agents in parallel
│  │  │  │         - Wait for all to complete
│  │  │  │         - Batch commit
│  │  │  │
│  │  │  └─ NO → ❌ USE SEQUENTIAL EXECUTION
│  │  │           (Tasks too varied in scope)
│  │  │
│  │  └─ NO → ❌ USE SEQUENTIAL EXECUTION
│  │           (Cross-branch dependencies)
│  │
│  └─ NO → ❌ USE SEQUENTIAL EXECUTION
│           (Dependencies or conflicts exist)
│
END
```

---

## Metrics and Expected Gains

| Scenario | Sequential Time | Parallel Time | Savings | Efficiency Gain |
|----------|-----------------|---------------|---------|-----------------|
| 4 components (6+4+3+3 min) | 20m 49s | 7m 23s | 13m 26s | 64% |
| 3 API endpoints (5+5+5 min) | 18m | 6m | 12m | 67% |
| 5 parsers (4+4+4+4+4 min) | 23m | 5m | 18m | 78% |
| 2 services (8+8 min) | 18m | 9m | 9m | 50% |

**General Formula:**
- Sequential time = Sum of all task durations
- Parallel time = Longest task duration + commit overhead
- Savings = Sequential - Parallel
- Efficiency gain = Savings / Sequential × 100%

---

## Success Criteria

Parallel execution is successful when:
- ✅ All parallel tasks complete without errors
- ✅ No merge conflicts during batch commit
- ✅ Tests pass for all components after integration
- ✅ Commit message accurately references all parallel tasks
- ✅ Total time < 50% of sequential execution time

---

## References

- **Workflow Analysis (Oct 13, 2025):** Session 8dd8b8b9 - Identified 64% time loss due to sequential execution
- **October 7 Revert:** `/home/claude/manager/docs/workflow-analysis-20251007.md` - Why frequent commits matter
- **Orchestrator Instructions:** `/home/claude/manager/.claude/agents/subagent-orchestrator.md` - Step 3.5 dependency analysis

---

## Questions?

**Q: Can I parallelize tasks with different agents (e.g., frontend + backend)?**
A: Yes! As long as they meet the independence criteria (no file conflicts, no dependencies).

**Q: What if one parallel task fails?**
A: Stop all work. Fix the failing task. Re-run all parallel tasks or just the failed one depending on failure type.

**Q: Should I always use parallel execution when possible?**
A: Not always. If tasks are very quick (<2 min each), the coordination overhead may not be worth it. Use judgment.

**Q: How many parallel agents can I launch at once?**
A: No hard limit, but 3-5 is typical. More than 8 may become difficult to coordinate.

**Q: Does parallel execution work with git branches?**
A: Yes, but all parallel tasks must work on the **same feature branch**. Cross-branch parallelization is not supported.

---

**Last Updated:** 2025-10-13
**Author:** workflow-analyzer
**Status:** ✅ Active Pattern - Use Immediately
