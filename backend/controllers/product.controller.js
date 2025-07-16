const Product = require('../models/Product');
const mongoose = require('mongoose');

// Helper function
const getDefaultProduct = async () => Product.findOne({ isDefault: true });

// @desc Create new product
exports.createProduct = async (req, res) => {
  try {
    const { 
      name, 
      id, 
      description, 
      price, 
      category, 
      size, 
      color, 
      image,
      images, // Add support for images array
      inStock, 
      sort 
    } = req.body;

    // Validate required fields
    if (!name || !price || !id) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, price, and id are required' 
      });
    }

    // Check if product with this id already exists
    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({ 
        success: false,
        error: 'Product with this ID already exists' 
      });
    }

    // Handle images - prioritize images array, fallback to single image
    let productImages = [];
    if (images && Array.isArray(images) && images.length > 0) {
      productImages = images.filter(img => img && img.trim() !== '');
    } else if (image && image.trim() !== '') {
      productImages = [image];
    }

    const newProduct = new Product({
      name,
      id,
      description: description || 'Product description',
      price,
      category: category || [],
      size: size || [],
      color: color || [],
      image: productImages.length > 0 ? productImages[0] : null, // Set first image as main image
      images: productImages, // Set images array
      inStock: inStock !== undefined ? inStock : true,
      sort: sort || []
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ 
      success: true, 
      data: savedProduct 
    });
  } catch (err) {
    console.error('Error creating product:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        success: false,
        error: 'Validation Error',
        details: errors
      });
    }
    
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
// @desc Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, inStock, limit, minPrice, maxPrice, size, color } = req.query;
    const query = {};

    if (category) {
      const categories = category.split(',');
      query.category = { $in: categories };
    }

    if (size) {
      const sizes = size.split(',');
      query.size = { $in: sizes };
    }

    if (color) {
      const colors = color.split(',');
      query.color = { $in: colors };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') query.inStock = true;

    const products = await Product.find(query).limit(parseInt(limit) || 0);

    res.json({ 
      success: true, 
      data: products,
      count: products.length,
      pagination: {
        totalProducts: products.length,
      }
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Get new arrivals with pagination
exports.getNewArrivals = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments({});
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    const hasMore = page < totalPages;

    res.json({ 
      success: true, 
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasMore
      }
    });
  } catch (err) {
    console.error('Error fetching new arrivals:', err);
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

    // Handle image updates
    const updateData = { ...req.body };
    
    if (updateData.images && Array.isArray(updateData.images)) {
      // Filter out empty images
      updateData.images = updateData.images.filter(img => img && img.trim() !== '');
      // Set first image as main image if exists
      if (updateData.images.length > 0) {
        updateData.image = updateData.images[0];
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updateData, 
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
      category: { $in: current.category }
    })
    .sort({ numReviews: -1, rating: -1 })
    .limit(4);

    // If not enough products in same category, get most rated products
    if (recommended.length < 4) {
      const additionalProducts = await Product.find({
        _id: { $ne: productId },
        category: { $nin: current.category }
      })
      .sort({ numReviews: -1, rating: -1 })
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
