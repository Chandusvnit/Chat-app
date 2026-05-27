import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; 
import authRoutes from '../routes/authRoutes.js'// Note: explicitly include .js extension


dotenv.config();

const app = express();
const server = http.createServer(app);


connectDB();


app.use(cors());
app.use(express.json());
//Api routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Chat server is running smoothly.');
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server performance monitored on port ${PORT}`);
});