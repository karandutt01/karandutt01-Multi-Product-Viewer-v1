/**
 * @module controllers/UserController
 * Handlers for user-related operations.
 */

const firebaseAdmin = require('../config/firebaseAdmin');

/**
 * Shape of the expected request body for user registration.
 * @typedef {Object} RegisterUserBody
 * @property {string} firstname - User's first name.
 * @property {string} lastname  - User's last name.
 * @property {string} email     - User's email address.
 * @property {string} password  - User's password.
 */

/**
 * Registers a new user in Firebase Authentication and returns a success payload.
 *
 * Behavior:
 * - On success, responds with HTTP 201 and JSON: { message, uid, email }.
 * - On failure, responds with HTTP 500 and JSON: { error } containing a safe error message.
 *
 * @param {import('express').Request & { body: RegisterUserBody }} req - Express request; must contain firstname, lastname, email, password.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<import('express').Response>} The response sent to the client.
 */

const registerUser = async(req,res) => {
    try {
        const {firstname, lastname, email, password} = req.body;
        const user = await firebaseAdmin.admin.auth().createUser({
            email,
            password,
            displayName:`${firstname} ${lastname}`
        })

        if(user){
            return res.status(201).json({ 
                message: "User Registered Successfully",
                uid: user.uid, 
                email:user.email 
            })
        }else{
            throw new Error("User data is not valid")
        }
       
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    registerUser,
}