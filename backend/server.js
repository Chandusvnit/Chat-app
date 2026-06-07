// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Import user routes

import { app, server } from './socket/socket.js';

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes); // Mount user directory layer

app.get('/', (req, res) => {
    res.send('Chat, Socket, Message, and User server fully functional.');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server performance monitored on port ${PORT}`);
});