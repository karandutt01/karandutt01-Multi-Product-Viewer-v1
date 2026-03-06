/**
 * @module middleware/validate
 * Normalizes express-validator results and short-circuits with HTTP 400 on errors.
*/

const { validationResult } = require('express-validator');

/**
 * Express middleware that checks validation results and either:
 * - calls next() when there are no validation errors, or
 * - responds with 400 and a structured error body when validation fails.
 *
 * Error response shape:
 * {
 *   error: "ValidationError",
 *   details: [{ field: string, message: string }]
 * }
 *
 * @param {import('express').Request} req - Incoming request.
 * @param {import('express').Response} res - Outgoing response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void} Sends a response on validation error; otherwise delegates via next().
 */

function validate(req,res,next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = result.array().map(err => ({
    field: err.path,
    message: err.msg,
  }));

  return res.status(400).json({
    error: 'ValidationError',
    details,
  });
}

module.exports = {
  validate
}