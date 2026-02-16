/**
 * @module routes/userRoutes
 * Registers user-related HTTP routes.
*/

const express = require('express');
const router = express.Router();

const { registerUser } = require('../controllers/UserController');
const registerUserRules = require('../validators/userValidator').registerUserRules;
const { validate } = require('../middleware/validate');

/**
 * Express router for user operations.
 * @type {import('express').Router}
 */

/**
 * POST "/register" — Create a new user.
 *
 * Flow:
 * 1) registerUserRules — validates request body fields.
 * 2) validate — returns 400 with details if validation fails.
 * 3) registerUser — creates the user and returns 201 with payload on success.
 *
 * Request body (validated):
 * - firstname: string (1–50)
 * - lastname: string (1–50)
 * - email: string (valid email)
 * - password: string (8–128)
 *
 * Responses:
 * - 201 { message, uid, email } on success (from controller)
 * - 400 { error: "ValidationError", details: [...] } on invalid payload (from middleware)
 * - 500 { error } on server errors (from controller)
 */

router.route('/register').post(registerUserRules, validate, registerUser)

module.exports = router;