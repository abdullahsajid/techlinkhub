const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const candidateApi = require('./api/candidateApi')
const resumeApi = require('./api/resumeApi')
const chatApi = require('./api/chatapis')
const {db_connection} = require('./database/db_index')
const cloudinary = require('cloudinary')
const {Server} = require('socket.io')
const {createServer} = require('http')

const server = createServer(app)
const io = new Server(server,{
    pingTimeout:60000,
    cors:{
        origin:'http://localhost:3000',
        methods:['GET','POST'],
        credentials:true
    }
})

const corsOptions = {
    origin:['http://localhost:3000'], 
    credentials:true,        
    optionSuccessStatus:200,
    methods:["GET","POST","PUT","DELETE"]
}

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb', extended:true }))

db_connection()
candidateApi(app)
resumeApi(app)
chatApi(app)

app.use('/',(req,res)=>{
    res.json({message:"listen from candidate sever!"})    
})

io.on('connection',(socket) => {
    console.log('user connected');

    socket.on("setup", (userData) => {
        socket.join(userData.id);
        socket.emit("connected");
    });

    socket.on('join chat',(room) => {
        socket.join(room)
        console.log("user has joined the room :",room);
    })

    socket.on('new message',({sendData,roomId}) => {
        // console.log(sendData);
        // console.log(roomId);
        // const room = getRoomId(data.chatinfo.sender_id, data.chatinfo.your_id);
        io.to(roomId).emit('message recieved',sendData)
    })
    
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
})

function getRoomId(user1, user2) {
    return [user1, user2].sort().join('_'); // Ensure the room id is consistent
}
// console.log("Message: ",data)
        // io.sockets.adapter.rooms.get(data.rid)
        // socket.on('makeroom',(id) => {
    //     socket.join(id)
    //     socket.emit('connected',id)
    // })
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

server.listen(8001, () => {
    console.log("Connection to server is working fine!")
})








