// frontend/src/api/axios.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Points directly to your Express server
});

// Request interceptor to automatically attach JWT tokens
API.interceptors.request.use((config) => {
    const userJson = localStorage.getItem('chat-user');
    if (userJson) {
        const { token } = JSON.parse(userJson);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;