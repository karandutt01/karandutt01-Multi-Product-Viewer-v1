/**
 * Product validation middleware for validating product-related requests.
 * @module productValidator
 */

/**
 * Validates the request data for adding a new product.
 * 
 * @function validateAddProduct
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void} Calls next() if validation passes, otherwise sends 400 error
 */

const { MESSAGES } = require('../../constants/messages')

const validateAddProduct = (req, res, next) => {
  const { title, price, productDesc } = req.body;
  const errors = [];

  // Validate required fields
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push(MESSAGES.VALIDATION.TITLE_REQUIRED);
  }

  if (!price) {
    errors.push(MESSAGES.VALIDATION.PRICE_REQUIRED);
  } else {
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      errors.push(MESSAGES.VALIDATION.PRICE_POSITIVE);
    }
  }

  if (!productDesc || typeof productDesc !== 'string' || productDesc.trim().length === 0) {
    errors.push(MESSAGES.VALIDATION.PRODUCT_DESC_REQUIRED);
  }

  // Validate file upload
  if (!req.file) {
    errors.push(MESSAGES.VALIDATION.PRODUCT_IMAGE_REQUIRED);
  } else {
    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      errors.push(MESSAGES.VALIDATION.INVALID_FILE_TYPE);
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (req.file.size > maxSize) {
      errors.push(MESSAGES.VALIDATION.FILE_SIZE_LIMIT);
    }
  }

  // Validate title length
  if (title && title.length > 100) {
    errors.push(MESSAGES.VALIDATION.TITLE_MAX_LENGTH);
  }

  // Validate description length
  if (productDesc && productDesc.length > 1000) {
    errors.push(MESSAGES.VALIDATION.PRODUCT_DESC_MAX_LENGTH);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: MESSAGES.VALIDATION.VALIDATION_FAILED,
      errors: errors
    });
  }

  next();
};

module.exports = {
  validateAddProduct
};
