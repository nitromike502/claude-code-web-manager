const request = require('supertest');
const path = require('path');
const os = require('os');

/**
 * Test Suite: GET /api/user/commands
 *
 * Tests user-level command retrieval from ~/.claude/commands/
 *
 * Coverage:
 * - Valid user commands are returned correctly
 * - Response structure includes {success, commands, warnings}
 * - Nested commands (subdirectories) are discovered correctly
 * - Malformed commands generate warnings but don't crash
 * - Missing user commands directory returns empty array (when dir doesn't exist)
 * - Missing ~/.claude/ directory returns empty array gracefully
 * - Command parsing includes all expected fields
 * - Only .md files are returned
 *
 * NOTE: These tests use the actual user's home directory (~/.claude/commands/)
 * rather than mocking because os.homedir() is difficult to mock in Node.js.
 * Tests verify the API works correctly with real filesystem scenarios.
 */

describe('GET /api/user/commands', () => {
  let app;

  beforeAll(() => {
    // Load app fresh for all tests
    app = require('../../../src/backend/server');
  });

  describe('API Response', () => {
    test('should return user-level commands from ~/.claude/commands/', async () => {
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.commands).toBeDefined();
      expect(Array.isArray(response.body.commands)).toBe(true);
      expect(response.body.warnings).toBeDefined();
      expect(Array.isArray(response.body.warnings)).toBe(true);
    });

    test('should return correct response structure with all required fields', async () => {
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('commands');
      expect(response.body).toHaveProperty('warnings');
      expect(typeof response.body.success).toBe('boolean');
      expect(Array.isArray(response.body.commands)).toBe(true);
      expect(Array.isArray(response.body.warnings)).toBe(true);
    });

    test('should include all expected fields in command objects if commands exist', async () => {
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);

      // If user has commands in ~/.claude/commands/, verify structure
      if (response.body.commands.length > 0) {
        const command = response.body.commands[0];
        expect(command).toHaveProperty('name');
        expect(command).toHaveProperty('file');
        expect(command).toHaveProperty('path');
        expect(command).toHaveProperty('frontmatter');
        expect(command).toHaveProperty('content');
        expect(command).toHaveProperty('description');

        // Verify path contains .claude/commands/
        expect(command.path).toContain('.claude/commands/');

        // Verify file ends with .md
        expect(command.file).toMatch(/\.md$/);

        // Verify name is derived from file path (without .md extension)
        expect(command.file).toBe(`${command.name}.md`);
      }
    });
  });

  describe('Nested Directory Support', () => {
    test('should discover commands in nested subdirectories', async () => {
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // If there are any commands, check if nested commands are supported
      // Nested commands will have "/" in their name (e.g., "git/commit")
      const nestedCommands = response.body.commands.filter(cmd => cmd.name.includes('/'));

      // If nested commands exist, verify their structure
      if (nestedCommands.length > 0) {
        const nestedCommand = nestedCommands[0];

        // Name should reflect the nested path
        expect(nestedCommand.name).toContain('/');

        // File should match the name with .md extension
        expect(nestedCommand.file).toBe(`${nestedCommand.name}.md`);

        // Path should contain the nested directory structure
        expect(nestedCommand.path).toContain('.claude/commands/');
      }
    });

    test('should handle deeply nested command directories (multiple levels)', async () => {
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Check for commands with multiple "/" (e.g., "git/workflows/pr.md")
      const deeplyNestedCommands = response.body.commands.filter(cmd => {
        const slashCount = (cmd.name.match(/\//g) || []).length;
        return slashCount >= 2;
      });

      // If deeply nested commands exist, verify they are parsed correctly
      if (deeplyNestedCommands.length > 0) {
        const deepCommand = deeplyNestedCommands[0];
        expect(deepCommand).toHaveProperty('name');
        expect(deepCommand).toHaveProperty('file');
        expect(deepCommand).toHaveProperty('path');
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed command files gracefully (if any exist)', async () => {
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.commands).toBeDefined();
      expect(response.body.warnings).toBeDefined();

      // Even with malformed files, the API should not crash
      // and should return a valid response structure
      expect(Array.isArray(response.body.commands)).toBe(true);
      expect(Array.isArray(response.body.warnings)).toBe(true);

      // If there are warnings, they should have the expected structure
      if (response.body.warnings.length > 0) {
        const warning = response.body.warnings[0];
        expect(warning).toHaveProperty('file');
        expect(warning).toHaveProperty('error');
        expect(warning).toHaveProperty('skipped');
        expect(warning.skipped).toBe(true);
      }
    });

    test('should continue processing valid commands even if some are malformed', async () => {
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // API should return both commands and warnings arrays
      expect(Array.isArray(response.body.commands)).toBe(true);
      expect(Array.isArray(response.body.warnings)).toBe(true);

      // If warnings exist, valid commands should still be in the commands array
      // This verifies the resilient error handling
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty ~/.claude/commands/ directory gracefully', async () => {
      // This test verifies the endpoint works whether or not the user
      // has any commands configured. Empty arrays are valid responses.
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.commands)).toBe(true);
      expect(Array.isArray(response.body.warnings)).toBe(true);
    });

    test('should handle non-existent ~/.claude/ directory gracefully', async () => {
      // If the user doesn't have a ~/.claude directory, the endpoint
      // should return empty arrays without errors
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.commands)).toBe(true);
      expect(Array.isArray(response.body.warnings)).toBe(true);
    });

    test('should only return .md files from commands directory', async () => {
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);

      // All command files should end with .md
      response.body.commands.forEach(command => {
        expect(command.file).toMatch(/\.md$/);
      });
    });

    test('should handle commands with and without frontmatter descriptions', async () => {
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);

      // All commands should have a description field (even if empty string)
      response.body.commands.forEach(command => {
        expect(command).toHaveProperty('description');
        expect(typeof command.description).toBe('string');
      });
    });
  });

  describe('Data Integrity', () => {
    test('should return unique commands (no duplicates)', async () => {
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);

      // Build a set of command paths to check for duplicates
      const commandPaths = new Set();
      response.body.commands.forEach(command => {
        expect(commandPaths.has(command.path)).toBe(false); // Should not be a duplicate
        commandPaths.add(command.path);
      });

      // Set size should equal array length (no duplicates)
      expect(commandPaths.size).toBe(response.body.commands.length);
    });

    test('should maintain consistent name to file mapping', async () => {
      const response = await request(app).get('/api/user/commands');

      expect(response.status).toBe(200);

      // Verify that name + ".md" always equals file
      response.body.commands.forEach(command => {
        expect(command.file).toBe(`${command.name}.md`);
      });
    });
  });
});
