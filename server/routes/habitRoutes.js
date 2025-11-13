const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// CREATE new habit
router.post('/', async (req, res) => {
  try {
    const habit = new Habit(req.body);
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all habits
router.get('/', async (req, res) => {
  const habits = await Habit.find();
  res.json(habits);
});

// UPDATE habit by ID
router.put('/:id', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if(!habit) return res.status(404).json({message: "Habit not found"});

    habit.streak = (habit.streak || 0) + 1;
    await habit.save();

    res.json(habit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// DELETE habit
router.delete('/:id', async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
