const User = require('../models/userModel');
const {verifyToken} = require('../utils/jwt');

exports.protect = async (req,res,next) => {
     const authHeader = req.headers.authorization;
     if(!authHeader){
        return res.status(401).json({message : "Authorization is missing..!!"});
     }
     if(!authHeader.startsWith('Bearer ')){
        return res.status(401).json({message : "Token must be Bearer token"});
     }
     const token = authHeader.split(' ')[1];
     if(!token){
        return res.status(401).json({message : "Token not provided..!!"});
     }
     const decoded = verifyToken(token);
     if(!decoded){
        return res.status(401).json({message : "Invalid or expired token..!!"});
     }
     console.log(decoded);
     const user = await User.findById(decoded.user);
     console.log(user);
     if(!user){
        return res.status(401).json({message : "User not found"});
     }
     req.user = user;
     next();
}