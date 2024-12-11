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
import searchRoutes from './routes/search';
import { NextFunction, Request, Response } from "express";
import path from 'path';

// import userRoutes from './routes/userRoutes';
// import globalErrHandler from './controllers/errorController';
// import AppError from './utils/appError';

const app = express();

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true, // Use Helmet's default directives for other resources
      directives: {
        // Allow all image sources
        'img-src': ["'self'", 'https:', 'data:', 'blob:', '*'],
      },
    })
  );

app.use(express.static(path.join('../frontend', 'dist')));

// Limit request from the same API 
const limiter = rateLimit({
    max: 10000,
    windowMs: 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '500mb'
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
app.use('/api/reviews', reviewRoutes);
app.use('/api/groupchats', groupChatRoutes);
app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html'));
  });

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
