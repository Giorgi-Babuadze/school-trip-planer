import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import BotTraining from '../models/BotTraining.js';

const router = express.Router();

// GET all training entries (admin only)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const entries = await BotTraining.find().sort({ createdAt: -1 });
    res.json({ success: true, data: entries });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch entries' });
  }
});

// POST new training entry (admin only)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer required' });
    }
    const entry = await BotTraining.create({ question, answer });
    res.status(201).json({ success: true, data: entry });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create entry' });
  }
});

// DELETE training entry (admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await BotTraining.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Entry deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete entry' });
  }
});

export default router;
