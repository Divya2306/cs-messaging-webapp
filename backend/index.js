const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const messageRoutes = require('./routes/messageRoutes');
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO

mongoose.connect('mongodb+srv://himanshuharsh:jiit0207@cluster0.m8ubevh.mongodb.net/messaging_app?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('Database connected'))
.catch(err => console.error(err));


app.use(express.json());
app.use(cors());
app.use('/api/messages', messageRoutes(io));


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
