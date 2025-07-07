const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  customer: String,
  products: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number
  }],
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
