import express from "express";
import pool from "../db/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware: verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // user.id from auth.js
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: "Invalid token" });
  }
};

// 📌 GET wallet balance + transactions
router.get("/", authMiddleware, async (req, res) => {
  try {
    // 1. Ensure wallet exists
    let walletResult = await pool.query(`SELECT * FROM wallets WHERE user_id = $1`, [req.userId]);

    if (walletResult.rows.length === 0) {
      // Create wallet with 0 balance if not exists
      await pool.query(`INSERT INTO wallets (user_id, balance) VALUES ($1, 0)`, [req.userId]);
      walletResult = await pool.query(`SELECT * FROM wallets WHERE user_id = $1`, [req.userId]);
    }

    const wallet = walletResult.rows[0];

    // 2. Fetch transactions
    const transactions = await pool.query(
      `SELECT * FROM wallet_transactions WHERE wallet_id = $1 ORDER BY created_at DESC`,
      [wallet.id]
    );

    res.json({
      success: true,
      balance: wallet.balance,
      transactions: transactions.rows,
    });
  } catch (err) {
    console.error("Wallet fetch error:", err);
    res.status(500).json({ success: false, msg: "Failed to load wallet details" });
  }
});

// 📌 POST add money (credit)
router.post("/add", authMiddleware, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, msg: "Invalid amount" });
  }

  try {
    // Ensure wallet exists
    let walletResult = await pool.query(`SELECT * FROM wallets WHERE user_id = $1`, [req.userId]);
    if (walletResult.rows.length === 0) {
      await pool.query(`INSERT INTO wallets (user_id, balance) VALUES ($1, 0)`, [req.userId]);
      walletResult = await pool.query(`SELECT * FROM wallets WHERE user_id = $1`, [req.userId]);
    }

    const wallet = walletResult.rows[0];

    // Update balance
    const newBalance = Number(wallet.balance) + Number(amount);
    await pool.query(`UPDATE wallets SET balance = $1 WHERE id = $2`, [newBalance, wallet.id]);

    // Insert transaction
    await pool.query(
      `INSERT INTO wallet_transactions (wallet_id, amount, type) VALUES ($1, $2, 'credit')`,
      [wallet.id, amount]
    );

    res.json({ success: true, balance: newBalance, msg: "Money added successfully" });
  } catch (err) {
    console.error("Add money error:", err);
    res.status(500).json({ success: false, msg: "Failed to add money" });
  }
});

// 📌 POST spend money (debit)
router.post("/spend", authMiddleware, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, msg: "Invalid amount" });
  }

  try {
    const walletResult = await pool.query(`SELECT * FROM wallets WHERE user_id = $1`, [req.userId]);
    if (walletResult.rows.length === 0) {
      return res.status(400).json({ success: false, msg: "Wallet not found" });
    }

    const wallet = walletResult.rows[0];

    if (wallet.balance < amount) {
      return res.status(400).json({ success: false, msg: "Insufficient balance" });
    }

    // Deduct balance
    const newBalance = Number(wallet.balance) - Number(amount);
    await pool.query(`UPDATE wallets SET balance = $1 WHERE id = $2`, [newBalance, wallet.id]);

    // Insert transaction
    await pool.query(
      `INSERT INTO wallet_transactions (wallet_id, amount, type) VALUES ($1, $2, 'debit')`,
      [wallet.id, amount]
    );

    res.json({ success: true, balance: newBalance, msg: "Payment successful" });
  } catch (err) {
    console.error("Spend money error:", err);
    res.status(500).json({ success: false, msg: "Failed to spend money" });
  }
});

export default router;
