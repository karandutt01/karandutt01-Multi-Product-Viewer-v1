const express = require('express');
const router = express.Router();

const { registerUser } = require('../controllers/UserController');
const registerUserRules = require('../validators/userValidator').registerUserRules;
const { validate } = require('../middleware/validate');


router.route('/register').post(registerUserRules, validate, registerUser)

module.exports = router;