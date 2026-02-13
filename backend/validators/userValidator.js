const { body } = require('express-validator');

const registerUserRules = [

    body('firstname')
    .exists({ checkNull: true, checkFalsy: true }).withMessage('First name is required')
    .isLength({ min: 1, max: 50 }).withMessage('First name must be 1-50 characters')
    .trim(),

    body('lastname')
    .exists({ checkNull: true, checkFalsy: true }).withMessage('last name is required')
    .isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters')
    .trim(),

    body('email')
    .exists({ checkNull: true, checkFalsy: true }).withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),

    body('password')
    .exists({ checkNull: true, checkFalsy: true }).withMessage('Password is required')
    .bail()
    .isString().withMessage('Password must be a string')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be 8-128 characters')
];

module.exports ={
  registerUserRules
}