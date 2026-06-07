// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

// Import the wrapper objects from our socket architecture
import { app, server } from './socket/socket.js';

dotenv.config();

// Connect to Database
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Chat and Socket server is running smoothly.');
});

const PORT = process.env.PORT || 5000;

// CRITICAL: We listen on the HTTP 'server' instance, NOT the express 'app'
server.listen(PORT, () => {
    console.log(`Server performance monitored on port ${PORT}`);
});