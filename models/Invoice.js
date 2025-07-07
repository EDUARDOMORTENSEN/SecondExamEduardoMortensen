const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  _id: String, // Manual ID
  customer: String,
  products: [{
    productId: String, // ID del producto manual
    quantity: Number
  }],
  total: Number,
  date: { type: Date, default: Date.now }
});

// Virtual para mostrar id (opcional, ya que usamos _id manual)
InvoiceSchema.virtual('id').get(function () {
  return this._id;
});

InvoiceSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);

