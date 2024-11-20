import express from 'express';
import { getAllProducts, createProduct, getProduct, updateProduct, deleteProduct, getUserProducts } from '../controllers/product';
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

router.get('/user/:userId', getUserProducts);


export default router;
