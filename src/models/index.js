// src/models/index.js
// Export all models for easy access

const Wrestler = require('./wrestler');
const Championship = require('./championship');
const Event = require('./event');
const Promotion = require('./promotion');

module.exports = {
  Wrestler,
  Championship,
  Event,
  Promotion
};