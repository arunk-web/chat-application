require('dotenv').config()
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messageRoutes');
const http = require('http');
const {Server} = require('socket.io')
const socketHandler = require('./socket/socketHandler');


const app = express();

app.use(cors({ origin: 'https://chat-application-sable-three.vercel.app' }));
app.use(express.json());

connectDB();

app.use('/api/messages', messageRoutes);

app.get('/', (req,res) =>{
    res.send('backend api running successfully');
})

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://chat-application-sable-three.vercel.app',
    methods: ['GET', 'POST'],
  },
});
socketHandler(io);

const PORT = process.env.PORT || 5000

server.listen(PORT , () => {
    console.log('server running successfully on port', PORT);
})