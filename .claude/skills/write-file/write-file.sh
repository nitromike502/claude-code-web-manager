#!/bin/bash

# Write File Skill
# Accepts two arguments:
# 1. Target path (where to write the file)
# 2. Content (what to write to the file)

TARGET_PATH="$1"
CONTENT="$2"

# Validate arguments
if [ -z "$TARGET_PATH" ]; then
    echo "Error: Target path is required" >&2
    exit 1
fi

if [ -z "$CONTENT" ]; then
    echo "Error: Content is required" >&2
    exit 1
fi

# Write the content to the file using heredoc
cat << EOF > "$TARGET_PATH"
$CONTENT
EOF

if [ $? -eq 0 ]; then
    echo "Successfully wrote to $TARGET_PATH"
else
    echo "Error: Failed to write to $TARGET_PATH" >&2
    exit 1
fi
