// // models/customer.js
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const customerSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   address: { type: String },
// });

// module.exports = mongoose.model('Customer', customerSchema);

// models/customer.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  password: { type: String, required: true },
});

module.exports = mongoose.model('Customer', customerSchema);