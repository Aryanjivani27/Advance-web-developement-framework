require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const dns = require('dns');
// Force Node.js to use Google's public DNS so mongodb+srv:// SRV lookups work
// even on college/institute networks that block SRV record resolution
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS: allow React dev server (localhost:5173) to call this API
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Parse incoming JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);   // public — register & login
app.use('/api/tasks', taskRoutes);   // protected — JWT required

// Health-check route
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running',
    version: '1.0.0',
    endpoints: {
      auth:  '/api/auth',
      tasks: '/api/tasks',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// ─── Database Connection ──────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit process on DB connection failure
  }
};

// ─── Start Server ─────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Tasks API: http://localhost:${PORT}/api/tasks`);
  });
});
