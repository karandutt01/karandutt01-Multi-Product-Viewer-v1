/**
 * @module controllers/UserController
 * Handlers for user-related operations.
 */

const firebaseAdmin = require('../../config/firebaseAdmin');
const firebaseConfig = require('../../config/firebaseConfig');
const { HTTP_STATUS, MESSAGES, FIREBASE } = require('../../constants');


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
            return res.status(HTTP_STATUS.CREATED).json({ 
                message: MESSAGES.SUCCESS.USER_REGISTERED,
                uid: user.uid, 
                email:user.email 
            })
        }else{
            throw new Error(MESSAGES.ERROR.USER_DATA_INVALID)
        }
       
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

/**
 * Authenticates a user using Firebase Authentication REST API and returns a login payload.
 *
 * Behavior:
 * - On success, responds with HTTP 200 and JSON: { message, token, uid, expiresIn }.
 * - On failure, responds with HTTP 401 and JSON: { error } containing a safe error message.
 *
 * @param {import('express').Request & { body: { email: string, password: string } }} req - Express request; must contain email and password.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<import('express').Response>} The response sent to the client.
 */

const loginUser = async(req, res) => {
    try {
        
        const { email, password } = req.body;
         const response = await fetch(`${FIREBASE.API_ENDPOINTS.SIGN_IN_WITH_PASSWORD}?key=${firebaseConfig.apiKey}`, {
            method: "POST",
            body: JSON.stringify({ 
                email,
                password,
                returnSecureToken: FIREBASE.RETURN_SECURE_TOKEN
            }),
        });

        console.log('Response', response)
        const data = await response.json();
        
        if(response.status === HTTP_STATUS.OK){
            return res.json({
                message: MESSAGES.SUCCESS.LOGIN_SUCCESSFUL,
                token: data.idToken,
                uid: data.localId,
                expiresIn: FIREBASE.TOKEN_EXPIRY_SECONDS
            });
        }else{
            throw new Error(data.error?.message || MESSAGES.ERROR.LOGIN_FAILED);
        }    

    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({error: error.message || MESSAGES.ERROR.INVALID_CREDENTIALS});
    }
   
}


module.exports = {
    registerUser,
    loginUser,
}