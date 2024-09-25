const express=require('express')
const http=require('http')
const {Server}=require('socket.io')
const getUserDetailFromToken = require('../helpers/getUserDetailFromToken')

const app=express()
const server=http.createServer(app)
const io=new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials :true
    },
})


const onlineUser=new Set()

io.on('connection',async (socket) => {
    console.log('New WebSocket connection:', socket.id);
    // console.log(socket)
    const token=socket.handshake.auth.token

    const user=await getUserDetailFromToken(token)
    console.log(user)
    socket.join(user?._id)
    onlineUser.add(user?._id)

    io.emit('onlineUser',Array.from(onlineUser))
    // console.log(socket)
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


module.exports={app,server}