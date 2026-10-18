const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── protect ──────────────────────────────────────────────────────────────────
// Verifies the JWT sent in the Authorization: Bearer <token> header.
// On success, attaches req.user (id + email + name) and calls next().
// On failure, responds with 401 immediately.
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user (excluding the password) to the request object
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
    }
    res.status(500).json({ success: false, message: 'Authentication error', error: error.message });
  }
};

module.exports = protect;
