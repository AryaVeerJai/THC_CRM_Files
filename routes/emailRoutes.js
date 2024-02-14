// routes/emailRoutes.js
const express = require('express');
const router = express.Router();

const emailController = require('../controllers/emailController');

router.post('/', emailController.composeAndSendEmail);

module.exports = router;
