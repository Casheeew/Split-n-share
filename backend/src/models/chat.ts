import mongoose from "mongoose";


const groupChatSchema = new mongoose.Schema(
    {
      groupId: {
        type: String, // Unique identifier for the group
        required: true,
        unique: true,
      },
      user1: {
        type: mongoose.Schema.Types.ObjectId, // ID of the first user
        ref: "User",
        required: true,
      },
      user2: {
        type: mongoose.Schema.Types.ObjectId, // ID of the second user
        ref: "User",
        required: true,
      },
      messages: [
        {
          senderId: {
            type: mongoose.Schema.Types.ObjectId, // ID of the sender
            ref: "User",
            required: true,
          },
          text: {
            type: String, // Message text
            required: true,
          },
          timestamp: {
            type: Date,
            default: Date.now, // Automatically set to the current time
          },
        },
      ],
    },
    { timestamps: true }
  );
  
  