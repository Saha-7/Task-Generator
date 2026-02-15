import express from 'express';
import { generateTasks } from '../services/geminiService.js';
import { saveSpec } from '../services/storageService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { goal, users, constraints, template } = req.body;

    console.log('📝 Request body:', { goal: goal?.substring(0, 50), users, template });

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

    console.log('🤖 Calling Gemini...');
    const generated = await generateTasks(featureData);
    console.log('✅ Got generated data');

    console.log('💾 Saving spec...');
    const spec = saveSpec({
      feature: featureData,
      generated
    });
    console.log('✅ Spec saved:', spec.id);

    res.json({
      success: true,
      spec
    });

  } catch (error) {
    console.error('❌❌❌ GENERATE ERROR ❌❌❌');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      error: error.message,
      details: error.stack 
    });
  }
});

export default router;