---
name: broken-agent
description: This agent has malformed YAML frontmatter
tools: [Read, Write
model: claude-sonnet-4
missing_colon_here
---

# Broken Agent

This agent file has intentionally malformed YAML frontmatter to test error handling.
The parser should gracefully skip this file and generate a warning.
