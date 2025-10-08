---
name: analyze-workflow
description: Analyzes a recent Claude Code development session from logs to identify improvements, inefficiencies, and optimization opportunities
tools: Read, Glob, Grep, Bash, Task
argument-hint: "[date] - Optional: YYYYMMDD format date of session to analyze. If omitted, lists available sessions for selection"
color: cyan
---

# Workflow Session Analyzer

Analyze Claude Code development sessions from `.claude/logs/` to identify workflow improvements, inefficiencies, and optimization opportunities.

## Task

Parse session transcripts from a specific date directory, analyze multi-agent workflows, evaluate development patterns, and generate a comprehensive report with actionable recommendations.

## Execution Flow

**Arguments Provided:** `$ARGUMENTS`

### Step 1: Determine Target Session

**If date argument is provided (YYYYMMDD format):**
1. Validate the date format matches YYYYMMDD pattern
2. Construct the log directory path: `/home/claude/manager/.claude/logs/{YYYYMMDD}/`
3. Verify the directory exists using Bash (`ls` or `test -d`)
4. If directory doesn't exist:
   - Inform user clearly: "No logs found for date {YYYYMMDD}"
   - Suggest running the command without arguments to see available dates
   - Exit gracefully
5. If directory exists: Proceed to Step 2 with this directory

**If NO date argument is provided:**
1. Use Bash to scan `.claude/logs/` directory and list all subdirectories
2. Filter for directories matching YYYYMMDD format (8 digits)
3. Sort directories chronologically (most recent first)
4. If no log directories found:
   - Inform user: "No Claude Code session logs found in `.claude/logs/`"
   - Suggest they may need to enable logging or check the correct project directory
   - Exit gracefully
5. If log directories found:
   - Present them as a numbered list with dates formatted for readability (e.g., "2025-10-07" instead of "20251007")
   - Example output:
     ```
     Available Claude Code session logs:

     1. October 7, 2025 (20251007)
     2. October 6, 2025 (20251006)
     3. October 5, 2025 (20251005)

     Please select a session to analyze by providing the date in YYYYMMDD format.
     Example: /analyze-workflow 20251007
     ```
   - Wait for user to re-invoke the command with their chosen date
   - Exit gracefully

### Step 2: Prepare for Analysis

1. Confirm the target log directory path
2. Use Glob or Bash to preview the contents:
   - Count total log files
   - Identify file types (e.g., `*.log`, `*.md`, session transcripts)
   - Look for patterns suggesting multiple sessions within the same date
3. Inform the user:
   ```
   Analyzing session logs from: /home/claude/manager/.claude/logs/{YYYYMMDD}/
   Found {count} log files to analyze.
   ```

### Step 3: Delegate to Workflow Analyzer

Invoke the `workflow-analyzer` subagent using the Task tool with the following instructions:

**Critical Instructions for workflow-analyzer:**

1. **Log Directory:** Analyze all files in `/home/claude/manager/.claude/logs/{YYYYMMDD}/`

2. **Multiple Sessions Detection:**
   - There may be MULTIPLE distinct development sessions within a single date directory
   - Identify session boundaries by analyzing:
     - Timestamps and time gaps between log entries
     - Session initialization markers or conversation starts
     - File naming patterns (e.g., `session-1.log`, `session-2.log`, or timestamped files)
     - Context shifts indicating a new conversation or task
   - If multiple sessions detected, clearly separate them in your analysis

3. **Subagent Transcript Matching:**
   - Attempt to correlate subagent transcripts with their corresponding main agent sessions
   - Use these correlation strategies:
     - **Timestamps:** Match subagent invocation times with main agent logs
     - **Session IDs:** Look for session identifiers in log file names or metadata
     - **Task Context:** Match task descriptions in main agent logs with subagent activities
     - **File Naming Patterns:** Identify naming conventions that link files (e.g., `main-{id}.log` and `subagent-{id}.log`)
   - If correlation is ambiguous, note this in your analysis and analyze what you can determine

