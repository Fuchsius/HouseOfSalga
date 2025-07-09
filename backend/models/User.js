const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: String,
  mobile: String,
  password: String,
    password: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Added wishlist field
});
  

module.exports = mongoose.model('User', userSchema);
