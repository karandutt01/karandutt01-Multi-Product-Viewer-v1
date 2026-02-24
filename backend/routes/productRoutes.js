/**
 * Product routes for handling product-related API endpoints.
 * @module productRoutes
 */

const express = require('express');
const router = express.Router();

const { addProduct } = require('../controllers/products/ProductController')
const authMiddleware = require('../middleware/validateTokenHandler')
const { validateAddProduct } = require('../validators/product/productValidator')
const uploadFile = require('../middleware/uploadFile')

/**
 * @route POST /add-product
 * @summary Adds a new product with image upload.
 * @middleware authMiddleware - Validates user authentication token.
 * @middleware uploadFile.single('image') - Handles single image file upload.
 * @bodyparam {string} title - Product title (required)
 * @bodyparam {number|string} price - Product price (required)
 * @bodyparam {string} productDesc - Product description (required)
 * @bodyparam {file} image - Product image file (required, multipart/form-data)
 * @returns {201|400} JSON with success or error message.
 */

router.route('/add-product').post([authMiddleware, validateAddProduct, uploadFile.single('image')],  addProduct)

module.exports = router