---
name: Write File
description: A skill to write content to a file at a specified path using bash heredoc syntax. Use this when you need to create or overwrite a file with text content from within a skill.
---

# Write File Skill

This skill provides a simple way to write content to files using bash heredoc syntax.

## Usage

The skill accepts two arguments:

1. **Target Path** - The file path where the content should be written
2. **Content** - The text content to write to the file

## Script

The skill uses a bash script that writes content to a file:

```bash
#!/bin/bash

TARGET_PATH="$1"
CONTENT="$2"

cat << 'EOF' > "$TARGET_PATH"
$CONTENT
EOF
```

## Examples

### Example 1: Create a simple text file

**Input:**
- Target Path: `/tmp/hello.txt`
- Content: `Hello, World!`

**Output:**
- Creates file at `/tmp/hello.txt` with content `Hello, World!`

### Example 2: Create a configuration file

**Input:**
- Target Path: `/etc/myapp/config.txt`
- Content:
  ```
  debug=true
  port=8080
  ```

**Output:**
- Creates configuration file with multiple lines

## Notes

- The script will overwrite existing files
- Ensure the directory path exists before writing
- Use proper escaping for special characters in content
- The heredoc syntax preserves the exact formatting of the content
