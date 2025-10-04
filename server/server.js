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

// ✅ Ensure uploads folder exists BEFORE serving it
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/files', filesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
