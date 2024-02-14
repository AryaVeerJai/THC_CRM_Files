const User = require('../models/user');

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error getting admins:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add a new admin
exports.addAdmin = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    // Assuming you have a User model with appropriate fields
    const newAdmin = new User({
      name,
      email,
      phone,
      role: role || 'admin', // Default role is 'admin'
    });

    // Save the new admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin added successfully.', admin: newAdmin });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add a new superuser
exports.addSuperuser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Assuming you have a User model with appropriate fields
    const newSuperuser = new User({
      name,
      email,
      phone,
      role: 'superuser',
    });

    // Save the new superuser to the database
    await newSuperuser.save();

    res.status(201).json({ message: 'Superuser added successfully.', superuser: newSuperuser });
  } catch (error) {
    console.error('Error adding superuser:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
