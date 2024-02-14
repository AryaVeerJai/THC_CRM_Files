// // controllers/emailController.js
// const emailService = require('../services/emailService');

// exports.composeAndSendEmail = async (req, res) => {
//   // Implement logic to compose and send a custom email
// };

// controllers/emailController.js
const nodemailer = require('nodemailer');
const Customer = require('../models/customer');

// Compose and send a custom email
exports.composeAndSendEmail = async (req, res) => {
  try {
    const { subject, body, recipientEmails } = req.body;

    // Check if the requesting user is authorized (superuser or admin)
    const requestingUser = req.user; // Assuming you have middleware for authentication
    if (!requestingUser || (requestingUser.role !== 'superuser' && requestingUser.role !== 'admin')) {
      return res.status(403).json({ message: 'Permission denied.' });
    }

    // Fetch customer email addresses based on provided recipient IDs
    const customers = await Customer.find({ _id: { $in: recipientEmails } });
    const recipientEmailAddresses = customers.map(customer => customer.email);

    // Compose the email
    const mailOptions = {
      from: 'aryansingh879791@gmail.com',
      to: recipientEmailAddresses.join(', '),
      subject,
      text: body,
    };

    // Send the email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aryansingh879791@gmail.com',
        pass: 'ynzfdxtlsecbgmdbs',
      },
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email.' });
      }

      res.status(200).json({ message: 'Email sent successfully.', info });
    });
  } catch (error) {
    console.error('Error composing and sending email:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
