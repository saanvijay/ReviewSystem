const jwt = require('jsonwebtoken');

// Validate User (Check jwt token)
const validateUser = (req, res, next) => {
    var token = req.header('auth');
    req.token = token;
    next();
}

// jwt verify the token with secret key
var jwtVerify = (req, res) => {
    jwt.verify(req.token, process.env.API_SECRET, async(err, data) => {
        if (err) {
            return res.sendStatus(403);
        }
    });
}

exports.ValidateUser = validateUser;
exports.JwtVerify = jwtVerify;