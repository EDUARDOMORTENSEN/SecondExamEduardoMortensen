const mongoose = require("mongoose");

const puzzleSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, unique: true },
  brand: String,
  model: String,
  category: String,
  description: String,
  isNew: Boolean,
  price: Number,
});

module.exports = mongoose.model("Puzzle", puzzleSchema);

