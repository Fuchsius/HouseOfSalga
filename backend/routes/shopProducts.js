const express = require("express");
const router = express.Router();
const ShopProduct = require("../models/shopProduct");
const Counter = require("../models/Counter");

// GET /api/shopProducts - with filters, sorting, and pagination
router.get("/", async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      category,
      size,
      colors,
      sort = "price-desc",
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Category filter (case-insensitive, array contains)
    if (category) {
      filter.category = { $in: [new RegExp(category, "i")] };
    }

    // Size filter (array contains)
    if (size) {
      filter.size = { $in: [new RegExp(size, "i")] };
    }


    if (colors) {
      const colorArray = colors.split(",").map((c) => c.trim());
      filter.color = { $in: colorArray };
    }

    // Sorting
    let sortOption = {};
    switch (sort) {
      case "popular":
        sortOption = { popularity: -1 };
        break;
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { price: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await ShopProduct.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .select(
        "name id price category size color image description inStock popularity createdAt rating numReviews"
      );
    const total = await ShopProduct.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      count: total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// GET /api/shopProducts/all - fetch all without filters
router.get("/all", async (req, res) => {
  try {
    const products = await ShopProduct.find({})
      .sort({ price: -1 }) // Default sort
      .select(
        "name id price category size color image description inStock popularity createdAt rating numReviews"
      );
    const total = await ShopProduct.countDocuments();

    res.json({
      success: true,
      data: products,
      count: total,
      page: 1,
      pages: Math.ceil(total / 10),
    });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// POST /api/shopProducts - add product with auto-increment ID
router.post("/", async (req, res) => {
  try {
    // Generate auto-increment ID
    const counter = await Counter.findOneAndUpdate(
      { id: "product_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const newId = `P${counter.seq.toString().padStart(3, "0")}`;

    // Check for duplicate
    const existing = await ShopProduct.findOne({ id: newId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Product with this id already exists",
        error: "DUPLICATE_ENTRY",
        duplicateField: "id",
        duplicateValue: newId,
      });
    }

    const newProduct = new ShopProduct({
      id: newId,
      ...req.body,
    });

    const saved = await newProduct.save();

    res.status(201).json({ success: true, product: saved });
  } catch (err) {
    console.error("Product Save Error:", err);
    res500.json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

// POST /api/shopProducts/:id/reviews - add review
router.post("/:id/reviews", async (req, res) => {
  try {
    const product = await ShopProduct.findById(req.params.id);
    if (product) {
      const { rating, comment, name, user } = req.body;

      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === user
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: "Product already reviewed" });
      }

      const review = {
        name,
        rating: Number(rating),
        comment,
        user,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.numReviews;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("Review Save Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

module.exports = router;
