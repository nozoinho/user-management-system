/**
 * Fernando Ferreyra
 * CNumber: C0943320
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

/**
 * =====================================================
 * Global Middleware
 * =====================================================
 * - CORS: Allows backend to accept requests from the React frontend.
 * - express.json(): Automatically parses incoming JSON request bodies.
 */
app.use(cors());               // Enable requests from React frontend
app.use(express.json());       // Parse JSON request bodies

/**
 * =====================================================
 * MongoDB Connection
 * =====================================================
 * - Uses MONGODB_URI from .env if available; otherwise falls back to localhost.
 * - `useNewUrlParser` and `useUnifiedTopology` ensure modern connection behavior.
 */
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/user_management_system';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

/**
 * =====================================================
 * API Routes
 * =====================================================
 * - Imports and mounts user-related routes under `/users`.
 * - All endpoints in routes/users.js automatically inherit this prefix.
 */
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);  // Prefix all user routes with /users

/**
 * =====================================================
 * Root Route
 * =====================================================
 * - Simple health-check endpoint.
 * - Useful to confirm the API is running without hitting specific resources.
 */
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' }); // Simple JSON response for root
});

/**
 * =====================================================
 * Server Startup
 * =====================================================
 * - Uses PORT from environment variables when available.
 * - Defaults to port 3000 during development.
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
