import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cron from 'node-cron';

import uploadRoutes from './routes/upload.js';
import clipboardRoutes from './routes/clipboard.js';
import fileRoutes from './routes/file.js';
import adminRoutes from './routes/admin.js';
import { cleanupExpiredData } from './utils/cleanup.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP',
});

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(limiter);

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/clipboard', clipboardRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// // Production: serve frontend static files
// if (process.env.NODE_ENV === 'production') {
//   const staticPath = join(__dirname, 'public');
//   app.use(express.static(staticPath));
//   app.get('*', (req, res) => {
//     res.sendFile(join(staticPath, 'index.html'));
//   });
// }

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schedule cleanup every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Running cleanup job...');
  await cleanupExpiredData();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});