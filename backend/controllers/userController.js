// backend/controllers/userController.js
import User from '../models/User.js';
import Message from '../models/Message.js';

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await Message.aggregate([
            // 1. Find only messages where the logged-in user is a participant
            {
                $match: {
                    $or: [{ sender: loggedInUserId }, { receiver: loggedInUserId }]
                }
            },
            // 2. Sort messages newest first to capture the latest interaction time
            { $sort: { createdAt: -1 } },
            // 3. Group by the chat partner's ID to filter down to unique conversations
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", loggedInUserId] },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    lastMessageAt: { $first: "$createdAt" } // Grabs the timestamp of the latest message
                }
            },
            // 4. Perform a left outer join with the 'users' collection to pull profile details
            {
                $lookup: {
                    from: "users", // Mongoose automatically names the collection lowercase plural
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            // 5. Flatten the joined user details array into an object
            { $unwind: "$userDetails" },
            // 6. Sort the final sidebar list by the most recent message time (WhatsApp style)
            { $sort: { lastMessageAt: -1 } },
            // 7. Project the final shape of the object, completely excluding the password hash
            {
                $project: {
                    _id: "$userDetails._id",
                    name: "$userDetails.name",
                    email: "$userDetails.email",
                    profilePic: "$userDetails.profilePic",
                    isOnline: "$userDetails.isOnline",
                    updatedAt: "$userDetails.updatedAt"
                }
            }
        ]);

        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// backend/controllers/userController.js (Add this new function)

// @desc    Search users by name or email
// @route   GET /api/users/search?q=keyword
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user._id;

    if (!query) {
      return res.status(200).json([]);
    }

    // Find matches by name or email, excluding the logged-in user
    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in searchUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};