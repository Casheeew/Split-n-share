import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import AppError from './utils/appError';
import userRoutes from './routes/user';
import productRoutes from './routes/product';
import reviewRoutes from './routes/review';
import groupChatRoutes from './routes/groupchat';

import { NextFunction, Request, Response } from "express";
import { protect } from './controllers/auth';

// import userRoutes from './routes/userRoutes';
// import globalErrHandler from './controllers/errorController';
// import AppError from './utils/appError';

const app = express();

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API 
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '15mb'
}));

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// deprecated
// // Data sanitization against XSS(clean user input from malicious HTML code)
// app.use(xss());

// // Prevent parameter pollution
// app.use(hpp());


// Routes

// Define more routes here
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/groupchats', groupChatRoutes);

// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err);
});

app.use('*', (err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
});

export default app;