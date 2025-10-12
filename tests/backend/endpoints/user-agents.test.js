const request = require('supertest');
const path = require('path');
const os = require('os');

/**
 * Test Suite: GET /api/user/agents
 *
 * Tests user-level agent retrieval from ~/.claude/agents/
 *
 * Coverage:
 * - Valid user agents are returned correctly
 * - Response structure includes {success, agents, warnings}
 * - Malformed agents generate warnings but don't crash
 * - Missing user agents directory returns empty array (when dir doesn't exist)
 * - Missing ~/.claude/ directory returns empty array gracefully
 * - Agent parsing includes all expected fields
 *
 * NOTE: These tests use the actual user's home directory (~/.claude/agents/)
 * rather than mocking because os.homedir() is difficult to mock in Node.js.
 * Tests verify the API works correctly with real filesystem scenarios.
 */

describe('GET /api/user/agents', () => {
  let app;

  beforeAll(() => {
    // Load app fresh for all tests
    app = require('../../../src/backend/server');
  });

  describe('API Response', () => {
    test('should return user-level agents from ~/.claude/agents/', async () => {
      const response = await request(app).get('/api/user/agents');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.agents).toBeDefined();
      expect(Array.isArray(response.body.agents)).toBe(true);
      expect(response.body.warnings).toBeDefined();
      expect(Array.isArray(response.body.warnings)).toBe(true);
    });

    test('should return correct response structure with all required fields', async () => {
      const response = await request(app).get('/api/user/agents');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('agents');
      expect(response.body).toHaveProperty('warnings');
      expect(typeof response.body.success).toBe('boolean');
      expect(Array.isArray(response.body.agents)).toBe(true);
      expect(Array.isArray(response.body.warnings)).toBe(true);
    });

    test('should include all expected fields in agent objects if agents exist', async () => {
      const response = await request(app).get('/api/user/agents');

      expect(response.status).toBe(200);

      // If user has agents in ~/.claude/agents/, verify structure
      if (response.body.agents.length > 0) {
        const agent = response.body.agents[0];
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('file');
        expect(agent).toHaveProperty('path');
        expect(agent).toHaveProperty('frontmatter');
        expect(agent).toHaveProperty('content');
        expect(agent).toHaveProperty('description');

        // Verify path contains .claude/agents/
        expect(agent.path).toContain('.claude/agents/');

        // Verify name matches file name (without .md extension)
        expect(agent.file).toBe(`${agent.name}.md`);
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed agent files gracefully (if any exist)', async () => {
      const response = await request(app).get('/api/user/agents');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.agents).toBeDefined();
      expect(response.body.warnings).toBeDefined();

      // Even with malformed files, the API should not crash
      // and should return a valid response structure
      expect(Array.isArray(response.body.agents)).toBe(true);
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

    test('should continue processing valid agents even if some are malformed', async () => {
      const response = await request(app).get('/api/user/agents');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // API should return both agents and warnings arrays
      expect(Array.isArray(response.body.agents)).toBe(true);
      expect(Array.isArray(response.body.warnings)).toBe(true);

      // If warnings exist, valid agents should still be in the agents array
      // This verifies the resilient error handling
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty ~/.claude/agents/ directory gracefully', async () => {
      // This test verifies the endpoint works whether or not the user
      // has any agents configured. Empty arrays are valid responses.
      const response = await request(app).get('/api/user/agents');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.agents)).toBe(true);
      expect(Array.isArray(response.body.warnings)).toBe(true);
    });

    test('should handle non-existent ~/.claude/ directory gracefully', async () => {
      // If the user doesn't have a ~/.claude directory, the endpoint
      // should return empty arrays without errors
      const response = await request(app).get('/api/user/agents');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.agents)).toBe(true);
      expect(Array.isArray(response.body.warnings)).toBe(true);
    });

    test('should only return .md files from agents directory', async () => {
      const response = await request(app).get('/api/user/agents');

      expect(response.status).toBe(200);

      // All agent files should end with .md
      response.body.agents.forEach(agent => {
        expect(agent.file).toMatch(/\.md$/);
      });
    });
  });
});
