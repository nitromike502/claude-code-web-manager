# Manual Cleanup Required

The following untracked files should be manually deleted as they are test artifacts and out-of-scope files:

## Files to Delete

1. **vite.config.js** - Vite build config (out of scope per PRD - CDN-only approach)
2. **test-sidebar.html** - Debug/test file (temporary)
3. **.playwright-mcp/** - Directory with test screenshots (temporary)

## Why These Files Exist

These files were created during early development but are not part of the Phase 1 MVP scope:
- Vite was experimented with but PRD specifies CDN-hosted Vue 3 (no build step)
- test-sidebar.html was a debug file for sidebar testing
- .playwright-mcp/ contains screenshots from browser testing

## Deletion Commands

**Linux/Mac:**
```bash
rm vite.config.js
rm test-sidebar.html
rm -rf .playwright-mcp/
```

**Windows (Command Prompt):**
```cmd
del vite.config.js
del test-sidebar.html
rmdir /s /q .playwright-mcp
```

**Windows (PowerShell):**
```powershell
Remove-Item vite.config.js
Remove-Item test-sidebar.html
Remove-Item .playwright-mcp -Recurse
```

## Already Handled

These files are already in `.gitignore` (added in PR #1), so they won't be accidentally committed. This document just serves as a reminder to clean them up manually.

## After Deletion

After deleting these files, remove this instruction file as well:
```bash
rm CLEANUP_INSTRUCTIONS.md
```

Then you're ready to proceed with Phase 1 MVP development!
