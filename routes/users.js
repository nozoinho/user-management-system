const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Import the utility function to format dates
const { formatToMonthDayYear } = require('../utils');

// ===============================================
// GET /users -> list all users
// ===============================================
router.get('/', async (req, res) => {
  try {
    // Retrieve all users from the database, sorted by creation date (newest first)
    const users = await User.find().sort({ createdAt: -1 }).lean();

    // Format each user's date of birth before rendering
    const formattedUsers = users.map(user => ({
      ...user,
      dateOfBirth: formatToMonthDayYear(user.dateOfBirth)
    }));

    // Render the user list page
    res.render('users/index', { users: formattedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching users');
  }
});

// ===============================================
// GET /users/new -> show form to create a new user
// ===============================================
router.get('/new', (req, res) => {
  res.render('users/new');
});

// POST /users -> create a new user
router.post('/', async (req, res) => {
  try {
    // Extract fields from the request body
    const { firstName, lastName, dateOfBirth, address1, address2, city, postalCode, country, phoneNumber, email, userNotes } = req.body;
    
    // Create a new user document
    const newUser = new User({
        firstName,
        lastName,
        dateOfBirth,
        address1,
        address2,
        city,
        postalCode,
        country,
        phoneNumber,
        email,
        userNotes
    });

    // Save user to MongoDB
    await newUser.save();
    res.redirect('/users');
  } catch (err) {

    // Handle duplicate email or phone number errors
    if (err.code === 11000 && err.keyPattern.email) { 
      res.render('users/new', {
        user: req.body,
        emailError: 'This email is already registered.'
      });
    } else if (err.code === 11000 && err.keyPattern.phoneNumber) {
      res.render('users/new', {
        user: req.body,
        phoneError: 'This phone number is already registered.'
      });
    } else {
      next(err);
    }
  }
});

// ===============================================
// GET /users/:id/edit -> show form to edit a user
// ===============================================
router.get('/:id/edit', async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    // Format the date of birth to match input type="date" format
    const formattedUser = {
      ...user.toObject(),
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : ''
    };

    // Render the edit form with user data
    res.render('users/edit', { user: formattedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user');
  }
});

// ===============================================
// PUT /users/:id -> update a user
// ===============================================
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, address1, address2, city, postalCode, country, phoneNumber, email, userNotes } = req.body;
    
    // Update user document by ID
    await User.findByIdAndUpdate(req.params.id, {
        firstName,
        lastName,
        dateOfBirth,
        address1,
        address2,
        city,
        postalCode,
        country,
        phoneNumber,
        email,
        userNotes
    });

    // Redirect to the user list after successful update
    res.redirect('/users');
  } catch (err) {
    // Handle duplicate email or phone number errors during update
    if (err.code === 11000 && err.keyPattern.email) {
      res.render('users/edit', {
        user: { 
          _id: req.params.id, 
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dateOfBirth: req.body.dateOfBirth,
          address1: req.body.address1,
          address2: req.body.address2,
          city: req.body.city,
          postalCode: req.body.postalCode,
          country: req.body.country,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          userNotes: req.body.userNotes
        },
        emailError: 'This email is already registered.'
      });
    } else if (err.code === 11000 && err.keyPattern.phoneNumber) { 
      res.render('users/edit', {
        user: { 
          _id: req.params.id, 
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dateOfBirth: req.body.dateOfBirth,
          address1: req.body.address1,
          address2: req.body.address2,
          city: req.body.city,
          postalCode: req.body.postalCode,
          country: req.body.country,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          userNotes: req.body.userNotes
        },
        phoneError: 'This phone number is already registered.'
      });
    } else {
      next(err);
    }
  }
});

// ===============================================
// DELETE /users/:id -> delete a user
// ===============================================
router.delete('/:id', async (req, res) => {
  try {
    // Find and remove the user document with the given ID from the database
    await User.findByIdAndDelete(req.params.id);

    // After deletion, redirect back to the users list page
    res.redirect('/users');
  } catch (err) {
    // Log any errors and return a 500 Internal Server Error response
    console.error(err);
    res.status(500).send('Error deleting user');
  }
});

// Export router to make it available in server.js
module.exports = router;
