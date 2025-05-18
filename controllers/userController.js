const User = require('../models/userModel');
const { createToken } = require('../utils/jwt');

const registerUser = async (req,res) =>{
    try {
        const {name, email, password, phone} = req.body;
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({
                success : false,
                message : "User already exist"
            })
        }
        const user = await User.create({
            name,
            email,
            phone,
            password,
            role : 'user'
        })
        res.status(201).json({
            success: true,
            token : createToken(user),
            user : {
                _id : user._id,
                name : user.name,
                email : user.email,
                phone : user.phone
            }
        })
    } catch (error) {
        res.status(500).json({
            success : false ,
        })
    }
}


const loginUser = async (req,res) =>{
    try{
    const {email, password} = req.body;
    if(!email || !password){
         res.status(400).json({
            success : false,
            message : "Please provide email or/and password"
         })
    }
    const user = await User.findOne({email});
    if(!user){
        res.status(401).json({
            success : false,
            message : "User not Found"
        })
    }
    if(user.status==='Banned'){
        res.status(403).json({
            success : false,
            message : "Your account banned by Admin"
        })
    }
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        res.status(402).json({
            success : false,
            message : "Invalid Password...!!"
        })
    }
    res.status(201).json({
        success: true,
        token : createToken(user),
        user : {
            _id : user._id,
            name : user.name,
            email : user.email,
            phone : user.phone
        }
    })}
    catch(error){
        res.status(500).json({
            success: false,
            message : "Some Server side problem...!!"
        })
    }
    
}

const updateProfile = async (req,res) => {
    try {
        const {name, email, phone} = req.body;
        const existingUser  = await User.findOne({email,_id : {$ne : req.user._id}});
        if(existingUser){
            res.status(400).json({
                success: false,
                message : "Email already in use...!!"
            })
        }
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {name, email, phone},
            { new : true }
        ).select('-password');
        res.json({
            success: true,
            Message : "Profile updated successfully...!!",
            data : {
              user : {
                _id : user._id,
                name : user.name,
                email : user.email,
                phone : user.phone,
                joinedDate : user.createdAt
            }}
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

const changePassword = async (req,res)=>{
    try {
        const {currentPassword, newPassword} = req.body;
        const user = await User.findById(req.user._id);
        if(!await user.matchPassword(currentPassword)){
            return res.status(400).json({
                success : false,
                message : "current password is incorrect..!!"
            })
        }
        user.password = newPassword ; 
        await user.save();
        res.json({
            success : true,
            message : "Password changed successfully...!!"
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    updateProfile,
    changePassword
}