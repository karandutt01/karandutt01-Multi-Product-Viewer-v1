/**
 * ProductController module for handling product-related operations.
 * @module ProductController
 */
const { db, bucket } = require('../../config/firebaseAdmin');


/**
 * Adds a new product to the database and uploads its image to cloud storage.
 *
 * @async
 * @function addProduct
 * @param {import('express').Request} req - Express request object, expects:
 *   - req.body.title {string}: Product title (required)
 *   - req.body.price {number|string}: Product price (required)
 *   - req.body.productDesc {string}: Product description (required)
 *   - req.file {object}: Uploaded file object (required)
 *   - req.user.user_id {string}: Authenticated user's ID
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends a JSON response with status and message.
 *
 * @throws {Error} Returns HTTP 400 with error message on failure.
 *
 */

const addProduct = async(req, res) => {

  try {

    const {title, price, productDesc } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = `products/images/${req.file.originalname}`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    const [imageUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2030',
    });

    const addProduct = await db.collection('products').add({
      title,
      price,
      productDesc,
      imageUrl,
      user_id:req.user.user_id
    });

    if(addProduct){
      return res.status(201).json({message:"Product Added Successfullly"})
    }

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

}

module.exports = {
  addProduct,
}