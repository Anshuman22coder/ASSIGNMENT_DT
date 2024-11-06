const express = require('express');
const router = express.Router();
const Nudge = require('../models/Nudge');

// Create a new nudge
router.post('/', async (req, res) => {
  try {
    const newNudge = new Nudge(req.body);
    const savedNudge = await newNudge.save();
    res.status(201).json(savedNudge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all nudges
router.get('/', async (req, res) => {
  try {
    const nudges = await Nudge.find();
    res.status(200).json(nudges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific nudge by ID
router.get('/:id', async (req, res) => {
  try {
    const nudge = await Nudge.findById(req.params.id);
    if (!nudge) return res.status(404).json({ message: 'Nudge not found' });
    res.status(200).json(nudge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a nudge by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedNudge = await Nudge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNudge) return res.status(404).json({ message: 'Nudge not found' });
    res.status(200).json(updatedNudge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a nudge by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedNudge = await Nudge.findByIdAndDelete(req.params.id);
    if (!deletedNudge) return res.status(404).json({ message: 'Nudge not found' });
    res.status(200).json({ message: 'Nudge deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
