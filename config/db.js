const mongoose = require('mongoose');

const connDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully....!!");
        
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
module.exports = connDB;