// // // controllers/customerController.js
// // const Customer = require('../models/customer');

// // exports.addCustomer = async (req, res) => {
// //   // Implement logic to add a new customer
// // };

// // exports.getAllCustomers = async (req, res) => {
// //   // Implement logic to get all customers
// // };

// // controllers/customerController.js
// const Customer = require('../models/customer');

// // Add a new customer
// exports.addCustomer = async (req, res) => {
//   try {
//     const { name, email, phone, address } = req.body;

//     // Check if the customer already exists
//     const existingCustomer = await Customer.findOne({ email });
//     if (existingCustomer) {
//       return res.status(400).json({ message: 'Customer with this email already exists.' });
//     }

//     // Create a new customer
//     const newCustomer = new Customer({
//       name,
//       email,
//       phone,
//       address,
//     });

//     // Save the customer to the database
//     await newCustomer.save();

//     res.status(201).json({ message: 'Customer added successfully.', customer: newCustomer });
//   } catch (error) {
//     console.error('Error adding customer:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// // Get all customers
// exports.getAllCustomers = async (req, res) => {
//   try {
//     // Retrieve all customers from the database
//     const customers = await Customer.find();

//     res.status(200).json(customers);
//   } catch (error) {
//     console.error('Error getting customers:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


// controllers/customerController.js
const Customer = require('../models/customer');
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");

// Add a new customer
exports.addCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Check if the customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this email already exists.' });
    }

    // Generate a temporary password
    const tempPassword = generateTempPassword();

    // Hash the temporary password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create a new customer with the hashed password
    const newCustomer = new Customer({
      name,
      email,
      phone,
      address,
      password: hashedPassword, // Store the hashed password in the database
    });

    // Save the customer to the database
    await newCustomer.save();

    // Send the temporary password to the customer's email
    await sendEmail(email, tempPassword);

    res.status(201).json({ message: 'Customer added successfully.', customer: newCustomer });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// // Login customer
// exports.loginCustomer = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the customer by email
//     const customer = await Customer.findOne({ email });
//     if (!customer) {
//       return res.status(404).json({ message: 'Customer not found.' });
//     }

//     // Check if the password is correct
//     const isPasswordValid = await bcrypt.compare(password, customer.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: '117 Invalid email or password.' });
//     }

//     // Create JWT token
//     const token = jwt.sign({ email: customer.email }, 'your_secret_key', { expiresIn: '1h' });

//     res.status(200).json({ message: 'Login successful.', token });
//   } catch (error) {
//     console.error('Error logging in customer:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// Login customer
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '144 Invalid email or password.' });
    }

    // If the password is valid, create a JWT token
    const token = jwt.sign({ email: customer.email }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error('Error logging in customer:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    // Retrieve all customers from the database
    const customers = await Customer.find();

    res.status(200).json(customers);
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to generate a temporary password
function generateTempPassword() {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let tempPassword = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    tempPassword += charset[randomIndex];
  }
  return tempPassword;
}

// Function to send email using Gmail
async function sendEmail(email, password) {
  try {
    // Create a transporter for sending emails using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aryansingh879791@gmail.com',
        pass: 'nzfdxtlsecbgmdbs',
      },
    });

    // Email message
    const mailOptions = {
      from: 'your_gmail_username@gmail.com',
      to: email,
      subject: 'Your temporary password',
      text: `Your temporary password is: ${password}. Please change it after logging in.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

