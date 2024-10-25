const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for the Admin
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // Ensure each username is unique
  },
  password: {
    type: String,
    required: true, // Will store the hashed password
  },
});

// Pre-save hook to hash the password before saving
adminSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate salt and hash the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare hashed passwords during login
adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Export the Admin model
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
