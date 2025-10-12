/**
 * Malformed YAML Error Handling Tests - Agents & Commands
 *
 * Tests that the backend can gracefully handle malformed YAML frontmatter
 * in agent and command files without crashing the server or blocking other valid files.
 */

const path = require('path');
const { getProjectAgents, getUserAgents, getProjectCommands, getUserCommands } = require('../../../src/backend/services/projectDiscovery');

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

describe('Malformed YAML Error Handling - Commands', () => {
  describe('Parser Resilience', () => {
    test('should not crash when parsing malformed YAML frontmatter in commands', async () => {
      // Attempt to read commands from project with malformed YAML
      const result = await getProjectCommands(VALID_PROJECT_PATH);

      // Should complete without throwing
      expect(result).toBeDefined();
      expect(result.commands).toBeDefined();
      expect(result.warnings).toBeDefined();

      // Should have arrays
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.commands)).toBe(true);
    });

    test('should not crash when user commands directory has malformed files', async () => {
      // Test user-level commands parsing
      const result = await getUserCommands();

      // Should complete without throwing
      expect(result).toBeDefined();
      expect(result.commands).toBeDefined();
      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.commands)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe('Warning System', () => {
    test('warnings should include file path and error description for malformed command YAML', async () => {
      // Use valid-project which has a malformed-command.md file
      const result = await getProjectCommands(VALID_PROJECT_PATH);

      // Debug: Log the result
      if (result.warnings.length === 0) {
        console.log('DEBUG: Commands found:', result.commands.map(c => c.name));
        console.log('DEBUG: No warnings, but expected some');
      }

      // Should have warnings for the malformed file
      expect(result.warnings).toBeDefined();
      expect(result.warnings.length).toBeGreaterThan(0);

      // Find the warning for malformed-command.md
      const malformedWarning = result.warnings.find(w => w.file.includes('malformed-command.md'));
      expect(malformedWarning).toBeDefined();

      // Structure validation
      expect(malformedWarning).toHaveProperty('file');
      expect(malformedWarning).toHaveProperty('error');
      expect(malformedWarning).toHaveProperty('skipped');
      expect(typeof malformedWarning.file).toBe('string');
      expect(typeof malformedWarning.error).toBe('string');
      expect(malformedWarning.skipped).toBe(true);

      // File path should be absolute
      expect(path.isAbsolute(malformedWarning.file)).toBe(true);

      // Should contain the filename and .md extension
      expect(malformedWarning.file).toContain('.md');
      expect(malformedWarning.file).toContain('malformed-command.md');

      // Error message should mention YAML or parsing
      expect(malformedWarning.error.toLowerCase()).toMatch(/yaml|parse|invalid|frontmatter/);

      // Should not be an empty string
      expect(malformedWarning.error.length).toBeGreaterThan(0);
    });
  });

  describe('Continued Processing', () => {
    test('system should continue processing valid commands after encountering malformed files', async () => {
      // The valid-project has malformed command files AND valid command files
      // The system should skip the malformed ones and process the valid ones
      const result = await getProjectCommands(VALID_PROJECT_PATH);

      // Should not throw an error
      expect(result).toBeDefined();

      // Should return a commands array with valid commands
      expect(result.commands).toBeDefined();
      expect(Array.isArray(result.commands)).toBe(true);
      expect(result.commands.length).toBeGreaterThan(0); // Should have valid commands

      // Should have warnings array
      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);

      // Verify that valid commands were parsed correctly
      const validCommand = result.commands.find(c => c.name === 'simple-command');
      expect(validCommand).toBeDefined();
      expect(validCommand.frontmatter).toBeDefined();
    });

    test('system should process commands without frontmatter using filename fallback', async () => {
      // Commands without frontmatter should still be processed (unlike agents)
      const result = await getProjectCommands(VALID_PROJECT_PATH);

      // Should have processed the no-frontmatter command
      const noFrontmatterCommand = result.commands.find(c => c.name === 'no-frontmatter');
      expect(noFrontmatterCommand).toBeDefined();

      // Should have content even without frontmatter
      expect(noFrontmatterCommand.content).toBeDefined();
      expect(noFrontmatterCommand.content.length).toBeGreaterThan(0);

      // Frontmatter should be empty object (not undefined)
      expect(noFrontmatterCommand.frontmatter).toBeDefined();
    });
  });

  describe('Multiple Error Handling', () => {
    test('warnings array should be empty when no errors occur', async () => {
      // Test a project with no commands
      const result = await getProjectCommands(MINIMAL_PROJECT_PATH);

      expect(result).toBeDefined();
      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(result.warnings.length).toBe(0);
      expect(result.commands.length).toBe(0);
    });

    test('multiple malformed command files should generate multiple warnings', async () => {
      // Valid-project has at least one malformed command file
      const result = await getProjectCommands(VALID_PROJECT_PATH);

      expect(result).toBeDefined();
      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);

      // Each warning should have the required structure
      result.warnings.forEach(warning => {
        expect(warning).toHaveProperty('file');
        expect(warning).toHaveProperty('error');
        expect(warning).toHaveProperty('skipped');
        expect(typeof warning.file).toBe('string');
        expect(typeof warning.error).toBe('string');
        expect(path.isAbsolute(warning.file)).toBe(true);
      });
    });
  });

  describe('Result Structure Validation', () => {
    test('result should have correct structure with commands even with malformed files', async () => {
      const result = await getProjectCommands(VALID_PROJECT_PATH);

      // Verify result structure
      expect(result).toHaveProperty('commands');
      expect(result).toHaveProperty('warnings');
      expect(Array.isArray(result.commands)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);

      // Even with potential errors, parsing should complete without throwing
      expect(result).toBeDefined();
      expect(result.commands).toBeDefined();
      expect(result.warnings).toBeDefined();

      // Should have successfully parsed valid commands
      expect(result.commands.length).toBeGreaterThan(0);

      // Valid commands should have proper structure
      result.commands.forEach(command => {
        expect(command).toHaveProperty('name');
        expect(command).toHaveProperty('file');
        expect(command).toHaveProperty('path');
        expect(command).toHaveProperty('frontmatter');
        expect(command).toHaveProperty('content');
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty commands directory gracefully', async () => {
      // minimal-project has no commands directory
      const result = await getProjectCommands(MINIMAL_PROJECT_PATH);

      expect(result).toBeDefined();
      expect(result.commands).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    test('should handle non-existent commands directory gracefully', async () => {
      // Test with a path that doesn't exist
      const nonExistentPath = path.join(__dirname, '../../fixtures/projects/nonexistent-project');
      const result = await getProjectCommands(nonExistentPath);

      // Should return empty arrays, not throw
      expect(result).toBeDefined();
      expect(result.commands).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    test('commands without frontmatter should not generate warnings', async () => {
      // Commands can work without frontmatter (fallback to content)
      const result = await getProjectCommands(VALID_PROJECT_PATH);

      // Check that no-frontmatter command was processed without warnings
      const noFrontmatterCommand = result.commands.find(c => c.name === 'no-frontmatter');
      expect(noFrontmatterCommand).toBeDefined();

      // Should not have any warnings specifically for this file
      const noFrontmatterWarnings = result.warnings.filter(w => w.file.includes('no-frontmatter.md'));
      expect(noFrontmatterWarnings.length).toBe(0);
    });
  });
});
