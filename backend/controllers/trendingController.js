const TrendingProduct = require('../models/trendingModel');

// GET all trending products
exports.getAllTrendingProducts = async (req, res) => {
  try {
    const products = await TrendingProduct.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create a new trending product
exports.createTrendingProduct = async (req, res) => {
  try {
    const newProduct = new TrendingProduct(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
