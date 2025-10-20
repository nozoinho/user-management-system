const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Import the utility function
const { formatToMonthDayYear } = require('../utils');

// GET /users → list all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    const formattedUsers = users.map(user => ({
      ...user,
      dateOfBirth: formatToMonthDayYear(user.dateOfBirth)
    }));
    res.render('users/index', { users: formattedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching users');
  }
});

// GET /users/new → show form to create a new user
router.get('/new', (req, res) => {
  res.render('users/new');
});

// POST /users → create a new user
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, address1, address2, city, postalCode, country, phoneNumber, email, userNotes } = req.body;
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
    await newUser.save();
    res.redirect('/users');
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.email) { // Mongo duplicate
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

// GET /users/:id/edit → show form to edit a user
router.get('/:id/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    const formattedUser = {
      ...user.toObject(),
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : ''
    };
    res.render('users/edit', { user: formattedUser });
    //res.render('users/edit', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user');
  }
});

// PUT /users/:id → update a user
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, address1, address2, city, postalCode, country, phoneNumber, email, userNotes } = req.body;
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
    res.redirect('/users');
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.email) { // Mongo duplicate
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
    } else if (err.code === 11000 && err.keyPattern.phoneNumber) { // Mongo duplicate
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

// DELETE /users/:id → delete a user
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user');
  }
});

module.exports = router;
