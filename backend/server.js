import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ensure data directory exists
const dataDir = join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize specs.json
const specsFile = join(dataDir, 'specs.json');
if (!fs.existsSync(specsFile)) {
  fs.writeFileSync(specsFile, JSON.stringify([]));
}

// Import routes (will create these next)
import generateRoute from './routes/generate.js';
import specsRoute from './routes/specs.js';
import statusRoute from './routes/status.js';

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Tasks Generator API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      generate: 'POST /api/generate',
      specs: 'GET /api/specs',
      status: 'GET /api/status'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/generate', generateRoute);
app.use('/api/specs', specsRoute);
app.use('/api/status', statusRoute);

// 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path,
    message: 'Route does not exist. Try /api/health'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log('================================');
  console.log('🚀 Tasks Generator (FREE - Gemini)');
  console.log('================================');
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log('================================');
});