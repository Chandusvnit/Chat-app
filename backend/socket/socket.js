import { Server } from 'socket.io'; 
import http from 'http';    
import express from 'express';

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// Memory map to track online users: { userId: socketId }
const userSocketMap = {}; 

// Helper function to find a recipient's active socket channel
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Grab the userId sent from the frontend client handshake query
    const userId = socket.handshake.query.userId;
    
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }

    // Emit the list of all currently active online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle Disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        if (userId) {
            delete userSocketMap[userId];
        }
        // Broadcast updated online user list
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };