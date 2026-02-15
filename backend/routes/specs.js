// Specs route
import express from 'express';
import { getAllSpecs, getSpecById, deleteSpec } from '../services/storageService.js';

const router = express.Router();

// Get all specs
router.get('/', (req, res) => {
  try {
    const specs = getAllSpecs();
    res.json({ specs, count: specs.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get one spec
router.get('/:id', (req, res) => {
  try {
    const spec = getSpecById(req.params.id);
    if (!spec) {
      return res.status(404).json({ error: 'Spec not found' });
    }
    res.json({ spec });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete spec
router.delete('/:id', (req, res) => {
  try {
    const deleted = deleteSpec(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Spec not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;