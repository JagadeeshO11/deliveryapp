import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/db.js';
import { sendOTP, verifyOTP } from '../utils/otp.js'; // keep your existing otp.js

const router = express.Router();

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, msg: 'Email required' });

  try {
    const otp = await sendOTP(email); // generate OTP using your otp.js

    // Insert OTP hash and timestamp into email_verification table
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Upsert logic: if email already exists, update; else insert
    await pool.query(
      `INSERT INTO email_verification (email, otp_hash, expires_at, verified, created_at)
       VALUES ($1, $2, $3, false, CURRENT_TIMESTAMP)
       ON CONFLICT (email)
       DO UPDATE SET otp_hash = $2, expires_at = $3, verified = false, created_at = CURRENT_TIMESTAMP`,
      [email, hashedOtp, expiresAt]
    );

    res.json({ success: true, msg: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ success: false, msg: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await pool.query(
      `SELECT * FROM email_verification WHERE email = $1`,
      [email]
    );

    if (record.rows.length === 0) {
      return res.status(400).json({ success: false, msg: 'No OTP request found for this email' });
    }

    const otpRecord = record.rows[0];

    // Check expiry
    if (new Date() > new Date(otpRecord.expires_at)) {
      return res.status(400).json({ success: false, msg: 'OTP expired' });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Invalid OTP' });
    }

    // Mark as verified
    await pool.query(
      `UPDATE email_verification SET verified = true WHERE email = $1`,
      [email]
    );

    res.json({ success: true, msg: 'OTP verified' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ success: false, msg: 'Server error during OTP verification' });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  const { email, name, phone, vehicle, city, password } = req.body;

  try {
    // 1. Check if email exists already
    const existing = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, msg: 'Email already registered' });
    }

    // 2. Check if email was OTP verified
    const otpRecord = await pool.query(
      `SELECT * FROM email_verification WHERE email = $1 AND verified = true`,
      [email]
    );
    if (otpRecord.rows.length === 0) {
      return res.status(400).json({ success: false, msg: 'Email not verified. Please verify OTP first.' });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert user
    await pool.query(
      `INSERT INTO users (email, name, phone, vehicle, city, password) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [email, name, phone, vehicle, city, hashedPassword]
    );

    // 5. Delete OTP record after signup
    await pool.query(`DELETE FROM email_verification WHERE email = $1`, [email]);

    res.json({ success: true, msg: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
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
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Login failed' });
  }
});

export default router;
