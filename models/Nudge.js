const mongoose = require('mongoose');

const nudgeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 120
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Nudge', nudgeSchema);