4. **Comprehensive Analysis:**
   - Parse ALL log files in the target directory
   - Map the complete workflow: user requests → task breakdown → subagent selection → execution → results
   - Evaluate subagent selection appropriateness and handoff effectiveness
   - Identify workflow efficiency issues, redundancies, and bottlenecks
   - Assess code quality, documentation consistency, and adherence to project standards (CLAUDE.md)
   - Note any tool misuse, permission issues, or context loss between handoffs

5. **Metrics to Extract:**
   - Tasks completed vs. attempted (per session if multiple)
   - Subagents utilized with frequency counts
   - Tool usage statistics (Read, Write, Edit, Bash, Grep, Glob, etc.)
   - Estimated duration (if timestamps available)
   - Number of iterations or corrections required
   - Completion rate percentage

6. **Multi-Session Handling:**
   - If multiple distinct sessions exist within the date:
     - Provide a **per-session breakdown** with individual metrics and findings
     - Also provide an **aggregate summary** showing patterns across all sessions
     - Highlight differences between sessions (e.g., Session 1 was more efficient than Session 2)

7. **Report Structure:**
   Follow the standard workflow-analyzer report format:
   - Executive Summary (mention number of sessions if multiple)
   - Session Metrics (aggregate + per-session breakdown if applicable)
   - Strengths Observed
   - Issues and Inefficiencies Identified (with severity: High/Medium/Low)
   - Workflow Analysis (task decomposition, handoffs, parallelization opportunities, bottlenecks)
   - Code and Documentation Quality
   - Recommendations (prioritized: High/Medium/Low)
   - Examples from Logs (specific excerpts with references)
   - Conclusion

8. **Output Format:**
   - Present the report directly to the user in the conversation
   - Use clear markdown formatting with headers, lists, and code blocks
   - Highlight critical findings with bold text
   - Include specific log references (file names and line numbers) for all findings

### Step 4: Follow-Up Options

After the workflow-analyzer completes its report, offer the user:

1. **Save Report:** "Would you like to save this analysis to a file? I can write it to `/home/claude/manager/docs/workflow-analysis-{date}.md`"
2. **Deep Dive:** "Would you like me to investigate any specific finding in more detail?"
3. **Compare Sessions:** "Would you like to compare this session with another date?"

## Edge Cases

**Invalid date format provided:**
- Detect non-YYYYMMDD formats (e.g., "2025-10-07", "Oct 7", "yesterday")
- Inform user of correct format: "Please provide date in YYYYMMDD format (e.g., 20251007)"
- Optionally suggest running without arguments to see available dates

**Missing log directory:**
- Check if `.claude/logs/` directory itself exists
- If not: "The `.claude/logs/` directory does not exist. Logging may not be enabled for this project."
- If yes but empty: "No session logs found. Check if logging is enabled and sessions have been recorded."

**Ambiguous session boundaries:**
- If the workflow-analyzer cannot clearly distinguish between multiple sessions, note this
- Analyze as a single continuous session and flag the ambiguity in the report

**Corrupted or incomplete log files:**
- Handle gracefully with informative error messages
- Analyze what is readable and note gaps or issues in the report

**Permission issues:**
- If log files cannot be read due to permissions, inform the user clearly
- Suggest checking file permissions on the log directory

## Best Practices

- **Always use absolute paths:** `/home/claude/manager/.claude/logs/...`
- **Be informative:** Clearly communicate what's happening at each step
- **Handle errors gracefully:** Provide actionable guidance when things go wrong
- **Respect user choice:** When listing available dates, wait for explicit selection
- **Be thorough:** Ensure the workflow-analyzer receives complete, clear instructions
- **Prioritize findings:** Focus on high-impact improvements in recommendations

---

**Ready to analyze!** I'll determine which session to analyze based on your input, then delegate to the workflow-analyzer for comprehensive analysis.
