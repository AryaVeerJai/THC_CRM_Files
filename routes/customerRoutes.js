// routes/customerRoutes.js
const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');

// to add customer
router.post('/', customerController.addCustomer);

// Login customer
router.post('/login', customerController.loginCustomer);

// to get all customer
router.get('/', customerController.getAllCustomers);

module.exports = router;
