/**
 * @module routes/userRoutes
 * Registers user-related HTTP routes.
*/

const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/UserController');
const {registerUserRules, loginUserRules} = require('../validators/userValidator');
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
/**
 * POST "/login" — Authenticate a user and issue a token on successful login.
 *
 * Flow:
 * 1) loginUserRules — validates login request body fields (typically email & password).
 * 2) validate — returns 400 with error details if validation fails.
 * 3) loginUser — authenticates the credentials; returns token and user info on success.
 *
 * Request body (validated):
 * - email: string (must be a valid email)
 * - password: string (8–128)
 *
 * Responses:
 * - 200 { token, user: { uid, email, firstname, lastname } } on success (from controller)
 * - 400 { error: "ValidationError", details: [...] } on invalid payload (from middleware)
 * - 401 { error: "InvalidCredentials" } on authentication failure (from controller)
 * - 500 { error } on server errors (from controller)
 *
 *
 * @route POST /login
 * @access Public
 */

router.route('/login').post(loginUserRules, validate, loginUser)

module.exports = router;