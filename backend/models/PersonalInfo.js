const mongoose = require('mongoose');

const PersonalInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
  company: { type: String },
  streetAddress: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
  postalCode: { type: String, required: true },
  deliveryInstructions: { type: String },
  defaultShipping: { type: Boolean, default: false },
  defaultBilling: { type: Boolean, default: false },
}, {
  timestamps: true
});

module.exports = mongoose.model('PersonalInfo', PersonalInfoSchema);
