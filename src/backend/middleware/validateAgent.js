/**
 * Agent Validation Middleware
 * Validates agent data before writing to file system
 */

// Valid model whitelist
const VALID_MODELS = ['claude-opus', 'claude-sonnet', 'claude-haiku'];

// Valid color options
const VALID_COLORS = ['blue', 'green', 'orange', 'purple'];

/**
 * Validates agent data from request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function validateAgent(req, res, next) {
  const { name, description, model, tools, color } = req.body;
  const errors = [];

  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Name is required and must be a non-empty string'
    });
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push({
      field: 'description',
      message: 'Description is required and must be a non-empty string'
    });
  }

  if (!model || typeof model !== 'string' || model.trim() === '') {
    errors.push({
      field: 'model',
      message: 'Model is required and must be a non-empty string'
    });
  } else if (!VALID_MODELS.includes(model)) {
    errors.push({
      field: 'model',
      message: `Model must be one of: ${VALID_MODELS.join(', ')}`,
      validValues: VALID_MODELS
    });
  }

  // Validate optional fields
  if (tools !== undefined) {
    if (!Array.isArray(tools)) {
      errors.push({
        field: 'tools',
        message: 'Tools must be an array of strings'
      });
    } else {
      // Validate each tool is a string
      const invalidTools = tools.filter(tool => typeof tool !== 'string');
      if (invalidTools.length > 0) {
        errors.push({
          field: 'tools',
          message: 'All tools must be strings'
        });
      }
    }
  }

  if (color !== undefined && color !== null) {
    if (typeof color !== 'string') {
      errors.push({
        field: 'color',
        message: 'Color must be a string'
      });
    } else if (!VALID_COLORS.includes(color)) {
      errors.push({
        field: 'color',
        message: `Color must be one of: ${VALID_COLORS.join(', ')}`,
        validValues: VALID_COLORS
      });
    }
  }

  // If validation errors exist, return 400
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      validationErrors: errors
    });
  }

  // Validation passed, continue to route handler
  next();
}

module.exports = validateAgent;
