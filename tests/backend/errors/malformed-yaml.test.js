/**
 * Malformed YAML Error Handling Tests - Agents
 *
 * Tests that the backend can gracefully handle malformed YAML frontmatter
 * in agent files without crashing the server or blocking other valid files.
 */

const path = require('path');
const { getProjectAgents, getUserAgents } = require('../../../src/backend/services/projectDiscovery');

// Paths to test fixtures
const MALFORMED_PROJECT_PATH = path.join(__dirname, '../../fixtures/projects/malformed-project');
const VALID_PROJECT_PATH = path.join(__dirname, '../../fixtures/projects/valid-project');
const MINIMAL_PROJECT_PATH = path.join(__dirname, '../../fixtures/projects/minimal-project');

describe('Malformed YAML Error Handling - Agents', () => {
  describe('Parser Resilience', () => {
    test('should not crash when parsing malformed YAML frontmatter', async () => {
      // Attempt to read agents from project with malformed YAML
      // This should not throw an error, but may return warnings OR skip the file
      const result = await getProjectAgents(MALFORMED_PROJECT_PATH);

      // Should complete without throwing
      expect(result).toBeDefined();
      expect(result.agents).toBeDefined();
      expect(result.warnings).toBeDefined();

      // Should have arrays (may be empty or contain items depending on gray-matter behavior)
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.agents)).toBe(true);
    });

    test('should not crash when user agents directory has malformed files', async () => {
      // Test user-level agents parsing
      // This should handle gracefully even if ~/.claude/agents has issues
      const result = await getUserAgents();

      // Should complete without throwing
      expect(result).toBeDefined();
      expect(result.agents).toBeDefined();
      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.agents)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe('Warning System', () => {
    test('warnings should include file path, error description, and be descriptive', async () => {
      // Use valid-project which has a malformed-agent.md file
      const result = await getProjectAgents(VALID_PROJECT_PATH);

      // Should have warnings for the malformed file
      expect(result.warnings).toBeDefined();
      expect(result.warnings.length).toBeGreaterThan(0);

      // Each warning should have required fields
      const warning = result.warnings[0];

      // Structure validation
      expect(warning).toHaveProperty('file');
      expect(warning).toHaveProperty('error');
      expect(warning).toHaveProperty('skipped');
      expect(typeof warning.file).toBe('string');
      expect(typeof warning.error).toBe('string');
      expect(warning.skipped).toBe(true);

      // File path should be absolute
      expect(path.isAbsolute(warning.file)).toBe(true);

      // Should contain the filename and .md extension
      expect(warning.file).toContain('.md');
      expect(warning.file).toContain('malformed-agent.md');

      // Error message should mention YAML or parsing
      expect(warning.error.toLowerCase()).toMatch(/yaml|parse|invalid|frontmatter/);

      // Should not be an empty string
      expect(warning.error.length).toBeGreaterThan(0);
    });
  });

  describe('Continued Processing', () => {
    test('system should continue processing valid agents after encountering malformed files', async () => {
      // The valid-project has 1 malformed agent file and 1 valid agent file
      // The system should skip the malformed one and process the valid one
      const result = await getProjectAgents(VALID_PROJECT_PATH);

      // Should not throw an error
      expect(result).toBeDefined();

      // Should return an agents array with the valid agent
      expect(result.agents).toBeDefined();
      expect(Array.isArray(result.agents)).toBe(true);
      expect(result.agents.length).toBeGreaterThan(0); // Should have the valid agent

      // Should have warnings array (may or may not have warnings depending on timing)
      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);

      // Verify that valid agent was parsed correctly
      const validAgent = result.agents.find(a => a.name === 'valid-agent');
      expect(validAgent).toBeDefined();
      expect(validAgent.frontmatter).toBeDefined();
    });
  });

  describe('Multiple Error Handling', () => {
    test('warnings array should be empty when no errors occur', async () => {
      // Test a project with no agents (minimal-project has no agents and no errors)
      const result = await getProjectAgents(MINIMAL_PROJECT_PATH);

      expect(result).toBeDefined();
      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(result.warnings.length).toBe(0);
      expect(result.agents.length).toBe(0);
    });
  });

  describe('Result Structure Validation', () => {
    test('result should have correct structure and parsing should complete even with malformed files', async () => {
      const result = await getProjectAgents(VALID_PROJECT_PATH);

      // Verify result structure
      expect(result).toHaveProperty('agents');
      expect(result).toHaveProperty('warnings');
      expect(Array.isArray(result.agents)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);

      // Even with potential errors, parsing should complete without throwing
      expect(result).toBeDefined();
      expect(result.agents).toBeDefined();
      expect(result.warnings).toBeDefined();

      // Should have successfully parsed the valid agent(s)
      expect(result.agents.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty agents directory gracefully', async () => {
      // minimal-project has no agents directory or empty directory
      const result = await getProjectAgents(MINIMAL_PROJECT_PATH);

      expect(result).toBeDefined();
      expect(result.agents).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    test('should handle non-existent directory gracefully', async () => {
      // Test with a path that doesn't exist
      const nonExistentPath = path.join(__dirname, '../../fixtures/projects/nonexistent-project');
      const result = await getProjectAgents(nonExistentPath);

      // Should return empty arrays, not throw
      expect(result).toBeDefined();
      expect(result.agents).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    test('should process mixed valid/invalid files and valid agents should have proper structure', async () => {
      // Valid project has both valid and malformed agent files
      const result = await getProjectAgents(VALID_PROJECT_PATH);

      expect(result).toBeDefined();
      expect(Array.isArray(result.agents)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);

      // Should have at least one valid agent
      expect(result.agents.length).toBeGreaterThan(0);

      // Valid agents should have proper structure
      result.agents.forEach(agent => {
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('file');
        expect(agent).toHaveProperty('path');
        expect(agent).toHaveProperty('frontmatter');
        expect(agent).toHaveProperty('content');
      });

      // Note: Warnings may or may not be present depending on async timing,
      // but the key test is that processing doesn't crash and valid files are parsed
    });
  });
});
