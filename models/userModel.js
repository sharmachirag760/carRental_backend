const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please provide the name"]
    },
    email : {
        type : String,
        required : [true, "Please provide the email"]
    },
    password : {
        type : String,
        required : [true, "Please provide the password"],
        minlength : 6,
    },
    phone : {
        type : Number,
        required : [true, "Please provide the phone"]
    },
    status : {
        type : String,
        enum : ['Active','Banned'],
        default : 'Active'
    },
    role : {
        type : String,
        required : [true, "Please provide the role"]
    }
},{
    timestamps : true
})


userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
module.exports = mongoose.model('User',userSchema);