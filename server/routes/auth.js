import express from 'express';
import authMiddleware from "../middleware/auth.js";
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(400).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email',
      [name,email,hash]
    );

    res.json({ message: 'Registration successful', user: result.rows[0] });
  } catch (err) { 
    console.error(err); 
    res.status(500).json({ message:'Registration failed' }); 
  }
});

// LOGIN
router.post('/login', async (req,res)=> {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const result = await pool.query('SELECT * FROM users WHERE email=$1',[email]);
    if (!result.rows.length) return res.status(400).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { 
    console.error(err); 
    res.status(500).json({ message:'Login failed' }); 
  }
});

// CHANGE PASSWORD
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Password required" });

    const userId = req.user.id;
    const hash = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password=$1 WHERE id=$2", [hash, userId]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update password" });
  }
});

export default router;
