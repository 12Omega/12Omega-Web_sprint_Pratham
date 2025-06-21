// models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  active: Boolean,
  createdAt: { type: Date, default: Date.now },
  // other session fields
});

module.exports = mongoose.model('Session', sessionSchema);
