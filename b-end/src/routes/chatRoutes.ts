import express from 'express';
import geminiService from '../services/geminiService';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const response = await geminiService.generateResponse(message, history);

    res.status(200).json({ success: true, response });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Chat error' });
  }
});

export default router;
