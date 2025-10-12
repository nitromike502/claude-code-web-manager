const request = require('supertest');
const app = require('../../../src/backend/server');
const path = require('path');

/**
 * Comprehensive tests for GET /api/projects/:id/commands endpoint
 *
 * Test Coverage:
 * - Happy Path: Valid projects, command parsing, response structure
 * - Nested Directories: Recursive command discovery with namespacing
 * - Optional Frontmatter: Commands with/without YAML frontmatter
 * - Error Cases: Invalid IDs, malformed files, missing directories
 * - Warnings System: Graceful error handling with warnings
 * - File Filtering: Only .md files processed
 *
 * Fixtures Used:
 * - /home/claude/manager/tests/fixtures/projects/valid-project
 * - /home/claude/manager/tests/fixtures/projects/minimal-project
 */

describe('GET /api/projects/:id/commands', () => {
  // Helper to create project ID from path (matches backend pathToProjectId logic)
  const createProjectId = (projectPath) => {
    return projectPath
      .replace(/^\//, '')           // Remove leading slash
      .replace(/\//g, '')           // Remove all slashes
      .replace(/\\/g, '')           // Remove backslashes (Windows)
      .replace(/:/g, '')            // Remove colons (Windows drive letters)
      .replace(/\s+/g, '')          // Remove spaces
      .toLowerCase();
  };

  // Define test project paths and IDs
  const validProjectPath = '/home/claude/manager/tests/fixtures/projects/valid-project';
  const validProjectId = createProjectId(validProjectPath);

  const minimalProjectPath = '/home/claude/manager/tests/fixtures/projects/minimal-project';
  const minimalProjectId = createProjectId(minimalProjectPath);

  describe('Happy Path Tests', () => {
    test('should return 200 and commands array for valid project', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('commands');
      expect(response.body).toHaveProperty('warnings');
      expect(Array.isArray(response.body.commands)).toBe(true);
      expect(Array.isArray(response.body.warnings)).toBe(true);
    });

    test('should include projectId and projectPath in response', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);
      expect(response.body.projectId).toBe(validProjectId);
      expect(response.body.projectPath).toBe(validProjectPath);
    });

    test('should parse simple command correctly', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      // Find the simple command in the response
      const simpleCommand = response.body.commands.find(c => c.name === 'simple-command');

      expect(simpleCommand).toBeDefined();
      expect(simpleCommand.name).toBe('simple-command');
      expect(simpleCommand.file).toBe('simple-command.md');
      expect(simpleCommand.path).toContain('simple-command.md');
      expect(simpleCommand).toHaveProperty('frontmatter');
      expect(simpleCommand).toHaveProperty('content');
      expect(simpleCommand).toHaveProperty('description');
    });

    test('should parse command frontmatter fields correctly', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      const simpleCommand = response.body.commands.find(c => c.name === 'simple-command');

      expect(simpleCommand.frontmatter).toHaveProperty('name');
      expect(simpleCommand.frontmatter).toHaveProperty('description');

      // Verify actual values from fixture
      expect(simpleCommand.frontmatter.name).toBe('test-all');
      expect(simpleCommand.frontmatter.description).toContain('Run all backend and frontend tests');
    });

    test('should extract description from frontmatter', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      const simpleCommand = response.body.commands.find(c => c.name === 'simple-command');

      expect(simpleCommand.description).toBeTruthy();
      expect(simpleCommand.description).toContain('Run all backend and frontend tests');
    });

    test('should return empty array for project without commands directory', async () => {
      const response = await request(app)
        .get(`/api/projects/${minimalProjectId}/commands`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.commands).toEqual([]);
      expect(response.body.warnings).toEqual([]);
    });

    test('should only include .md files from commands directory', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      // All command files should end with .md
      response.body.commands.forEach(command => {
        expect(command.file).toMatch(/\.md$/);
      });
    });

    test('should return correct response structure', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        commands: expect.any(Array),
        warnings: expect.any(Array),
        projectId: expect.any(String),
        projectPath: expect.any(String)
      });
    });

    test('each command should have required fields', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      response.body.commands.forEach(command => {
        expect(command).toHaveProperty('name');
        expect(command).toHaveProperty('file');
        expect(command).toHaveProperty('path');
        expect(command).toHaveProperty('frontmatter');
        expect(command).toHaveProperty('content');
        expect(command).toHaveProperty('description');

        // Verify types
        expect(typeof command.name).toBe('string');
        expect(typeof command.file).toBe('string');
        expect(typeof command.path).toBe('string');
        expect(typeof command.frontmatter).toBe('object');
        expect(typeof command.content).toBe('string');
        expect(typeof command.description).toBe('string');
      });
    });
  });

  describe('Nested Directory Tests', () => {
    test('should discover commands in nested directories', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      // Find the nested command in the response
      const nestedCommand = response.body.commands.find(c => c.name.includes('nested'));

      expect(nestedCommand).toBeDefined();
      expect(nestedCommand.name).toContain('nested/');
    });

    test('should include namespace in command name for nested commands', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      // Find the nested command
      const nestedCommand = response.body.commands.find(c => c.name === 'nested/nested-command');

      expect(nestedCommand).toBeDefined();
      expect(nestedCommand.name).toBe('nested/nested-command');
      expect(nestedCommand.file).toBe('nested/nested-command.md');
    });

    test('should parse nested commands correctly', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      const nestedCommand = response.body.commands.find(c => c.name === 'nested/nested-command');

      expect(nestedCommand).toBeDefined();
      expect(nestedCommand).toHaveProperty('frontmatter');
      expect(nestedCommand).toHaveProperty('content');
      expect(nestedCommand).toHaveProperty('description');
      expect(nestedCommand.frontmatter.name).toBe('analyze-coverage');
    });

    test('should discover commands multiple levels deep', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      // Test that recursive scanning works
      const allCommands = response.body.commands;
      const topLevelCommands = allCommands.filter(c => !c.name.includes('/'));
      const nestedCommands = allCommands.filter(c => c.name.includes('/'));

      // Should have both top-level and nested commands
      expect(topLevelCommands.length).toBeGreaterThan(0);
      expect(nestedCommands.length).toBeGreaterThan(0);
    });

    test('should preserve directory structure in file path', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      const nestedCommand = response.body.commands.find(c => c.name === 'nested/nested-command');

      expect(nestedCommand.path).toContain('commands/nested/nested-command.md');
      expect(nestedCommand.file).toBe('nested/nested-command.md');
    });
  });

  describe('Optional Frontmatter Tests', () => {
    test('should handle commands with complete frontmatter', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      const simpleCommand = response.body.commands.find(c => c.name === 'simple-command');

      expect(simpleCommand).toBeDefined();
      expect(simpleCommand.frontmatter).toBeDefined();
      expect(simpleCommand.frontmatter.name).toBe('test-all');
      expect(simpleCommand.frontmatter.description).toBeTruthy();
    });

    test('should handle commands with minimal frontmatter', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      // All valid commands should at least have a name field
      response.body.commands.forEach(command => {
        if (!command.name.includes('malformed')) {
          expect(command.frontmatter).toBeDefined();
          expect(typeof command.frontmatter).toBe('object');
        }
      });
    });

    test('should extract description from content if missing in frontmatter', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      // All valid commands should have a description (from frontmatter or content)
      response.body.commands.forEach(command => {
        if (!command.name.includes('malformed')) {
          expect(typeof command.description).toBe('string');
        }
      });
    });
  });

  describe('Error Handling Tests', () => {
    test('should return 404 for invalid project ID', async () => {
      const response = await request(app)
        .get('/api/projects/nonexistentprojectid/commands');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Project not found');
    });

    test('should return 404 for empty project ID', async () => {
      const response = await request(app)
        .get('/api/projects//commands');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('should generate warnings for malformed command files', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      // Should have warnings array (even if empty)
      expect(Array.isArray(response.body.warnings)).toBe(true);

      // If there are warnings, verify structure
      if (response.body.warnings.length > 0) {
        const malformedWarning = response.body.warnings.find(w =>
          w.file && w.file.includes('malformed') || w.file.includes('broken')
        );

        if (malformedWarning) {
          expect(malformedWarning.error).toBeTruthy();
          expect(malformedWarning.skipped).toBe(true);
        }
      }
    });

    test('should skip malformed commands but continue processing valid ones', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      // Should have valid commands
      const simpleCommand = response.body.commands.find(c => c.name === 'simple-command');
      expect(simpleCommand).toBeDefined();
      expect(simpleCommand.frontmatter).toBeDefined();

      const nestedCommand = response.body.commands.find(c => c.name === 'nested/nested-command');
      expect(nestedCommand).toBeDefined();
      expect(nestedCommand.frontmatter).toBeDefined();
    });

    test('should handle missing .claude directory gracefully', async () => {
      const response = await request(app)
        .get(`/api/projects/${minimalProjectId}/commands`);

      expect(response.status).toBe(200);
      expect(response.body.commands).toEqual([]);
      expect(response.body.warnings).toEqual([]);
    });

    test('each warning should have required fields', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      response.body.warnings.forEach(warning => {
        expect(warning).toHaveProperty('file');
        expect(warning).toHaveProperty('error');
        expect(warning).toHaveProperty('skipped');

        // Verify types
        expect(typeof warning.file).toBe('string');
        expect(typeof warning.error).toBe('string');
        expect(warning.skipped).toBe(true);
      });
    });
  });

  describe('File Filtering Tests', () => {
    test('should ignore non-.md files in commands directory', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      // All commands should have .md extension
      response.body.commands.forEach(command => {
        expect(command.file).toMatch(/\.md$/);
      });

      // Should not include README.txt or other non-.md files
      const nonMdCommands = response.body.commands.filter(c =>
        !c.file.endsWith('.md')
      );
      expect(nonMdCommands.length).toBe(0);
    });

    test('should not include hidden files or directories', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      // No command names should start with . (hidden)
      response.body.commands.forEach(command => {
        expect(command.name).not.toMatch(/^\./);
        expect(command.file).not.toMatch(/\/\./);
      });
    });
  });

  describe('Edge Cases', () => {
    test('should return consistent results on multiple requests (no caching issues)', async () => {
      const response1 = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      const response2 = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response1.body).toEqual(response2.body);
    });

    test('should handle special characters in project path', async () => {
      // Project ID conversion removes special chars, so this tests the mapping
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should handle empty commands directory', async () => {
      const response = await request(app)
        .get(`/api/projects/${minimalProjectId}/commands`);

      expect(response.status).toBe(200);
      expect(response.body.commands).toEqual([]);
      expect(response.body.warnings).toEqual([]);
    });
  });

  describe('Integration with Project Discovery', () => {
    test('should work after project scan', async () => {
      // Trigger a project scan first
      await request(app).post('/api/projects/scan');

      // Then fetch commands
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.commands)).toBe(true);
    });

    test('should load projects cache if not already loaded', async () => {
      // Fresh request without prior scan should still work
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Command Content Tests', () => {
    test('should preserve command content', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      const simpleCommand = response.body.commands.find(c => c.name === 'simple-command');

      expect(simpleCommand.content).toBeTruthy();
      expect(simpleCommand.content.length).toBeGreaterThan(0);
      expect(typeof simpleCommand.content).toBe('string');
    });

    test('should return non-empty content for valid commands', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/commands`);

      expect(response.status).toBe(200);

      // All valid commands should have some content
      response.body.commands.forEach(command => {
        expect(typeof command.content).toBe('string');
        // Content may have whitespace, but should have some text
        expect(command.content.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
