const firebaseAdmin = require('../config/firebaseAdmin');


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