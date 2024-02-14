// const mongoose = require('mongoose');



// const voucherSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     phoneno: {
//         type: String,
//         required: true
//     },
//     address: {
//         type: String,
//         required: true
//     },
//     voucher: {
//         type: String,
//         required: true
//     },
//     // image: String,
//     // url: String,
//     // image: {
//     //     path: String, 
//     //     contentType: String 
//     // },
//     // url: {
//     //     path: String, 
//     //     contentType: String
//     // },
//     date: {
//         type: String,
//     }
// }, { collection: 'vouchers' })

// voucherSchema.pre('save', function (next) {
//     // only for month
//     // const currentDate = new Date();
//     // const monthName = currentDate.toLocaleString('default', { month: 'long' });
    
//     // this.month = monthName;
//     // this.date = currentDate.getDate();
//     // next();

//     // for day and month
//     const currentDate = new Date();
//     const dayOfMonth = currentDate.getDate();
//     const monthName = currentDate.toLocaleString('default', { month: 'short' });
//     const yearOfDate = currentDate.getFullYear();

//     // Format the date as "DD MMM"
//     this.date = `${dayOfMonth} ${monthName} ${yearOfDate}`;

//     next();
//   });

// const Voucher = mongoose.model('VOUCHER', voucherSchema);

// module.exports = Voucher;

const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  voucherCode: String,
  createdDate: { type: Date, default: Date.now },
  expiryDate: Date,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
});

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
