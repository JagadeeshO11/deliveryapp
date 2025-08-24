import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/db.js';
import { sendOTP } from '../utils/otp.js';

const router = express.Router();

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, msg: 'Email required' });

  try {
    const otp = await sendOTP(email);
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await pool.query(
      `INSERT INTO email_verification (email, otp_hash, expires_at, verified, created_at)
       VALUES ($1, $2, $3, false, CURRENT_TIMESTAMP)
       ON CONFLICT (email)
       DO UPDATE SET otp_hash = $2, expires_at = $3, verified = false, created_at = CURRENT_TIMESTAMP`,
      [email, hashedOtp, expiresAt]
    );

    res.json({ success: true, msg: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await pool.query(`SELECT * FROM email_verification WHERE email = $1`, [email]);
    if (record.rows.length === 0) return res.status(400).json({ success: false, msg: 'No OTP found' });

    const otpRecord = record.rows[0];
    if (new Date() > new Date(otpRecord.expires_at)) return res.status(400).json({ success: false, msg: 'OTP expired' });

    const isMatch = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!isMatch) return res.status(400).json({ success: false, msg: 'Invalid OTP' });

    await pool.query(`UPDATE email_verification SET verified = true WHERE email = $1`, [email]);
    res.json({ success: true, msg: 'OTP verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'OTP verification failed' });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  const { email, name, phone, vehicle, city, password } = req.body;
  try {
    const existing = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (existing.rows.length > 0) return res.status(400).json({ success: false, msg: 'Email already registered' });

    const otpRecord = await pool.query(`SELECT * FROM email_verification WHERE email = $1 AND verified = true`, [email]);
    if (otpRecord.rows.length === 0) return res.status(400).json({ success: false, msg: 'Email not verified' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (email, name, phone, vehicle, city, password) VALUES ($1,$2,$3,$4,$5,$6)`,
      [email, name, phone, vehicle, city, hashedPassword]
    );

    await pool.query(`DELETE FROM email_verification WHERE email = $1`, [email]);
    res.json({ success: true, msg: 'Signup successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Signup failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) return res.json({ success: false, msg: 'User not found' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, msg: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        vehicle: user.vehicle,
        city: user.city
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Login failed' });
  }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, msg: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, msg: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
}

// Profile route
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id,email,name,phone,vehicle,city FROM users WHERE id = $1`,
      [req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, msg: 'User not found' });
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Failed to fetch profile' });
  }
});

export default router;
