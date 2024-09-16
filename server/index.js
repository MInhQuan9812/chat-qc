const express = require('express');
const cors=require('cors');
require('dotenv').config();
const cookieParser=require('cookie-parser')
const connectDB=require('./config/connectDB')
const router=require('./routes/index')

const app=express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
const PORT=process.env.PORT || 8080;

app.get('/',(resquest,respone) =>{
    respone.json({
        message:"Server is running at "+PORT
    })
})

app.use('/api',router)

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("server is running at "+PORT)
    })
})
