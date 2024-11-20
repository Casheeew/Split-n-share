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
  createTwoPersonChat
} from "../controllers/groupchat";
import { protect } from "../controllers/auth";

const router = express.Router();

router.use(protect);

router.post('/two', createTwoPersonChat);

router.route("/")
  .get(getAllGroupChats)
  .post(createGroupChat);

router.route("/:id")
  .get(getGroupChat)
  .delete(deleteGroupChat)
  .post(addMemberToGroupChat);


router.route("/:id/members/:userId")
  .delete(removeMemberFromGroupChat);

router.route("/:id/messages")
  .get(getMessages)
  .post(sendMessage);


export default router;
