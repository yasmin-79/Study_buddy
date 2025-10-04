import express from "express";
import multer from "multer";
import path from "path";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.js";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
});

// ✅ Upload route
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { title, subject } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    // Save file info in DB
    const result = await pool.query(
      "INSERT INTO files (user_id, title, subject, filename) VALUES ($1,$2,$3,$4) RETURNING *",
      [
        req.user.id,
        title?.trim() || req.file.originalname,
        subject?.trim() || "General",
        req.file.filename,
      ]
    );

    res.json({ message: "File uploaded successfully", file: result.rows[0] });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Failed to upload file" });
  }
});

export default router;
