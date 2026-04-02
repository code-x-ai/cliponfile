import fs from 'fs';
import Batch from '../models/Batch.js';
import TextClip from '../models/TextClip.js';
import { cloudinary } from './cloudinary.js';

export const cleanupExpiredData = async () => {
  try {
    const expiryTime = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find expired batches
    const expiredBatches = await Batch.find({ createdAt: { $lt: expiryTime } });

    // Delete files from Cloudinary
    for (const batch of expiredBatches) {
      for (const file of batch.files) {
        if (file.cloudinaryPublicId) {
          try {
            await cloudinary.uploader.destroy(file.cloudinaryPublicId, {
              resource_type: 'auto',
            });
            console.log(`Deleted from Cloudinary: ${file.cloudinaryPublicId}`);
          } catch (err) {
            console.error(`Failed to delete Cloudinary file ${file.cloudinaryPublicId}:`, err);
          }
        }
      }
    }

    // Delete expired batches from database
    const deletedBatches = await Batch.deleteMany({ createdAt: { $lt: expiryTime } });

    // Delete expired text clips
    const deletedTextClips = await TextClip.deleteMany({ createdAt: { $lt: expiryTime } });

    console.log(
      `Cleanup completed: Deleted ${deletedBatches.deletedCount} batches and ${deletedTextClips.deletedCount} text clips`
    );
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};