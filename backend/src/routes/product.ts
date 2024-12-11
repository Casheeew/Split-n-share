import express from 'express';
import { getAllProducts, createProduct, getProduct, updateProduct, deleteProduct, getUserProducts, joinProduct, approveJoinProduct, unjoinProduct, declineJoinProduct } from '../controllers/product';
import { protect } from '../controllers/auth';

const router = express.Router();

// // Protect all routes after this middleware
// router.use(authController.protect);

router.use(protect);

router
    .route('/')
    .get(getAllProducts)
    .post(createProduct);

router
    .route('/:id')
    .get(getProduct)
    .patch(updateProduct)
    .delete(deleteProduct);

router
    .route('/:id/join')
    .post(joinProduct);

router
    .route('/:id/unjoin')
    .post(unjoinProduct);

router.route('/:productId/approve/:userId')
    .post(approveJoinProduct);
router.route('/:productId/decline/:userId')
    .post(declineJoinProduct);

router.get('/user/:userId', getUserProducts);


export default router;
