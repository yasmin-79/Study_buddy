import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';
import filesRouter from './routes/files.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// API routes
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/files', filesRouter);

// Serve React build
const clientBuildPath = path.join(__dirname, 'client/build');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  // For any other route, serve index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  console.warn('React build folder not found. Run "npm run build" inside client folder.');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
