// scripts/seedSuperuser.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

async function seedSuperuser() {
  const superuser = {
    username: 'superuser',
    email: 'superuser@example.com',
    password: await bcrypt.hash('superuserpassword', 10),
    role: 'superuser',
  };

  await User.create(superuser);
  console.log('Superuser created successfully.');
}

// Connect to MongoDB
mongoose.connect('mongodb://localhost/holidays_club_crm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Seed the superuser
seedSuperuser().then(() => {
  // Close the MongoDB connection after seeding
  mongoose.connection.close();
});
