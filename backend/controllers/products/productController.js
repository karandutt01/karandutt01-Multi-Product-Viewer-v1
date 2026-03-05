/**
 * productController module for handling product-related operations.
 * @module productController
 */
const { db, bucket } = require('../../config/firebaseAdmin');
const { MESSAGES } = require('../../constants');


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

  let uploadedFile = null;

  try {

    const {title, price, productDesc } = req.body

    if (!req.file) {
      return res.status(400).json({ message: MESSAGES.VALIDATION.NO_FILE_UPLOADED });
    }

    const fileName = `products/images/${req.file.originalname}`;
    const file = bucket.file(fileName);
    uploadedFile = file;

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
      return res.status(201).json({message: MESSAGES.SUCCESS.PRODUCT_ADDED})
    }else{
      return res.status(500).json({ 
        error: MESSAGES.ERROR.PRODUCT_CREATION_FAILED
      });
    }

  } catch (error) {
   if (uploadedFile) {
      await uploadedFile.delete();
    }
    
    return res.status(400).json({ error: error.message });
  }

}

const productList = async(req, res) => {
  try {
    const snapshot = await db.collection('products')
                            .where('user_id', '==', req.user.user_id).get();
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (!products.length) {
      return res.status(200).json({ 
        doc: [],
        message: MESSAGES.SUCCESS.NO_PRODUCTS_FOUND
      })
    } else {
      return res.status(200).json({ doc: products })
    }

  } catch (error) {
    return res.json({error: error.message})
  }
}

const productDetails = async(req, res) => {
  try {

    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ 
        error: 'Product ID is required' 
      });
    }

    const snapshot = await db.collection('products')
                            .doc(productId).get();


    if (!snapshot.exists) {
      return res.status(404).json({ 
        doc: [],
        message: MESSAGES.SUCCESS.NO_PRODUCTS_FOUND || 'Product not found'
      });
    }

    const productData = snapshot.data();
    if (productData.user_id !== req.user.user_id) {
      return res.status(403).json({ 
        error: 'Access denied. Product does not belong to user.' 
      });
    }
    
    const product = {
      id: snapshot.id,
      ...productData
    };
   
    return res.status(200).json(product)

  } catch (error) {
    return res.json({error: error.message})
  }
}

module.exports = {
  addProduct,
  productList,
  productDetails
}