/**
 * @module validators/userValidator
 * Express-validator chains for user-related request payloads.
 */

const { body } = require('express-validator');
const { MESSAGES } = require('../constants');

/**
 * Validation rules for POST "/register" payload.
 *
 * Fields:
 * - firstname: required, 1–50 chars, trimmed.
 * - lastname: required, 1–50 chars, trimmed.
 * - email: required, valid email format, normalized.
 * - password: required string, 8–128 chars.
 *
 * Example (Express):
 *   router.post('/register', registerUserRules, validate, controller.registerUser)
 *
 * @type {import('express-validator').ValidationChain[]}
 */

const registerUserRules = [

    body('firstname')
    .exists({ checkNull: true, checkFalsy: true }).withMessage(MESSAGES.VALIDATION.FIRST_NAME_REQUIRED)
    .isLength({ min: 1, max: 50 }).withMessage(MESSAGES.VALIDATION.FIRST_NAME_LENGTH)
    .trim(),

    body('lastname')
    .exists({ checkNull: true, checkFalsy: true }).withMessage(MESSAGES.VALIDATION.LAST_NAME_REQUIRED)
    .isLength({ min: 1, max: 50 }).withMessage(MESSAGES.VALIDATION.LAST_NAME_LENGTH)
    .trim(),

    body('email')
    .exists({ checkNull: true, checkFalsy: true }).withMessage(MESSAGES.VALIDATION.EMAIL_REQUIRED)
    .isEmail().withMessage(MESSAGES.VALIDATION.EMAIL_INVALID)
    .normalizeEmail(),

    body('password')
    .exists({ checkNull: true, checkFalsy: true }).withMessage(MESSAGES.VALIDATION.PASSWORD_REQUIRED)
    .bail()
    .isString().withMessage(MESSAGES.VALIDATION.PASSWORD_STRING)
    .isLength({ min: 8, max: 128 }).withMessage(MESSAGES.VALIDATION.PASSWORD_LENGTH)
];


/**
 * Validation rules for POST "/login" payload.
 *
 * Fields:
 * - email: required, valid email format, normalized.
 * - password: required string, 8–128 chars.
 *
 * @type {import('express-validator').ValidationChain[]}
 */

const loginUserRules = [
  body('email')
    .exists({ checkNull: true, checkFalsy: true }).withMessage(MESSAGES.VALIDATION.EMAIL_REQUIRED)
    .isEmail().withMessage(MESSAGES.VALIDATION.EMAIL_INVALID)
    .normalizeEmail(),

  body('password')
    .exists({ checkNull: true, checkFalsy: true }).withMessage(MESSAGES.VALIDATION.PASSWORD_REQUIRED)
    .isString().withMessage(MESSAGES.VALIDATION.PASSWORD_STRING)
    .isLength({ min: 8, max: 128 }).withMessage(MESSAGES.VALIDATION.PASSWORD_LENGTH),
];


module.exports ={
  registerUserRules,
  loginUserRules
}