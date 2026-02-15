import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

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

const specsFile = join(dataDir, 'specs.json');
if (!fs.existsSync(specsFile)) {
  fs.writeFileSync(specsFile, JSON.stringify([]));
}

// Import routes with error handling
console.log('📦 Loading routes...');

let generateRoute, specsRoute, statusRoute;

try {
  const generateModule = await import('./routes/generate.js');
  generateRoute = generateModule.default;
  console.log('✅ generate route loaded');
} catch (err) {
  console.error('❌ Failed to load generate route:', err.message);
}

try {
  const specsModule = await import('./routes/specs.js');
  specsRoute = specsModule.default;
  console.log('✅ specs route loaded');
} catch (err) {
  console.error('❌ Failed to load specs route:', err.message);
}

try {
  const statusModule = await import('./routes/status.js');
  statusRoute = statusModule.default;
  console.log('✅ status route loaded');
} catch (err) {
  console.error('❌ Failed to load status route:', err.message);
}

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

// Register routes only if they loaded successfully
if (generateRoute) {
  app.use('/api/generate', generateRoute);
  console.log('✅ /api/generate registered');
} else {
  console.log('⚠️ /api/generate NOT registered');
}

if (specsRoute) {
  app.use('/api/specs', specsRoute);
  console.log('✅ /api/specs registered');
} else {
  console.log('⚠️ /api/specs NOT registered');
}

if (statusRoute) {
  app.use('/api/status', statusRoute);
  console.log('✅ /api/status registered');
} else {
  console.log('⚠️ /api/status NOT registered');
}

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