import mongoose from 'mongoose';
import { generateShortId } from '../utils/shortId.js';

const fileSchema = new mongoose.Schema({
  fileId: { type: String, required: true, unique: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  storagePath: { type: String, required: true },
  cloudinaryPublicId: { type: String }, // for deletion
});

const batchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  shortId: { type: String, required: true, unique: true, index: true },
  files: [fileSchema],
  totalSize: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 },
});

batchSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model('Batch', batchSchema);