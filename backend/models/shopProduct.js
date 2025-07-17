const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const shopProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    id: { type: String, unique: true, required: true },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: [String],
      required: true,
      enum: ["Women", "Ladies", "Men", "Kids"],
    },
    size: {
      type: [String],
      required: true,
      enum: ["Small", "Medium", "Large", "Extra Large"],
    },
    color: {
      type: [String],

      required: true,
    },
    image: {
      type: String,
      default: "/placeholder.svg?height=300&width=300",
    },
    description: {
      type: String,
      default: "Product description",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    popularity: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },

    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ShopProduct", shopProductSchema);
