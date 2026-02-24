/**
 * Middleware for validating Firebase authentication tokens in incoming requests.
 * @module validateTokenHandler
 */
const firebaseAdmin = require('../config/firebaseAdmin')

/**
 * Express middleware to validate Firebase ID tokens from the Authorization header.
 *
 * @async
 * @function validateToken
 * @param {import('express').Request} req - Express request object. Expects:
 *   - req.headers.authorization or req.headers.Authorization: Bearer token string.
 *   - On success, attaches decoded token as req.user.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Sends 401 if token is missing/invalid, otherwise calls next().
 *
 * @throws {Error} Returns HTTP 401 with error message if token is missing, invalid, or expired.
 *
 * @example
 * // Usage in Express route
 * app.use(validateToken);
 */

const validateToken = async(req,res,next) => {

  try {
    
    const bearerToken = req.headers.Authorization || req.headers.authorization;
    if (!bearerToken) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = bearerToken.split(' ')[1];
    const decodedToken = await firebaseAdmin.admin.auth().verifyIdToken(token);

    if (!decodedToken) {
      // If verifyIdToken resolves to null/undefined, treat as invalid/expired
      return res.status(401).json({ message: "Invalid or expired token" });
    } else {
      req.user = decodedToken;
      return next();
    }
  } catch (error) {
    // If verifyIdToken throws, treat as "User is not authorized"
    return res.status(401).json({ message: "User is not authorized" });
  }
  
}

module.exports = validateToken