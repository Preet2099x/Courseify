const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  playlistTitle: { type: String, required: true, },
  playlistUrl: { type: String, required: true, unique: true }, // To avoid duplicates
  modules: [{
    title: String,
    videos: [{
      title: String,
      videoId: String,
      thumbnail: String
    }]
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);