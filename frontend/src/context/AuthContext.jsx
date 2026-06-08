// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import API from '../api/axios.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Initial Session Check
    useEffect(() => {
        const storedUser = localStorage.getItem('chat-user');
        if (storedUser) {
            setAuthUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // 2. Real-time Socket Lifecycle Management
    useEffect(() => {
        if (authUser) {
            // Establish connection to backend socket server
            const newSocket = io('http://localhost:5000', {
                query: {
                    userId: authUser._id,
                },
            });

            setSocket(newSocket);

            // Listen for the active online users list broadcast from backend
            newSocket.on('getOnlineUsers', (users) => {
                setOnlineUsers(users);
            });

            // Cleanup function: closes connection if user logs out or closes browser tab
            return () => {
                newSocket.close();
            };
        } else {
            // Close any existing socket if authUser becomes null
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    const signup = async (name, email, password) => {
        try {
            const { data } = await API.post('/auth/signup', { name, email, password });
            localStorage.setItem('chat-user', JSON.stringify(data));
            setAuthUser(data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('chat-user', JSON.stringify(data));
            setAuthUser(data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('chat-user');
        setAuthUser(null);
    };

    return (
        <AuthContext.Provider value={{ authUser, socket, onlineUsers, signup, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};