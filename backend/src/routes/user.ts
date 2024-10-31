import express from 'express';
import { getUser, updateUser, deleteUser, getAllUsers, createUser } from '../controllers/user';
import authController from '../controllers/auth';

const router = express.Router();

// router.post('/login', authController.login);
// router.post('/signup', authController.signup);

// // Protect all routes after this middleware
// router.use(authController.protect);

// // Only admin have permission to access for the below APIs 
// router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

export default router;