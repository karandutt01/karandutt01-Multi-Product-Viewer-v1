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

const validateAddProduct = (req, res, next) => {
  const { title, price, productDesc } = req.body;
  const errors = [];

  // Validate required fields
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!price) {
    errors.push('Price is required');
  } else {
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      errors.push('Price must be a positive number');
    }
  }

  if (!productDesc || typeof productDesc !== 'string' || productDesc.trim().length === 0) {
    errors.push('Product description is required');
  }

  // Validate file upload
  if (!req.file) {
    errors.push('Product image is required');
  } else {
    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      errors.push('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (req.file.size > maxSize) {
      errors.push('File size must be less than 5MB');
    }
  }

  // Validate title length
  if (title && title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  // Validate description length
  if (productDesc && productDesc.length > 1000) {
    errors.push('Product description must be less than 1000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

module.exports = {
  validateAddProduct
};
