// =============================================
// routes.js - Lead CRUD API Routes
// =============================================
const express = require('express');
const router = express.Router();
const Lead = require('./leadModel');
const { verifyToken } = require('./auth');

// All lead routes are protected — admin must be logged in
// verifyToken middleware checks JWT on every request below

// ── GET /api/leads ─────────────────────────
// Fetch all leads, newest first
router.get('/', verifyToken, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leads', error: err.message });
  }
});

// ── POST /api/leads ────────────────────────
// Create a new lead
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, email, source, status, notes } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and Email are required.' });
    }

    const newLead = new Lead({ name, email, source, status, notes });
    const saved = await newLead.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating lead', error: err.message });
  }
});

// ── PUT /api/leads/:id ─────────────────────
// Update an existing lead by its MongoDB _id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, email, source, status, notes } = req.body;

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, source, status, notes },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updated) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating lead', error: err.message });
  }
});

// ── DELETE /api/leads/:id ──────────────────
// Delete a lead by its MongoDB _id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Lead.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    res.json({ message: 'Lead deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting lead', error: err.message });
  }
});

module.exports = router;
