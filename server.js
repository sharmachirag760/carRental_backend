const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
dotenv.config();
connectDB();
app.use(cors({
    origin : ['*'],
    methods : ['PUT','DELETE','POST','PATCH','GET'],
    credentials : true
}))
app.use(express.json()); 
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
// app.use('/',()=>{
//     console.log("hi");
// });
app.use('/api/users',userRoutes);
app.use('/api/admin',adminRoutes);
const PORT = process.env.PORT;
app.listen(PORT,()=> console.log(`Server is listening to ${PORT}`));