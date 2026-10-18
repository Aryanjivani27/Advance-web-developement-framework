const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Helper — generate a signed JWT ──────────────────────────────────────────
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

// ─── POST /api/auth/register ──────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Server-side input validation ──────────────────────────────────────────
    const errors = [];
    if (!name || name.trim() === '')          errors.push('Name is required');
    if (!email || email.trim() === '')        errors.push('Email is required');
    if (!password || password.length < 6)    errors.push('Password must be at least 6 characters');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join('. ') });
    }

    // ── Check for duplicate email ─────────────────────────────────────────────
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    // ── Create user (password hashed via pre-save hook in User model) ─────────
    const user = await User.create({ name: name.trim(), email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Server-side input validation ──────────────────────────────────────────
    if (!email || email.trim() === '') {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    // ── Find user by email ────────────────────────────────────────────────────
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Generic message to avoid user enumeration
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // ── Verify password ───────────────────────────────────────────────────────
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};
