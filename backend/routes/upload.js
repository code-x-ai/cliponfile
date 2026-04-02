import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import Batch from '../models/Batch.js';
import { generateShortId } from '../utils/shortId.js';
import { storage } from '../utils/cloudinary.js';

const router = express.Router();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    files: 5,
  },
});

router.post('/', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Check total size (Cloudinary gives size in bytes)
    const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      return res.status(400).json({ error: 'Total size exceeds 50MB limit' });
    }

    // Generate unique shortId
    let shortId;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      shortId = generateShortId();
      const existing = await Batch.findOne({ shortId });
      if (!existing) isUnique = true;
      attempts++;
    }
    if (!isUnique) {
      shortId = generateShortId() + Date.now().toString(36).slice(-2);
    }

    const batchId = uuidv4();
    const files = req.files.map(file => ({
      fileId: uuidv4(),
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      storagePath: file.path, // Cloudinary URL
      cloudinaryPublicId: file.filename, // public ID for deletion
    }));

    const batch = new Batch({
      batchId,
      shortId,
      files,
      totalSize,
    });

    await batch.save();

    res.json({
      success: true,
      shortId,
      files: files.map(f => ({
        fileId: f.fileId,
        originalName: f.originalName,
        mimetype: f.mimetype,
        size: f.size,
      })),
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;