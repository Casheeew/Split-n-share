import express, { NextFunction, Request, Response } from 'express';
import Review from '../models/review';
import User from '../models/user';
import { getOne, updateOne, deleteOne } from './base';
import APIFeatures from '../utils/APIFeatures';

const router = express.Router();

export const getReview = async (req: Request, res: Response, next: NextFunction) => getOne(Review, req, res, next);

export const updateReview = async (req: Request, res: Response, next: NextFunction) => updateOne(Review, req, res, next);

// delete: todo!
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => deleteOne(Review, req, res, next);

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { author, target } = req.query;

        const findQuery: any = {};
        if (author !== undefined) {
            findQuery.author = author;
        }
        if (target !== undefined) {
            findQuery.target = target;
        }

        const features = new APIFeatures(Review.find(findQuery), req.query)
            .sort()
            .paginate();

        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                status: 'success',
                results: doc.length,
                data: doc,
            }
        });
    } catch (error) {
        next(error);
    }
}

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

        const savedReview = await newReview.save(); // Save and get the full document

        // Update given_reviews and received_reviews
        await User.findByIdAndUpdate(author, { $push: { given_reviews: savedReview._id } });
        await User.findByIdAndUpdate(target, { $push: { received_reviews: savedReview._id } });

        res.status(201).json({
            status: 'success',
            data: savedReview, // Return the full review, including the ID
        });
    } catch (err) {
        next(err);
    }
};

export default router;
