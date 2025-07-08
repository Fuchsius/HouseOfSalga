const mongoose = require('mongoose');

const RecentlyViewSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    rate: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Use 'recentlyview' collection
module.exports = mongoose.model('recentlyview', RecentlyViewSchema); 
