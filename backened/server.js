// =============================================
// server.js - Main entry point for the backend
// =============================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// ── Middleware ─────────────────────────────
app.use(cors());                        // Allow frontend to talk to backend
app.use(express.json());                // Parse incoming JSON request bodies

// ── Routes ────────────────────────────────
const authRoutes = require('./auth');
const leadRoutes = require('./routes');

app.use('/api/auth', authRoutes);       // Auth routes: POST /api/auth/login
app.use('/api/leads', leadRoutes);      // Lead CRUD routes

// ── MongoDB Connection ─────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/minicrm';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ── Start Server ───────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
