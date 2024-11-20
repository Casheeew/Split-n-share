import express from 'express';
import { getReview, getReviews, postReview, updateReview, deleteReview, likeReview} from '../controllers/review';
import { protect } from '../controllers/auth';

const router = express.Router();

// // Protect all routes after this middleware
// router.use(authController.protect);

router.use(protect);

router
    .route('/')
    .get(getReviews)
    .post(postReview);

router
    .route('/:id')
    .get(getReview)
    .patch(updateReview)
    .delete(deleteReview);

router.patch('/:id/like', likeReview);


export default router;
