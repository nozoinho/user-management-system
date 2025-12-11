const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * =====================================================
 * GET /users  ->  Retrieve all users
 * =====================================================
 * - Fetches all users from the database.
 * - Sorted by creation date (newest first).
 * - Uses `.lean()` for faster read-only performance.
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

/**
 * =====================================================
 * GET /users/:id -> Retrieve a single user by ID
 * =====================================================
 * - Looks up a user by MongoDB ObjectId.
 * - Returns 404 if the user does not exist.
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

/**
 * =====================================================
 * POST /users -> Create a new user
 * =====================================================
 * - Receives user data from the request body.
 * - Creates and stores a new user document.
 * - Handles duplicate email or phone number using MongoDB error code 11000.
 */
router.post('/', async (req, res) => {
  try {
    const {
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
    } = req.body;

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
    res.status(201).json(newUser);

  } catch (err) {
    // Duplicate email or phone number
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    if (err.code === 11000 && err.keyPattern?.phoneNumber) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    res.status(500).json({ error: 'Error creating user' });
  }
});

/**
 * =====================================================
 * PUT /users/:id -> Update an existing user
 * =====================================================
 * - Updates user fields using request body.
 * - `{ new: true }` ensures the updated document is returned.
 * - Handles duplicate fields during update as well.
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return updated document instead of the old one
    );

    if (!updatedUser)
      return res.status(404).json({ error: 'User not found' });

    res.json(updatedUser);

  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    if (err.code === 11000 && err.keyPattern?.phoneNumber) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    res.status(500).json({ error: 'Error updating user' });
  }
});

/**
 * =====================================================
 * DELETE /users/:id -> Delete a user
 * =====================================================
 * - Deletes a user from the database.
 * - Returns 404 if the user does not exist.
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser)
      return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

/**
 * =====================================================
 * POST /users/check -> Email/Phone uniqueness validator
 * =====================================================
 * - Validates whether an email or phone number already exists.
 * - Supports excluding the current user during update using `userId`.
 * - Useful for real-time validation in the frontend.
 */
router.post("/check", async (req, res) => {
  try {
    const { email, phoneNumber, userId } = req.body;

    // Ensure at least one field is being validated
    if (!email && !phoneNumber) {
      return res.status(400).json({ error: "Email or phoneNumber required" });
    }

    // Only validate userId if it is a valid ObjectId
    let currentUserId = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      currentUserId = userId; // dejarlo como string, MongoDB puede manejarlo
    }

    // Check for existing email
    const emailExists = email
      ? await User.findOne({
          email,
          ...(currentUserId ? { _id: { $ne: currentUserId } } : {})
        })
      : null;

    // Check for existing phone number
    const phoneExists = phoneNumber
      ? await User.findOne({
          phoneNumber,
          ...(currentUserId ? { _id: { $ne: currentUserId } } : {})
        })
      : null;

    res.json({
      emailExists: !!emailExists,
      phoneExists: !!phoneExists
    });
  } catch (err) {
    console.error("Error en /users/check:", err);
    res.status(500).json({ error: "Server error" });
  }
});





module.exports = router;
