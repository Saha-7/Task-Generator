// Status route
import express from 'express';
import { checkApiHealth } from '../services/geminiService.js';
import { checkStorageHealth } from '../services/storageService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      checks: {}
    };

    // Backend check
    status.checks.backend = {
      status: 'healthy',
      message: 'Server running',
      uptime: process.uptime()
    };

    // Storage check
    status.checks.storage = checkStorageHealth();

    // Gemini API check
    status.checks.llm = await checkApiHealth();

    // Overall status
    const allHealthy = Object.values(status.checks).every(c => c.status === 'healthy');
    status.overall = allHealthy ? 'healthy' : 'unhealthy';

    res.json(status);
  } catch (error) {
    res.status(503).json({
      overall: 'unhealthy',
      error: error.message
    });
  }
});

export default router;