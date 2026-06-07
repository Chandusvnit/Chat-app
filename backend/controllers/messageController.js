import Message from "../models/Message.js";
import { getReceiverSocketId, io } from '../socket/socket.js';

// @desc    Send a 1-to-1 message
// @route   POST /api/messages/send/:id
export const sendMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const { id: receiverId } = req.params; // The ID of the person receiving the message
        const senderId = req.user._id;         // Derived securely from the 'protect' middleware

        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Message content cannot be empty" });
        }

        // Create and save message payload in MongoDB
        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content: content
        });

        await newMessage.save();

        // Check if the receiver is currently online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // io.to(<socketId>).emit() targets ONLY that specific active connection pipeline
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get message history between two users
// @route   GET /api/messages/:id
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        // Query messages where (I am sender AND they are receiver) OR (They are sender AND I am receiver)
        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userToChatId },
                { sender: userToChatId, receiver: myId }
            ]
        }).sort({ createdAt: 1 }); // Sort chronologically (oldest to newest)

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};