import express from "express";
import {
  getAllGroupChats,
  getGroupChat,
  createGroupChat,
  deleteGroupChat,
  addMemberToGroupChat,
  removeMemberFromGroupChat,
  sendMessage,
  getMessages,
} from "../controllers/groupchat";
import { protect } from "../controllers/auth";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getAllGroupChats)
  .post(createGroupChat);

router.route("/:id")
  .get(getGroupChat)
  .delete(deleteGroupChat);

router.route("/:id/members")
  .post(addMemberToGroupChat);

router.route("/:id/members/:userId")
  .delete(removeMemberFromGroupChat);

router.route("/:id/messages")
  .get(getMessages)
  .post(sendMessage);

export default router;
