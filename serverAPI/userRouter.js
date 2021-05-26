const router = require('express').Router();
const UserSchema = require('./userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');



router.post('/register', async (req, res)=> {
   
    try {
        var userExists = await UserSchema.findOne({email:req.body.email});
        if (userExists) {
            return res.status(400).json("User Already Exists");
        }
        var passhash = await bcrypt.hash(req.body.password, 10);
        const user = UserSchema({
            name : req.body.name,
            email: req.body.email,
            password: passhash
        });

        var userData = await user.save();
        res.json(userData);

    }
    catch(error) {
        console.error("Unable to create new user", error.toString());
        res.status(400).json(error);
    }
    res.json(user);
})

router.post('/login', async (req, res) => {
    try {
        // If find load data, if not exit
        var userExists = await UserSchema.findOne({email:req.body.email});
        if (!userExists) {
            return res.status(400).json("User doesn't Exists");
        }

        // Check for valid password
        var isValidPassword = await bcrypt.compare(req.body.password, userExists.password);
        if (!isValidPassword) {
            return res.status(400).json("Password not valid");
        }

        // Create JWT token using secrect key and send it via response Header
        var userToken = await jwt.sign({email:userExists.email}, process.env.API_SECRET);
        res.header('auth', userToken).send(userToken);
    }
    catch(error) {
        res.status(400).json(error);
    }

})

module.exports = router;

