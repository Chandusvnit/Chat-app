// frontend/src/store/useChatStore.js
import { create } from 'zustand';
import API from '../api/axios.js';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [], // Added for Sidebar
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    searchResults: [],
    isSearching: false,

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    // Fetch users for the sidebar
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await API.get('/users');
            set({ users: res.data });
        } catch (error) {
            console.error("Failed to load directory:", error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    // Fetch conversation history between you and selected user
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await API.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    // Send a message via HTTP
    sendMessage: async (messageData) => {
        const { selectedUser, messages, users } = get();
        try {
            const res = await API.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });

            // FIX: If this is a brand new chat, add the user to the sidebar instantly
            const isUserInSidebar = users.some((u) => u._id === selectedUser._id);
            if (!isUserInSidebar) {
                set({ users: [selectedUser, ...users] });
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    },

    // Instantly inject real-time socket messages into UI array stream
    subscribeToMessages: (socket) => {
        if (!socket) return;

        // Clean up old listeners to prevent duplicates
        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            const { selectedUser, messages } = get();
            
            // Only push to live array screen if a chat is open AND matches the sender
            if (selectedUser && newMessage.sender === selectedUser._id) {
                set({ messages: [...messages, newMessage] });
            }
        });
    },

    unsubscribeFromMessages: (socket) => {
        if (socket) socket.off("newMessage");
    },

    // Search users by name/email
    searchUsers: async (query) => {
        if (!query.trim()) {
            set({ searchResults: [] });
            return;
        }
        
        set({ isSearching: true });
        try {
            // FIX: Changed axiosInstance to API to match your imports
            const res = await API.get(`/users/search?query=${query}`);
            set({ searchResults: res.data });
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            set({ isSearching: false });
        }
    },

    clearSearch: () => set({ searchResults: [] }),
}));