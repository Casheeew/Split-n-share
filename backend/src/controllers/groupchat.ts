import express, { NextFunction, Request, Response } from "express";
import GroupChat from "../models/groupchat";
import Product from "../models/product";
import User from "../models/user"; // Ensure User model is imported
import { getAll, getOne, deleteOne } from "./base";

const router = express.Router();

export const getAllGroupChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user._id; // Current user's ID from authentication middleware

        // Find group chats where the user is a participant (either host or member)
        const groupChats = await GroupChat.find({
            members: { $in: [userId] }, // Check if the user is in the members array
        })
        .sort({ 'messages.timestamp': -1 }) // Sort by the latest message timestamp
        .populate({
            path: 'members',
            select: 'first_name last_name profile_picture', // Optional: Populate member details
        })
        .populate('productId')
        .populate({
            path: 'messages.senderId',
            select: 'first_name last_name profile_picture', // Optional: Populate sender details for latest message
        });
        
        res.status(200).json({
            status: 'success',
            results: groupChats.length,
            data: groupChats,
        });
    } catch (error) {
        next(error);
    }
};


export const getGroupChat = async (req: Request, res: Response, next: NextFunction) =>
    getOne(GroupChat, req, res, next);

export const createGroupChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }


        const groupChat = await GroupChat.create({
            productId: product._id,
            host: product.creator,
            members: [product.creator],
        });

        res.status(201).json({
            status: "success",
            data: groupChat,
        });
    } catch (error) {
        next(error);
    }
};

export const createTwoPersonChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const creatorId = res.locals.user._id; // Extract the creator's user ID
        const { targetId } = req.body; // Extract the target user's ID from the request body

        // Validate IDs
        if (!creatorId || !targetId) {
            return res.status(400).json({
                status: "fail",
                message: "Both creatorId and targetId are required",
            });
        }

        // Check if the target user exists
        const targetUser = await User.findById(targetId);
        if (!targetUser) {
            return res.status(404).json({
                status: "fail",
                message: "Target user not found",
            });
        }

        // Check if a chat already exists between the two users
        const existingChat = await GroupChat.findOne({
            members: { $all: [creatorId, targetId] }, // Ensure both users are in the same chat
        });

        if (existingChat) {
            return res.status(200).json({
                status: "success",
                message: "Chat already exists",
                data: existingChat,
            });
        }

        // Create a new chat between the two users
        const newChat = await GroupChat.create({
            members: [creatorId, targetId],
            messages: [],
        });

        res.status(201).json({
            status: "success",
            data: newChat,
        });
    } catch (error) {
        next(error);
    }
};


export const deleteGroupChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user._id; // Extracted from authenticated user
        const chatId = req.params.id;

        const groupChat = await GroupChat.findById(chatId);
        if (!groupChat) {
            return res.status(404).json({ error: "Group chat not found" });
        }
        console.log(groupChat.host);
        console.log(userId);

        // Only the host can delete the group chat
        if (groupChat.host.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You do not have permission to delete this group chat" });
        }

        await groupChat.deleteOne();
        res.status(200).json({ message: "Group chat deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const addMemberToGroupChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body; // ID of the user to add
        const chatId = req.params.id;

        const groupChat = await GroupChat.findById(chatId);
        if (!groupChat) {
            return res.status(404).json({ error: "Group chat not found" });
        }

        const product = await Product.findById(groupChat.productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check if the user is a valid co-buyer
        if (!product.cobuyers.some((cobuyer) => cobuyer.toString() === userId)) {
            return res.status(403).json({ error: "User is not a co-buyer of the product" });
        }

        // Add the user as a member if not already present
        if (!groupChat.members.some((member) => member.toString() === userId)) {
            groupChat.members.push(userId);
            await groupChat.save();
        }

        res.status(200).json({ message: "Member added successfully" });
    } catch (error) {
        next(error);
    }
};

export const removeMemberFromGroupChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId; // Get userId from URL params
        const chatId = req.params.id;

        const groupChat = await GroupChat.findById(chatId);
        if (!groupChat) {
            return res.status(404).json({ error: "Group chat not found" });
        }

        // Remove the user from the members list
        groupChat.members = groupChat.members.filter(
            (member) => member.toString() !== userId
        );

        await groupChat.save();
        res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
        next(error);
    }
};



export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chatId = req.params.id;
        const userId = res.locals.user; // Authenticated user's ID
        const { text } = req.body;

        const groupChat = await GroupChat.findById(chatId);
        if (!groupChat) {
            return res.status(404).json({ error: "Group chat not found" });
        }

        // Check if the user is a member of the group chat
        //   if (!groupChat.members.some((member) => member.toString() === userId.toString())) {
        //     return res.status(403).json({ error: "You are not a member of this group chat" });
        //   }
        //   console.log(groupChat.members);
        //   console.log(userId);
        // Add the message to the group's messages
        groupChat.messages.push({
            senderId: userId,
            text,
            timestamp: new Date(),
        });

        await groupChat.save();

        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chatId = req.params.id;
        const userId = res.locals.user; // Authenticated user's ID

        const groupChat = await GroupChat.findById(chatId).populate({
            path: "messages.senderId",
            select: "first_name last_name",
        });

        if (!groupChat) {
            return res.status(404).json({ error: "Group chat not found" });
        }

        //   // Check if the user is a member of the group chat
        //   if (!groupChat.members.some((member) => member.toString() === userId.toString())) {
        //     return res.status(403).json({ error: "You are not a member of this group chat" });
        //   }

        res.status(200).json({ messages: groupChat.messages });
    } catch (error) {
        next(error);
    }
};


export default router;
