import express from 'express';
import { getUser, updateUser, deleteUser, getAllUsers, createUser } from '../controllers/user';
import { login, register, logout, protect } from '../controllers/auth';

const router = express.Router();

// router.post('/login', authController.login);
// router.post('/signup', authController.signup);

// // Protect all routes after this middleware
// router.use(authController.protect);

// // Only admin have permission to access for the below APIs 
// router.use(authController.restrictTo('admin'));

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

// Protect

router.use(protect);

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

// router
//     .route('/current')
//     .get(getCurrentUser);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

export default router;  