// // controllers/voucherController.js
// const pdfService = require('../services/pdfService');

// exports.createVoucher = async (req, res) => {
//   // Implement logic to create a voucher and send it via email
// };

// controllers/voucherController.js
const pdfService = require('../services/pdfService');
const nodemailer = require('nodemailer');
const Customer = require('../models/customer');

// Create a voucher and send it via email
exports.createVoucher = async (req, res) => {
  try {
    const { voucherDetails, recipientEmails } = req.body;

    // Check if the requesting user is authorized (superuser or admin)
    const requestingUser = req.user; // Assuming you have middleware for authentication
    if (!requestingUser || (requestingUser.role !== 'superuser' && requestingUser.role !== 'admin')) {
      return res.status(403).json({ message: 'Permission denied.' });
    }

    // Generate the PDF voucher
    const voucherPdf = await pdfService.generateVoucher(voucherDetails);

    // Fetch customer email addresses based on provided recipient IDs
    const customers = await Customer.find({ _id: { $in: recipientEmails } });
    const recipientEmailAddresses = customers.map(customer => customer.email);

    // Compose the email with the voucher attached
    const mailOptions = {
      from: 'aryansingh879791@gmail.com',
      to: recipientEmailAddresses.join(', '),
      subject: 'Your Voucher',
      text: 'Please find your voucher attached.',
      attachments: [
        {
          filename: 'voucher.pdf',
          content: voucherPdf,
          encoding: 'base64',
        },
      ],
    };

    // Send the email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aryansingh879791@gmail.com',
        pass: 'nzfdxtlsecbgmdbs',
      },
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending voucher email:', error);
        return res.status(500).json({ message: 'Failed to send voucher email.' });
      }

      res.status(200).json({ message: 'Voucher created and email sent successfully.', info });
    });
  } catch (error) {
    console.error('Error creating voucher and sending email:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
