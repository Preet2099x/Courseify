const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Save a public course
router.post('/courses', async (req, res) => {
  try {
    const { playlistTitle, playlistUrl, modules } = req.body;
    
    // Check if course already exists
    const existingCourse = await Course.findOne({ playlistUrl });
    if (existingCourse) {
      return res.status(400).json({ error: 'Course already exists!' });
    }

    // Create new course
    const newCourse = await Course.create({
      playlistTitle,
      playlistUrl,
      modules
    });

    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all public courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }); // Newest first
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// In your courseRoutes.js
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;