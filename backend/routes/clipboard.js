import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import TextClip from '../models/TextClip.js';
import { generateShortId } from '../utils/shortId.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Generate unique shortId
    let shortId;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      shortId = generateShortId();
      const existing = await TextClip.findOne({ shortId });
      if (!existing) isUnique = true;
      attempts++;
    }
    if (!isUnique) {
      shortId = generateShortId() + Date.now().toString(36).slice(-2);
    }

    const textId = uuidv4();
    const textClip = new TextClip({
      textId,
      shortId,
      content: content.trim()
    });

    await textClip.save();

    res.json({
      success: true,
      shortId // return shortId for sharing
    });
  } catch (error) {
    console.error('Clipboard error:', error);
    res.status(500).json({ error: 'Failed to save text' });
  }
});

router.get('/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;
    const textClip = await TextClip.findOne({ shortId });

    if (!textClip) {
      return res.status(404).json({ error: 'Text not found or expired' });
    }

    res.json({
      success: true,
      content: textClip.content,
      createdAt: textClip.createdAt
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch text' });
  }
});

export default router;