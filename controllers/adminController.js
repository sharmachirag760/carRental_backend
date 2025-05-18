const Admin = require('../models/adminModel');
const { createToken } = require('../utils/jwt');

const registerAdmin = async (req,res) =>{
    try {
        const {name, email, password, phone} = req.body;
        const adminExist = await Admin.findOne({email});
        if(adminExist){
            return res.status(400).json({
                success : false,
                message : "Admin already exist"
            })
        }
        const admin = await Admin.create({
            name,
            email,
            password
        })
        res.status(201).json({
            success: true,
            token : createToken(admin._id),
            user : {
                _id : admin._id,
                name : admin.name,
                email : admin.email
            }
        })
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
}


const loginAdmin = async (req,res) =>{
    try{
    const {email, password} = req.body;
    if(!email || !password){
         res.status(400).json({
            success : false,
            message : "Please provide email or/and password"
         })
    }
    const admin = await Admin.findOne({email});
    if(!admin){
        res.status(401).json({
            success : false,
            message : "Admin not Found"
        })
    }
    const isMatch = await admin.matchPassword(password);
    if(!isMatch){
        res.status(402).json({
            success : false,
            message : "Invalid Password...!!"
        })
    }
    res.status(201).json({
        success: true,
        token : createToken(admin),
        admin : {
            _id : admin._id,
            name : admin.name,
            email : admin.email,
            phone : admin.phone
        }
    })}
    catch(error){
        res.status(500).json({
            success: false,
            message : "Some Server side problem...!!"
        })
    }
    
}

const getProfile = async (req,res) => {
    try {
        const admin = await User.findById(req.admin._id).select('-password');
        res.json({
            success: true,
            data : {
                name : admin.name,
                email : admin.email,
                phone : admin.phone,
                role : 'admin',
                lastLogin : admin.lastLogin,
                joinedDate : admin.createdAt
            }
        })
    }catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

const updateProfile = async (req,res) => {
    try {
        const {name, email, phone} = req.body;
        // const existingUser  = await User.findOne({email,_id : {$ne : req.user._id}});
        // if(existingUser){
        //     res.status(400).json({
        //         success: false,
        //         message : "Email already in use...!!"
        //     })
        // }
        const admin = await User.findByIdAndUpdate(
            req.admin._id,
            {name, email, phone},
            { new : true }
        ).select('-password');
        res.json({
            success: true,
            Message : "Profile updated successfully...!!",
            data : {
                name : admin.name,
                email : admin.email,
                phone : admin.phone,
                role : 'admin',
                lastLogin : admin.lastLogin,
                joinedDate : admin.createdAt
             }
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
        const admin = await Admin.findById(req.admin._id);
        if(!await admin.matchPassword(currentPassword)){
            return res.status(400).json({
                success : false,
                message : "current password is incorrect..!!"
            })
        }
        admin.password = newPassword ; 
        await admin.save();
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
    registerAdmin,
    loginAdmin,
    getProfile,
    updateProfile,
    changePassword
}