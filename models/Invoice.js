const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  _id: String, // Manual ID
  customer: String,
  products: [{
    productId: String, // Si también los productos usan IDs manuales
    quantity: Number
  }],
  total: Number,
  date: { type: Date, default: Date.now }
}, { _id: false });

InvoiceSchema.virtual('id').get(function () {
  return this._id;
});

InvoiceSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
