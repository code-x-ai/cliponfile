import mongoose from 'mongoose';
import { generateShortId } from '../utils/shortId.js';

const textClipSchema = new mongoose.Schema({
  textId: { type: String, required: true, unique: true }, // internal UUID
  shortId: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }
});

textClipSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model('TextClip', textClipSchema);