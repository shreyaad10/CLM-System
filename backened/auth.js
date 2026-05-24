// =============================================
// auth.js - Admin Authentication
// =============================================
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ── POST /api/auth/login ───────────────────
// Validates admin credentials from .env and returns a JWT token
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Read credentials from environment variables (set in .env)
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  const JWT_SECRET     = process.env.JWT_SECRET     || 'supersecretkey';

  // Simple credential check (no database needed for single admin)
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Create a JWT token valid for 8 hours
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '8h' });

  res.json({ token, message: 'Login successful' });
});

// ── Middleware: verifyToken ────────────────
// Protect routes by checking for a valid JWT in the Authorization header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Expect header format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token provided. Access denied.' });
  }

  const token = authHeader.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Attach decoded user info to request
    next();              // Continue to the actual route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = router;
module.exports.verifyToken = verifyToken;
