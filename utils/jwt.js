const jwt = require('jsonwebtoken');

exports.createToken = (user)=> {
    return jwt.sign(
        {user:user._id},
        process.env.JWT_SECRET, 
        {expiresIn : '30d'}
    )
}
exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}