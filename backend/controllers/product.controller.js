const Product = require('../models/Product');
const mongoose = require('mongoose');

// Helper function
const getDefaultProduct = async () => Product.findOne({ isDefault: true });

// @desc Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, colors, sizes, images, returnsInfo } = req.body;
    if (!name || !price) {
      return res.status(400).json({ 
        success: false,
        error: 'Name and price are required' 
      });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      colors: colors || [],
      sizes: sizes || [],
      images: images || [],
      returnsInfo: returnsInfo || ''
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ 
      success: true, 
      data: savedProduct 
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Get default product
exports.getDefaultProduct = async (req, res) => {
  try {
    const defaultProduct = await getDefaultProduct();
    if (!defaultProduct) {
      return res.status(404).json({ 
        success: false,
        message: 'No default product configured' 
      });
    }

    res.json({ 
      success: true, 
      data: defaultProduct 
    });
  } catch (err) {
    console.error('Error fetching default product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Set product as default
exports.setDefaultProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.updateMany({}, { $set: { isDefault: false } });

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Default product updated successfully', 
      data: updatedProduct 
    });
  } catch (err) {
    console.error('Error setting default product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Get single product (fallback to default)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;
    let isDefaultFallback = false;

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await getDefaultProduct();
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: 'Product not found and no default available' 
        });
      }
      isDefaultFallback = true;
    }

    res.json({ 
      success: true,
      data: product,
      isDefaultFallback 
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, inStock, limit } = req.query;
    const query = {};

    if (category) query.category = category;
    if (inStock === 'true') query.stock = { $gt: 0 };

    const products = await Product.find(query).limit(parseInt(limit) || 0);
    res.json({ 
      success: true, 
      data: products 
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID' 
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({ 
      success: true, 
      data: updatedProduct 
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID' 
      });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Product deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Recommended products
exports.getRecommendedProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const current = await Product.findById(productId);
    if (!current) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // First try to get products from the same category
    let recommended = await Product.find({
      _id: { $ne: productId },
      category: current.category
    })
    .sort({ reviewCount: -1, averageRating: -1 })
    .limit(4);

    // If not enough products in same category, get most rated products
    if (recommended.length < 4) {
      const additionalProducts = await Product.find({
        _id: { $ne: productId },
        category: { $ne: current.category }
      })
      .sort({ reviewCount: -1, averageRating: -1 })
      .limit(4 - recommended.length);
      
      recommended = [...recommended, ...additionalProducts];
    }

    res.json({ 
      success: true, 
      data: recommended 
    });
  } catch (err) {
    console.error('Error getting recommended products:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};