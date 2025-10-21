# Write File Skill

A Claude Code Skill for writing content to files using bash heredoc syntax.

## Files

- `SKILL.md` - The skill definition and documentation (read by Claude)
- `write-file.sh` - The bash script that performs the write operation
- `README.md` - This file

## How to Use

This skill can be invoked from Claude Code conversations. It accepts two arguments:

1. **Target Path** - The absolute path where the file should be written
2. **Content** - The text content to write to the file

## Script Behavior

The script uses bash's heredoc syntax to write content:

```bash
cat << EOF > "$TARGET_PATH"
$CONTENT
EOF
```

This approach:
- Preserves the exact formatting of the content (newlines, indentation, etc.)
- Allows variable expansion in the content
- Is safe and portable across systems
- Automatically creates the file or overwrites if it exists

## Error Handling

The script includes validation for:
- Missing target path argument
- Missing content argument
- File write failures

## Notes

- The directory containing the target file must exist
- The script will overwrite existing files without warning
- Special characters and newlines in content are preserved
- Absolute paths are recommended for the target path
