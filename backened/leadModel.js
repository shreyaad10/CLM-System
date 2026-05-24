// =============================================
// leadModel.js - MongoDB Schema for Leads
// =============================================
const mongoose = require('mongoose');

// Define the shape of a Lead document in MongoDB
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },

    // Where the lead came from (e.g. Website, Referral, Social Media)
    source: {
      type: String,
      enum: ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Call', 'Other'],
      default: 'Other',
    },

    // Current stage of the lead in the pipeline
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Converted'],
      default: 'New',
    },

    // Admin notes / follow-up reminders
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamp fields
    timestamps: true,
  }
);

// Export the model so routes.js can use it
module.exports = mongoose.model('Lead', leadSchema);
