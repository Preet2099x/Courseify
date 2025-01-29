const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Connection failed:', err));

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Your React app's URL
    credentials: true // Optional (for cookies/auth later)
  }));
app.use(express.json());

// Routes
const courseRoutes = require('./routes/courseRoutes');
app.use('/api', courseRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});