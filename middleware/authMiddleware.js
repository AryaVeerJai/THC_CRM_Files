// // middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('../models/user');
// const { JWT_SECRET } = require('../config/constants'); // Update the path to constants

// module.exports = {
//   // Middleware to authenticate users using email and password
//   authenticateUser: async (req, res, next) => {
//     const { email, password } = req.body;

//     try {
//       // Check if the user exists
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(401).json({ message: 'Invalid credentials.' });
//       }

//       // Compare the entered password with the stored hashed password
//       const passwordMatch = await bcrypt.compare(password, user.password);
//       if (!passwordMatch) {
//         return res.status(401).json({ message: 'Invalid credentials.' });
//       }

//       // If the credentials are valid, generate a token
//       const token = jwt.sign({ user: user.id }, JWT_SECRET, { expiresIn: '1h' });

//       // Attach the user and token to the request for further use
//       req.user = user;
//       req.token = token;

//       next();
//     } catch (error) {
//       console.error('Authentication error:', error);
//       res.status(401).json({ message: 'Invalid credentials.' });
//     }
//   },

//   // Middleware to authorize users based on roles
//   authorizeRoles: (...roles) => {
//     return (req, res, next) => {
//       const { role } = req.user;

//       if (!roles.includes(role)) {
//         return res.status(403).json({ message: 'Permission denied' });
//       }

//       next();
//     };
//   },
// };

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { JWT_SECRET } = require('../config/constants');

module.exports = {
  // Middleware to authenticate users using email and password
  authenticateUser: async (req, res, next) => {
    const { email, password } = req.body;

    try {
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

      // If the credentials are valid, generate a token
      const token = jwt.sign({ user: { id: user.id, role: user.role } }, JWT_SECRET, { expiresIn: '1h' });

      // Attach the user and token to the request for further use
      req.user = { id: user.id, role: user.role };
      req.token = token;

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Invalid credentials.' });
    }
  },

  // Middleware to authorize users based on roles
  authorizeRoles: (...roles) => {
    return (req, res, next) => {
      const { role } = req.user;

      if (!roles.includes(role)) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      next();
    };
  },
};
