const habitRoutes = require('./routes/habitRoutes');
const sleepRoutes = require("./routes/sleepRoutes");
const moodRoutes = require("./routes/moodRoutes");

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Simple test route
app.get('/', (req, res) => {
  res.send('Habit Tracker API is running!');
});


app.use('/api/habits', habitRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/mood", moodRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

