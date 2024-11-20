import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for Message Subdocument
export interface IMessage {
  senderId: Types.ObjectId;
  text: string;
  timestamp: Date;
}

// Interface for GroupChat
export interface IGroupChat extends Document {
  productId?: Types.ObjectId; // Associated product ID
  host: Types.ObjectId; // Host (creator) of the group chat
  members: Types.ObjectId[]; // Array of member IDs
  messages: IMessage[];
}

const messageSchema = new Schema<IMessage>({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const groupChatSchema: Schema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [messageSchema],
  },
  { timestamps: true }
);

const GroupChat = mongoose.model<IGroupChat>("GroupChat", groupChatSchema);
export default GroupChat;
