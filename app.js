// // app.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost/holidays_club_crm', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Define routes
// const authRoutes = require('./routes/authRoutes');
// const customerRoutes = require('./routes/customerRoutes');
// const voucherRoutes = require('./routes/voucherRoutes');
// const emailRoutes = require('./routes/emailRoutes');

// app.use('/api/auth', authRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/vouchers', voucherRoutes);
// app.use('/api/emails', emailRoutes);

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


// Example usage in app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { authenticateUser, authorizeRoles } = require('./middleware/authMiddleware');
const { handleErrors } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
// mongoose.connect('mongodb://localhost/holidays_club_crm', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:adminpass@holidaysclubcrm.5nqc6zg.mongodb.net/holidays_club_crm?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Event handlers for MongoDB connection events
db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Custom middleware usage
// app.use(authenticateUser);
app.use('/api/admin', authorizeRoles('superuser', 'admin'));
// app.use(require('./routes/voucherRoutes'));

// Define routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const voucherRoutes = require('./routes/voucherRoutes');
const emailRoutes = require('./routes/emailRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/vouchers', voucherRoutes);

// Error handling middleware
app.use(handleErrors);


setInterval(async () => {
  try {
    const Voucher = require('./models/voucherModel');

    const expiredVouchers = await Voucher.find({
      expiryDate: { $lte: new Date() },
      status: 'Active',
    });

    if (expiredVouchers.length > 0) {
      await Voucher.updateMany(
        { _id: { $in: expiredVouchers.map((voucher) => voucher._id) } },
        { $set: { status: 'Inactive' } }
      );
      console.log('Voucher statuses updated.');
    }
  } catch (error) {
    console.error('Error updating voucher statuses:', error);
  }
}, 24 * 60 * 60 * 1000); // Run every 24 hours

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

