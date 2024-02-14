// // controllers/authController.js
// const User = require('../models/user');
// const bcrypt = require('bcryptjs');

// exports.register = async (req, res) => {
//   // Implement user registration logic
// };

// exports.login = async (req, res) => {
//   // Implement user login logic
// };

// controllers/authController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { GLOBAL_TOKEN } = require('../config/constants'); // Import the constant token

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with a default role (e.g., 'user')
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login a user
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
  
      // Compare the entered password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
  
      // If the login is successful, respond with the constant token
      res.status(200).json({ message: 'Login successful.', user, token: GLOBAL_TOKEN });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

// Update user role (superuser only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    // Check if the requesting user is a superuser
    const requestingUser = req.user; // Assuming you have middleware for authentication
    if (!requestingUser || requestingUser.role !== 'superuser') {
      return res.status(403).json({ message: 'Permission denied.' });
    }

    // Update the user's role
    const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User role updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
