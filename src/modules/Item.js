const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  brand: {
    type: String
  },
  // WILL REFER TO CATEGORIES ID
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
  title: {
    type: String
  },
  price: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  quantity: {
    type: Number,
    required: true
  },
  images: {
    type: Array
  }
});
module.exports = mongoose.model("Item", itemSchema);
