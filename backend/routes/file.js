import express from 'express';
import Batch from '../models/Batch.js';

const router = express.Router();

// Get batch metadata using shortId
router.get('/batch/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;
    const batch = await Batch.findOne({ shortId });

    if (!batch) {
      return res.status(404).json({ error: 'Files not found or expired' });
    }

    const age = Date.now() - new Date(batch.createdAt).getTime();
    if (age > 24 * 60 * 60 * 1000) {
      return res.status(410).json({ error: 'Files have expired' });
    }

    res.json({
      success: true,
      batchId: batch.batchId,
      shortId: batch.shortId,
      files: batch.files.map(f => ({
        fileId: f.fileId,
        originalName: f.originalName,
        mimetype: f.mimetype,
        size: f.size,
      })),
      createdAt: batch.createdAt,
    });
  } catch (error) {
    console.error('Batch fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch batch' });
  }
});

// Redirect to Cloudinary URL
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const batch = await Batch.findOne({ 'files.fileId': fileId });

    if (!batch) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = batch.files.find(f => f.fileId === fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const age = Date.now() - new Date(batch.createdAt).getTime();
    if (age > 24 * 60 * 60 * 1000) {
      return res.status(410).json({ error: 'File has expired' });
    }

    // Redirect to Cloudinary URL
    res.redirect(file.storagePath);
  } catch (error) {
    console.error('File serve error:', error);
    res.status(500).json({ error: 'Failed to serve file' });
  }
});

export default router;