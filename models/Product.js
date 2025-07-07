const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  _id: String, // Manual ID
  name: String,
  price: Number,
  stock: Number
}, { _id: false }); // Evita que Mongoose genere uno automáticamente

ProductSchema.virtual('id').get(function () {
  return this._id;
});

ProductSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
