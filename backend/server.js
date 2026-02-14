// ============================================
// TASKS GENERATOR - BACKEND SERVER
// ============================================
// This is the main server file that handles all API requests
// It uses Express.js as the web framework

// Step 1: Import required packages
require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Web framework for Node.js
const cors = require('cors'); // Allow cross-origin requests (frontend can talk to backend)
const path = require('path'); // Handle file paths
const fs = require('fs'); // File system operations

// Step 2: Import our custom routes and services
const generateRoutes = require('./routes/generate');
const specsRoutes = require('./routes/specs');
const statusRoutes = require('./routes/status');

// Step 3: Create Express app
const app = express();
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// Step 4: Configure middleware (functions that process requests before they reach routes)

// CORS - Allow frontend (running on port 3000) to make requests to backend (port 5000)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Parse JSON request bodies (so we can access req.body)
app.use(express.json());

// Log all incoming requests (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next(); // Continue to next middleware/route
});

// Step 5: Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

// Initialize specs.json if it doesn't exist
const specsFile = path.join(dataDir, 'specs.json');
if (!fs.existsSync(specsFile)) {
  fs.writeFileSync(specsFile, JSON.stringify([]));
  console.log('Created specs.json file');
}

// Step 6: Mount routes
// All routes starting with /api/generate will be handled by generateRoutes
app.use('/api/generate', generateRoutes);

// All routes starting with /api/specs will be handled by specsRoutes
app.use('/api/specs', specsRoutes);

// All routes starting with /api/status will be handled by statusRoutes
app.use('/api/status', statusRoutes);

// Step 7: Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Step 8: 404 handler - catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.path} not found`
  });
});

// Step 9: Global error handler
// This catches any errors from routes and sends a proper response
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Step 10: Start the server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 Tasks Generator Backend');
  console.log('=================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});