const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  brand: {
    type: String
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 300
  },
  modelId: {
    type: String
  },
  price: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  images: {
    type: Array
  }
});
module.exports = mongoose.model("Item", itemSchema);
