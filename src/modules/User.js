const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 15
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  refreshToken: {
    type: String
  },
  createdAt: {
    type: Date,
    defualt: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
