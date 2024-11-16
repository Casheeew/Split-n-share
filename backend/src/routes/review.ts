import express from 'express';
import { getReview, getAllReviews, postReview, updateReview } from '../controllers/review';
import { protect } from '../controllers/auth';

const router = express.Router();

// // Protect all routes after this middleware
// router.use(authController.protect);

router.use(protect);

router
    .route('/')
    .get(getAllReviews)
    .post(postReview);

router
    .route('/:id')
    .get(getReview)
    .patch(updateReview);

export default router;
