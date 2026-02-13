const { validationResult } = require('express-validator');

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