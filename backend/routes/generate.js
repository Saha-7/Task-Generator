// Generate route
import express from 'express';
import { generateTasks } from '../services/geminiService.js';
import { saveSpec } from '../services/storageService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { goal, users, constraints, template } = req.body;

    // Validate
    if (!goal || goal.trim().length < 10) {
      return res.status(400).json({ error: 'Goal must be at least 10 characters' });
    }

    if (!users || users.trim().length === 0) {
      return res.status(400).json({ error: 'Users are required' });
    }

    const featureData = {
      goal: goal.trim(),
      users: users.trim(),
      constraints: constraints?.trim() || '',
      template: template || 'General'
    };

    // Generate with Gemini
    console.log('Generating with Gemini...');
    const generated = await generateTasks(featureData);

    // Save
    const spec = saveSpec({
      feature: featureData,
      generated
    });

    res.json({
      success: true,
      spec
    });

  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;