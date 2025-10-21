const mongoose = require('mongoose');

// Define the schema for User collection
// Each field includes its data type and validation rules
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },       // User's first name (mandatory)
  lastName: { type: String, required: true },        // User's last name (mandatory)
  dateOfBirth: { type: Date, required: true },       // User's date of birth (mandatory)
  address1: { type: String, required: true },        // Primary address line (mandatory)
  address2: { type: String },                        // Secondary address line (optional)
  city: { type: String, required: true },            // City name (mandatory)
  postalCode: { type: String, required: true },      // Postal or ZIP code (mandatory)
  country: { type: String, required: true },         // Country name (mandatory)
  phoneNumber: { type: String, required: true, unique: true }, // Unique phone number (mandatory)
  email: { type: String, required: true, unique: true },       // Unique email address (mandatory)
  userNotes: { type: String }                        // Optional user notes or comments
}, { timestamps: true });                            // Automatically adds createdAt and updatedAt fields

// Export the User model for use in other parts of the application
module.exports = mongoose.model('User', userSchema);
