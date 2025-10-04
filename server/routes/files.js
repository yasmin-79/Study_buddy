import express from "express";
import pool from "../db.js";
import fs from "fs";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ✅ GET all files (for the logged-in user)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM files WHERE user_id = $1 ORDER BY id DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch files error:", err);
    res.status(500).json({ message: "Server error fetching files" });
  }
});

// ✅ DELETE a file by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const fileRes = await pool.query(
      "SELECT filename, user_id FROM files WHERE id=$1",
      [id]
    );
    if (!fileRes.rows.length)
      return res.status(404).json({ message: "File not found" });

    if (fileRes.rows[0].user_id !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const filename = fileRes.rows[0].filename;
    const filePath = `uploads/${filename}`;

    fs.unlink(filePath, (err) => {
      if (err) console.error("File delete error:", err);
    });

    await pool.query("DELETE FROM files WHERE id=$1", [id]);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Download a file by filename
router.get("/download/:filename",  async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`;

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Force download
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  } catch (err) {
    console.error("Download route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
