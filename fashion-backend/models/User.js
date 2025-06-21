const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: String,
  mobile: String,
  password: String,
});

module.exports = mongoose.model('User', userSchema);
