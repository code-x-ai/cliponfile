import express from 'express';
import Batch from '../models/Batch.js';
import TextClip from '../models/TextClip.js';
import { checkAdminPassword } from '../middleware/auth.js';

const router = express.Router();


router.post('/analytics', checkAdminPassword, async (req, res) => {
  try {
    // Get total files count and size
    const batches = await Batch.find({});
    let totalFiles = 0;
    let totalSize = 0;
    
    batches.forEach(batch => {
      totalFiles += batch.files.length;
      totalSize += batch.totalSize;
    });
    
    // Get total text clips count
    const totalTextClips = await TextClip.countDocuments();
    
    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayBatches = await Batch.find({ createdAt: { $gte: today } });
    let todayFiles = 0;
    let todaySize = 0;
    
    todayBatches.forEach(batch => {
      todayFiles += batch.files.length;
      todaySize += batch.totalSize;
    });
    
    const todayTextClips = await TextClip.countDocuments({ createdAt: { $gte: today } });
    
    // Get last 7 days stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const last7DaysBatches = await Batch.find({ createdAt: { $gte: sevenDaysAgo } });
    let last7DaysFiles = 0;
    let last7DaysSize = 0;
    
    last7DaysBatches.forEach(batch => {
      last7DaysFiles += batch.files.length;
      last7DaysSize += batch.totalSize;
    });
    
    const last7DaysTextClips = await TextClip.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    
    res.json({
      success: true,
      total: {
        files: totalFiles,
        sizeBytes: totalSize,
        sizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        textClips: totalTextClips
      },
      today: {
        files: todayFiles,
        sizeBytes: todaySize,
        sizeMB: (todaySize / (1024 * 1024)).toFixed(2),
        textClips: todayTextClips
      },
      last7Days: {
        files: last7DaysFiles,
        sizeBytes: last7DaysSize,
        sizeMB: (last7DaysSize / (1024 * 1024)).toFixed(2),
        textClips: last7DaysTextClips
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;