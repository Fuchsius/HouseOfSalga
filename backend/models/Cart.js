const mongoose = require('mongoose');

// Define CartItemSchema first
const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    size: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    priceAtTime: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: true,
    },

});

// Then define CartSchema using CartItemSchema
const CartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    items: [CartItemSchema], // Now CartItemSchema is already defined
    subtotal: {
        type: Number,
        required: true,
        default: 0,
    },
    tax: {
        type: Number,
        required: true,
        default: 250,
    },
    deliveryFee: {
        type: Number,
        required: true,
        default: 150,
    },
    discountAmount: {
        type: Number,
        default: 0,
    },
    discountCode: {
        type: String,
        default: '',
    },
    total: {
        type: Number,
        required: true,
        default: 0,
    },
    currency: {
        type: String,
        default: 'Rs',
    },
}, {
    timestamps: true,
});

// Calculate totals before saving
CartSchema.pre('save', function(next) {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.priceAtTime * item.quantity), 0);
    this.total = this.subtotal + this.tax + this.deliveryFee - this.discountAmount;
    next();
});

module.exports = mongoose.model(
    'Cart', CartSchema);