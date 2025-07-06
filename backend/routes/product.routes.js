const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getRecommendedProducts,
  getDefaultProduct,
  setDefaultProduct
} = require('../controllers/product.controller');

router.route('/')
  .post(createProduct)
  .get(getAllProducts);

router.route('/default')
  .get(getDefaultProduct);

router.route('/set-default/:id')
  .put(setDefaultProduct);

router.route('/recommended/:productId')
  .get(getRecommendedProducts);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;