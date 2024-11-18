import express from 'express';
import { getChat, getAllChats, createChat, updateChat } from '../controllers/chat';
import { protect } from '../controllers/auth';

const router = express.Router();

// // Protect all routes after this middleware
// router.use(authController.protect);

router.use(protect);

router
    .route('/')
    .get(getAllChats)
    .post(createChat);

router
    .route('/:id')
    .get(getChat)
    .patch(updateChat);

export default router;
