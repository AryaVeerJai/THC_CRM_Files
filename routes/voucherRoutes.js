const express = require('express');
const router = express.Router();
const moment = require('moment');
const Voucher = require('../models/voucherSchema');

// Helper function to generate a random voucher code (6 characters of alphanumeric uppercase)
function generateVoucherCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let voucherCode = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    voucherCode += characters.charAt(randomIndex);
  }

  return voucherCode;
}

// Helper function to format voucher dates
function formatVoucherDates(voucher) {
  return {
    ...voucher.toObject(),
    createdDate: moment(voucher.createdDate).format('DD MMM YYYY'),
    expiryDate: moment(voucher.expiryDate).format('DD MMM YYYY'),
  };
}

// Voucher creation route
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const voucherCode = generateVoucherCode();
    const createdDate = new Date();
    const expiryDate = moment(createdDate).add(6, 'months').toDate();

    const voucher = new Voucher({
      name,
      email,
      phone,
      address,
      voucherCode,
      createdDate,
      expiryDate,
    });
    await voucher.save();

    res.json({ voucher: formatVoucherDates(voucher) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Voucher retrieval route
router.get('/', async (req, res) => {
    try {
      const vouchers = await Voucher.find();
      const formattedVouchers = vouchers.map((voucher) => formatVoucherDates(voucher));
      res.json({ vouchers: formattedVouchers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
