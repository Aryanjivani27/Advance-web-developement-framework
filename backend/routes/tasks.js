const express  = require('express');
const router   = express.Router();
const Task     = require('../models/Task');




// ─── GET /api/tasks ───────────────────────────────────────────────────────────
// Fetch all tasks, newest first
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching tasks', error: error.message });
  }
});

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────
// Fetch a single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching task', error: error.message });
  }
});

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const task = new Task({ title, description, status, priority, dueDate });
    const savedTask = await task.save();
    res.status(201).json({ success: true, message: 'Task created successfully', data: savedTask });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error while creating task', error: error.message });
  }
});

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
// Update an existing task by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task updated successfully', data: task });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error while updating task', error: error.message });
  }
});

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
// Delete a task by ID
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted successfully', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while deleting task', error: error.message });
  }
});

module.exports = router;
