const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8420;

// Middleware
app.use(cors()); // Enable CORS for frontend development
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Import routes
const projectsRouter = require('./routes/projects');
const userRouter = require('./routes/user');

// API routes
app.use('/api/projects', projectsRouter);
app.use('/api/user', userRouter);

// Serve static frontend files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Claude Code Manager Backend'
  });
});

// Catch-all route for SPA (serve index.html for all non-API routes)
app.get('*', (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.url.startsWith('/api/')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    res.status(404).json({
      success: false,
      error: 'API endpoint not found'
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(`Claude Code Manager Backend Server`);
    console.log('='.repeat(60));
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`API base URL: http://localhost:${PORT}/api`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('='.repeat(60));
    console.log('');
    console.log('Available API endpoints:');
    console.log('  GET  /api/health                        - Health check');
    console.log('  GET  /api/projects                      - List all projects');
    console.log('  POST /api/projects/scan                 - Rescan projects');
    console.log('  GET  /api/projects/:id/agents           - Get project agents');
    console.log('  GET  /api/projects/:id/commands         - Get project commands');
    console.log('  GET  /api/projects/:id/hooks            - Get project hooks');
    console.log('  GET  /api/projects/:id/mcp              - Get project MCP servers');
    console.log('  GET  /api/user/agents                   - Get user agents');
    console.log('  GET  /api/user/commands                 - Get user commands');
    console.log('  GET  /api/user/hooks                    - Get user hooks');
    console.log('  GET  /api/user/mcp                      - Get user MCP servers');
    console.log('='.repeat(60));
  });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
