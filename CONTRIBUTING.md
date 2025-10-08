# Contributing to Claude Code Manager

Thank you for your interest in contributing to the Claude Code Manager project! This document provides guidelines and information for contributors.

## Table of Contents

1. [Development Philosophy](#development-philosophy)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Code Style Guidelines](#code-style-guidelines)
6. [Testing](#testing)
7. [Submitting Changes](#submitting-changes)
8. [SWARM Methodology](#swarm-methodology)

---

## Development Philosophy

This project follows these core principles:

1. **Simplicity First** - Avoid unnecessary complexity, use simple solutions when possible
2. **No Build Tools** - Direct execution without compilation (Vue via CDN, Node.js without transpilation)
3. **Read-First, Write-Later** - Phase 1 focuses on viewing configurations, editing comes in Phase 2
4. **Progressive Enhancement** - Basic functionality works everywhere, enhanced features for modern browsers
5. **Local-First** - Designed for local development workflows, no cloud dependencies

---

## Getting Started

### Prerequisites

- **Node.js 18.0.0 or higher** - Required for backend server
- **npm** - Comes with Node.js
- **Claude Code** - Have at least one Claude Code project configured
- **Git** - For version control
- **Code Editor** - VS Code, Sublime Text, or your preferred editor

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd manager

# Install dependencies
npm install

# Start the development server
npm run dev

# Open browser
open http://localhost:8420
```

### Verify Setup

```bash
# Check server health
curl http://localhost:8420/api/health

# Check project discovery
curl http://localhost:8420/api/projects
```

---

## Project Structure

```
manager/
├── .claude/                        # Claude Code configuration
│   ├── agents/                     # Specialized subagents
│   │   ├── backend-architect.md
│   │   ├── frontend-developer.md
│   │   ├── data-parser.md
│   │   └── ...
│   ├── commands/                   # Custom slash commands
│   │   ├── swarm.md
│   │   ├── docs.md
│   │   └── ...
│   └── settings.json               # Project settings
├── docs/                           # Project documentation
│   ├── PRD-Phase1-MVP.md          # Requirements (Phase 1)
│   ├── PRD-Phase2-*.md            # Future phase requirements
│   ├── wireframes/                # UI wireframes and specs
│   ├── tickets/                   # Epic/Story/Task breakdown
│   └── API.md                     # API documentation
├── src/
│   ├── backend/                   # Express server
│   │   ├── server.js             # Main server entry point
│   │   ├── routes/               # API route handlers
│   │   ├── services/             # Business logic
│   │   ├── parsers/              # File parsing utilities
│   │   └── utils/                # Helper functions
│   └── frontend/                  # Vue 3 SPA
│       ├── index.html            # Main HTML file
│       ├── css/                  # Stylesheets
│       │   ├── variables.css    # Theme colors
│       │   ├── global.css       # Global styles
│       │   └── components.css   # Component styles
│       └── js/                   # JavaScript modules
│           ├── app.js           # Vue app initialization
│           ├── api.js           # Backend API client
│           ├── router.js        # Client-side routing
│           └── components/      # Vue components
├── package.json                   # Dependencies and scripts
├── README.md                      # Project overview
├── CLAUDE.md                      # Claude Code instructions
└── CONTRIBUTING.md                # This file
```

---

## Development Workflow

### 1. Understanding the Task

Before starting work:
- Read relevant PRD documents in `docs/`
- Review related wireframes in `docs/wireframes/`
- Check existing tickets in `docs/tickets/`
- Understand the phase (Phase 1 = read-only, Phase 2+ = CRUD)

### 2. Backend Development

**Making Changes:**
```bash
# Start with auto-reload
npm run dev

# Edit files in src/backend/
# Server automatically restarts on changes
```

**Adding New API Endpoints:**
1. Add route handler in `src/backend/routes/`
2. Implement service logic in `src/backend/services/`
3. Update API documentation in `docs/API.md`
4. Test with curl or browser

**Example - Adding New Endpoint:**
```javascript
// src/backend/routes/projects.js
router.get('/:projectId/settings', async (req, res) => {
  try {
    const { projectId } = req.params;
    const settings = await getProjectSettings(projectData.path);
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### 3. Frontend Development

**Making Changes:**
```bash
# Server should be running
npm run dev

# Edit files in src/frontend/
# Refresh browser to see changes (no build step)
```

**Adding New Components:**
1. Create component file in `src/frontend/js/components/`
2. Export component using Vue's `defineComponent`
3. Import and register in parent component or `app.js`
4. Add styles to `src/frontend/css/components.css`

**Example - Creating Component:**
```javascript
// src/frontend/js/components/MyComponent.js
export default {
  name: 'MyComponent',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="my-component">
      <h3>{{ data.title }}</h3>
      <p>{{ data.description }}</p>
    </div>
  `
}
```

### 4. Styling Guidelines

**CSS Organization:**
- **variables.css** - Define new color/spacing variables here
- **global.css** - Add global styles and utilities
- **components.css** - Add component-specific styles

**Theme Support:**
```css
/* Add to variables.css */
:root[data-theme="dark"] {
  --my-color: #64B5F6;
}

:root[data-theme="light"] {
  --my-color: #1976D2;
}

/* Use in components.css */
.my-component {
  color: var(--my-color);
}
```

### 5. Testing

**Manual Testing:**
```bash
# Test API endpoints
curl http://localhost:8420/api/projects
curl http://localhost:8420/api/projects/PROJECT_ID/agents

# Test frontend
# Open http://localhost:8420 in browser
# Check browser console (F12) for errors
# Test all views (Dashboard, Project Detail, User/Global)
# Test search/filter functionality
# Test dark/light theme toggle
# Test responsive design (resize browser)
```

**Automated Testing (Future):**
```bash
npm test
```

### 6. Documentation

**Update Documentation When:**
- Adding new API endpoints → Update `docs/API.md`
- Adding new components → Update `src/frontend/README.md`
- Changing configuration → Update `README.md` or `CLAUDE.md`
- Adding new features → Update relevant PRD documents

---

## Code Style Guidelines

### JavaScript

**Style:**
- Use ES6+ features (const/let, arrow functions, async/await)
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Descriptive variable names

**Good:**
```javascript
const projectData = await getProjectAgents(projectPath);
const agentNames = projectData.agents.map(a => a.name);
```

**Avoid:**
```javascript
var pd = await getProjectAgents(p);
var an = pd.agents.map(function(a) { return a.name; });
```

### Vue Components

**Structure:**
```javascript
export default {
  name: 'ComponentName',
  props: { /* ... */ },
  data() { /* ... */ },
  computed: { /* ... */ },
  methods: { /* ... */ },
  template: `...`
}
```

**Template Guidelines:**
- Use template literals for multi-line templates
- Keep templates readable (use proper indentation)
- Extract complex logic to computed properties or methods
- Use PrimeVue components consistently

### CSS

**Guidelines:**
- Use CSS custom properties for colors and spacing
- Mobile-first responsive design (with `@media` queries)
- BEM-style naming for component classes (`.component-name__element`)
- Avoid `!important` unless absolutely necessary

**Example:**
```css
.project-card {
  padding: var(--spacing-md);
  background: var(--bg-card);
  border-radius: var(--border-radius);
}

.project-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
```

### API Responses

**Always return consistent format:**
```javascript
// Success
res.json({
  success: true,
  data: result,
  error: null
});

// Error
res.status(500).json({
  success: false,
  error: error.message
});
```

---

## Testing

### Testing Checklist

**Backend:**
- [ ] API endpoint returns correct data structure
- [ ] Error handling works (invalid project ID, missing files, etc.)
- [ ] CORS headers are present
- [ ] Response times are reasonable
- [ ] Handles missing/malformed files gracefully

**Frontend:**
- [ ] Component renders without errors
- [ ] Data displays correctly
- [ ] Loading states show during API calls
- [ ] Error states display with helpful messages
- [ ] Empty states show when no data
- [ ] Responsive design works at different screen sizes
- [ ] Theme toggle switches correctly
- [ ] Navigation works (back button, breadcrumbs, links)

**Cross-Browser:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Cross-Platform (Future):**
- [ ] Linux
- [ ] macOS
- [ ] Windows (WSL)
- [ ] Windows (native)

---

## Submitting Changes

### Commit Messages

Use conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(backend): add settings endpoint for projects
fix(frontend): correct project card stat display
docs(api): update endpoint documentation for hooks
style(css): improve dark mode color contrast
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow code style guidelines
   - Update documentation
   - Test thoroughly

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

4. **Push to Remote**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Describe changes clearly
   - Reference related issues/tickets
   - Include screenshots for UI changes
   - List testing performed

6. **Code Review**
   - Address reviewer feedback
   - Make requested changes
   - Update PR description if needed

7. **Merge**
   - Squash commits if needed
   - Merge to main branch
   - Delete feature branch

---

## SWARM Methodology

This project uses the SWARM (Specialized Work Assignment & Resource Management) methodology with Claude Code subagents.

### Subagent Team Structure

**Specialized Roles:**
- **Backend Architect** - API design, server implementation
- **Frontend Developer** - Vue components, UI implementation
- **Data Parser** - File parsing, data extraction
- **Git Workflow Specialist** - Version control, PR management
- **Subagent Orchestrator** - Multi-agent coordination
- **Documentation Engineer** - Documentation creation

### Using Subagents

**Invoke with `/swarm` command:**
```
/swarm "Build API endpoint for project settings"
```

This will:
1. Break down the task into subtasks
2. Assign subtasks to appropriate subagents
3. Coordinate parallel work
4. Ensure proper handoffs between agents

**See also:**
- `.claude/agents/` - Subagent definitions
- `.claude/commands/swarm.md` - SWARM command documentation
- `docs/Subagent-Team.md` - Detailed team structure

### Coordination Workflow

1. **Planning** - Subagent Orchestrator breaks down Epic into Stories/Tasks
2. **Assignment** - Tasks assigned to specialized subagents
3. **Execution** - Subagents work in parallel where possible
4. **Handoff** - Clean handoffs when dependencies exist
5. **Integration** - Integration Tester verifies combined work
6. **Documentation** - Documentation Engineer updates docs

---

## Questions or Issues?

- **Documentation:** Check `docs/` directory
- **API Reference:** See `docs/API.md`
- **Wireframes:** See `docs/wireframes/`
- **Issues:** Create GitHub issue with detailed description
- **Discussion:** Use GitHub Discussions for questions

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Claude Code Manager! 🎉
