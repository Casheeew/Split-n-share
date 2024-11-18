import express, { NextFunction, Request, Response } from 'express';
import Review from '../models/review';
import User from '../models/user';
import { getAll, getOne, updateOne, deleteOne } from './base';

const router = express.Router();

export const getReview = async (req: Request, res: Response, next: NextFunction) => getOne(Review, req, res, next);
export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => getAll(Review, req, res, next);

export const updateReview = async (req: Request, res: Response, next: NextFunction) => updateOne(Review, req, res, next);

// delete: todo!
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => deleteOne(Review, req, res, next);

export const postReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { author, target, rating, text } = req.body;

        // Validate target user
        const targetUser = await User.findById(target);
        if (!targetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }

        // Create new review
        const newReview = new Review({
            author,
            target,
            rating,
            text,
        });

        await newReview.save();

        // Update given_reviews and received_reviews
        await User.findByIdAndUpdate(author, { $push: { given_reviews: newReview._id } });
        await User.findByIdAndUpdate(target, { $push: { received_reviews: newReview._id } });

        res.status(200).json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
}

export default router;
