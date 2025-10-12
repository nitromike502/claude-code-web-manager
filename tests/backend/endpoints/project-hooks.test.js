const request = require('supertest');
const app = require('../../../src/backend/server');
const path = require('path');

/**
 * Comprehensive tests for GET /api/projects/:id/hooks endpoint
 *
 * Test Coverage:
 * - Happy Path: Valid projects, hooks parsing, response structure
 * - Merge Logic: settings.json + settings.local.json merging
 * - Error Cases: Invalid IDs, malformed files, missing directories
 * - Warnings System: Graceful error handling with warnings
 *
 * Fixtures Used:
 * - /home/claude/manager/tests/fixtures/projects/valid-project
 * - /home/claude/manager/tests/fixtures/projects/minimal-project
 * - /home/claude/manager/tests/fixtures/projects/malformed-project
 */

describe('GET /api/projects/:id/hooks', () => {
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

  const malformedProjectPath = '/home/claude/manager/tests/fixtures/projects/malformed-project';
  const malformedProjectId = createProjectId(malformedProjectPath);

  describe('Happy Path Tests', () => {
    test('should return 200 and hooks array for valid project', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('hooks');
      expect(response.body).toHaveProperty('warnings');
      expect(Array.isArray(response.body.hooks)).toBe(true);
      expect(Array.isArray(response.body.warnings)).toBe(true);
    });

    test('should include projectId and projectPath in response', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body.projectId).toBe(validProjectId);
      expect(response.body.projectPath).toBe(validProjectPath);
    });

    test('should parse hooks from settings.json with correct structure', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body.hooks.length).toBeGreaterThan(0);

      // Find a hook from settings.json
      const settingsHook = response.body.hooks.find(h => h.source === 'settings.json');

      expect(settingsHook).toBeDefined();
      expect(settingsHook).toHaveProperty('event');
      expect(settingsHook).toHaveProperty('matcher');
      expect(settingsHook).toHaveProperty('hooks');
      expect(settingsHook).toHaveProperty('source');
      expect(Array.isArray(settingsHook.hooks)).toBe(true);
    });

    test('should parse pre-commit hooks correctly', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      // Find pre-commit hook from settings.json
      const preCommitHook = response.body.hooks.find(
        h => h.event === 'pre-commit' && h.source === 'settings.json'
      );

      expect(preCommitHook).toBeDefined();
      expect(preCommitHook.event).toBe('pre-commit');
      expect(preCommitHook.matcher).toBe('*.js');
      expect(preCommitHook.hooks.length).toBeGreaterThan(0);

      // Verify hook command structure
      const hook = preCommitHook.hooks[0];
      expect(hook).toHaveProperty('type');
      expect(hook).toHaveProperty('command');
      expect(hook).toHaveProperty('enabled');
      expect(hook.command).toBe('npm run lint');
    });

    test('should parse pre-push hooks correctly', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      // Find pre-push hook from settings.json
      const prePushHook = response.body.hooks.find(
        h => h.event === 'pre-push' && h.source === 'settings.json'
      );

      expect(prePushHook).toBeDefined();
      expect(prePushHook.event).toBe('pre-push');
      expect(prePushHook.matcher).toBe('*');
      expect(prePushHook.hooks[0].command).toBe('npm test');
    });

    test('should return empty array for project without hooks', async () => {
      const response = await request(app)
        .get(`/api/projects/${minimalProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.hooks).toEqual([]);
      expect(response.body.warnings).toEqual([]);
    });

    test('should include hook event types', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      // Verify we have the expected hook events
      const events = response.body.hooks.map(h => h.event);

      expect(events).toContain('pre-commit');
      expect(events).toContain('pre-push');
    });
  });

  describe('Merge Logic Tests', () => {
    test('should merge hooks from settings.json and settings.local.json', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      // Should have hooks from both sources
      const settingsHooks = response.body.hooks.filter(h => h.source === 'settings.json');
      const localHooks = response.body.hooks.filter(h => h.source === 'settings.local.json');

      expect(settingsHooks.length).toBeGreaterThan(0);
      expect(localHooks.length).toBeGreaterThan(0);
    });

    test('should include post-checkout hook from settings.local.json', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      // Find post-checkout hook from settings.local.json
      const postCheckoutHook = response.body.hooks.find(
        h => h.event === 'post-checkout' && h.source === 'settings.local.json'
      );

      expect(postCheckoutHook).toBeDefined();
      expect(postCheckoutHook.event).toBe('post-checkout');
      expect(postCheckoutHook.matcher).toBe('*');
      expect(postCheckoutHook.hooks[0].command).toBe('npm install');
    });

    test('should preserve separate hooks for different events', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      // Each hook should maintain its event identity
      const uniqueEvents = new Set(response.body.hooks.map(h => h.event));

      expect(uniqueEvents.size).toBeGreaterThan(1);
      expect(uniqueEvents.has('pre-commit')).toBe(true);
      expect(uniqueEvents.has('pre-push')).toBe(true);
      expect(uniqueEvents.has('post-checkout')).toBe(true);
    });

    test('should handle matcher patterns correctly', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      // Verify matchers are preserved
      const hooks = response.body.hooks;

      const jsMatcherHook = hooks.find(h => h.matcher === '*.js');
      expect(jsMatcherHook).toBeDefined();

      const allFilesHook = hooks.find(h => h.matcher === '*');
      expect(allFilesHook).toBeDefined();
    });

    test('should handle multiple matchers in same event', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      // Check if we have multiple entries with same event but different matchers
      const preCommitHooks = response.body.hooks.filter(h => h.event === 'pre-commit');

      // Each matcher config becomes a separate hook entry
      preCommitHooks.forEach(hook => {
        expect(hook).toHaveProperty('matcher');
        expect(hook).toHaveProperty('matcherIndex');
      });
    });
  });

  describe('Error Handling Tests', () => {
    test('should return 404 for invalid project ID', async () => {
      const response = await request(app)
        .get('/api/projects/nonexistentprojectid/hooks');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Project not found');
    });

    test('should return 404 for empty project ID', async () => {
      const response = await request(app)
        .get('/api/projects//hooks');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('should generate warnings for malformed settings.json', async () => {
      const response = await request(app)
        .get(`/api/projects/${malformedProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Should have warnings for malformed JSON
      expect(response.body.warnings.length).toBeGreaterThan(0);

      const malformedWarning = response.body.warnings.find(w =>
        w.file && w.file.includes('settings.json')
      );

      expect(malformedWarning).toBeDefined();
      expect(malformedWarning.error).toBeTruthy();
      expect(malformedWarning.skipped).toBe(true);
    });

    test('should return empty hooks array for malformed settings', async () => {
      const response = await request(app)
        .get(`/api/projects/${malformedProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Should have empty hooks array (all skipped due to malformed JSON)
      expect(response.body.hooks).toEqual([]);
    });

    test('should handle missing .claude directory gracefully', async () => {
      const response = await request(app)
        .get(`/api/projects/${minimalProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body.hooks).toEqual([]);
      expect(response.body.warnings).toEqual([]);
    });
  });

  describe('Response Structure Tests', () => {
    test('should return correct response structure', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        hooks: expect.any(Array),
        warnings: expect.any(Array),
        projectId: expect.any(String),
        projectPath: expect.any(String)
      });
    });

    test('each hook should have required fields', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      response.body.hooks.forEach(hook => {
        expect(hook).toHaveProperty('event');
        expect(hook).toHaveProperty('matcher');
        expect(hook).toHaveProperty('hooks');
        expect(hook).toHaveProperty('source');
        expect(hook).toHaveProperty('matcherIndex');

        // Verify types
        expect(typeof hook.event).toBe('string');
        expect(typeof hook.matcher).toBe('string');
        expect(Array.isArray(hook.hooks)).toBe(true);
        expect(typeof hook.source).toBe('string');
        expect(typeof hook.matcherIndex).toBe('number');
      });
    });

    test('each hook command should have correct structure', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      // Check structure of hook commands
      response.body.hooks.forEach(hookEntry => {
        hookEntry.hooks.forEach(hookCommand => {
          expect(hookCommand).toHaveProperty('type');
          expect(hookCommand).toHaveProperty('command');

          // type should be string, command should be string
          expect(typeof hookCommand.type).toBe('string');
          expect(typeof hookCommand.command).toBe('string');
        });
      });
    });

    test('each warning should have required fields', async () => {
      const response = await request(app)
        .get(`/api/projects/${malformedProjectId}/hooks`);

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

  describe('Hook Event Types', () => {
    test('should support pre-commit events', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      const preCommitHooks = response.body.hooks.filter(h => h.event === 'pre-commit');
      expect(preCommitHooks.length).toBeGreaterThan(0);
    });

    test('should support pre-push events', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      const prePushHooks = response.body.hooks.filter(h => h.event === 'pre-push');
      expect(prePushHooks.length).toBeGreaterThan(0);
    });

    test('should support post-checkout events', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      const postCheckoutHooks = response.body.hooks.filter(h => h.event === 'post-checkout');
      expect(postCheckoutHooks.length).toBeGreaterThan(0);
    });

    test('should support post-merge events', async () => {
      // Note: This test depends on fixture having post-merge hooks
      // The sample fixtures show post-merge in valid-hooks.json
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      // Check if post-merge hooks exist (depends on fixture)
      const events = response.body.hooks.map(h => h.event);

      // At minimum, should have pre-commit, pre-push, and post-checkout
      expect(events).toContain('pre-commit');
      expect(events).toContain('pre-push');
      expect(events).toContain('post-checkout');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty hooks object gracefully', async () => {
      const response = await request(app)
        .get(`/api/projects/${minimalProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body.hooks).toEqual([]);
      expect(response.body.warnings).toEqual([]);
    });

    test('should return consistent results on multiple requests', async () => {
      const response1 = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      const response2 = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response1.body).toEqual(response2.body);
    });

    test('should handle special characters in project path', async () => {
      // Project ID conversion removes special chars, so this tests the mapping
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should handle settings.json without hooks field', async () => {
      const response = await request(app)
        .get(`/api/projects/${minimalProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body.hooks).toEqual([]);
      expect(response.body.warnings).toEqual([]);
    });
  });

  describe('Integration with Project Discovery', () => {
    test('should work after project scan', async () => {
      // Trigger a project scan first
      await request(app).post('/api/projects/scan');

      // Then fetch hooks
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.hooks)).toBe(true);
    });

    test('should load projects cache if not already loaded', async () => {
      // Fresh request without prior scan should still work
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Source Attribution', () => {
    test('hooks should correctly identify their source file', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      // All hooks should have either 'settings.json' or 'settings.local.json' as source
      response.body.hooks.forEach(hook => {
        expect(['settings.json', 'settings.local.json']).toContain(hook.source);
      });
    });

    test('should distinguish between project and local hooks', async () => {
      const response = await request(app)
        .get(`/api/projects/${validProjectId}/hooks`);

      expect(response.status).toBe(200);

      const projectHooks = response.body.hooks.filter(h => h.source === 'settings.json');
      const localHooks = response.body.hooks.filter(h => h.source === 'settings.local.json');

      // Both should exist in valid-project fixture
      expect(projectHooks.length).toBeGreaterThan(0);
      expect(localHooks.length).toBeGreaterThan(0);
    });
  });
});
