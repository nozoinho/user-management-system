// Load environment variables
require('dotenv').config();

// Import libraries
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars configuration
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride('_method')); // Enable PUT and DELETE via forms
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/user_management_system';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

// Root route
app.get('/', (req, res) => res.redirect('/users'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
