import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/user";
import AppError from "../utils/appError";

const isPasswordCorrect = async (typedPassword: string, originalPassword: string) => (
    typedPassword === originalPassword
)

const createToken = (id: string) => {
    if (process.env.JWT_SECRET === undefined) { throw new Error('no JWT_SECRET in environment') }
    return jwt.sign(
        {
            id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        },
    );
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // 1) check if email and password exist
        if (!email || !password) {
            return next(new AppError(404, "fail", "Please provide email or password"));
        }

        // 2) check if user exist and password is correct
        const user = await User.findOne({
            email: email,
        }).select("+password");

        if (!user || !(await isPasswordCorrect(password, user.password))) {
            return next(new AppError(401, "fail", "Email or Password is wrong"));
        }

        // 3) All correct, send jwt to client
        const token = createToken(user.id);

        // Remove the password from the output
        const userData: any = user;
        userData.password = undefined;

        res.status(200).json({
            data: {
                status: "success",
                user: userData,
                token,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.create({
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password,
        });

        const token = createToken(user.id);

        const userData: any = user;
        userData.password = undefined;

        res.status(201).json({
            data: {
                status: "success",
                user: userData,
                token,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    // todo! blacklist token

    res.status(201).json({
        data: {
            status: "success",
        },
    });
}


export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1) check if the token is there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next(new AppError(401, "fail", "You are not logged in! Please login in to continue"));
        }

        // 2) Verify token
        if (process.env.JWT_SECRET === undefined) { throw new Error('no JWT_SECRET in environment') }
        // const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) check if the user is exist (not deleted)
        if (typeof decoded === 'string') { return next(new AppError(401, "fail", "Invalid JWT")) };

        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new AppError(401, "fail", "This user is no longer exist"));
        }

        res.locals.user = user;

        next();
    } catch (err) {
        next(err);
    }
};

// // Authorization check if the user have rights to do this action
// export const restrictTo = (...roles: any[]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!roles.includes(req.user.role)) {
//             return next(new AppError(403, "fail", "You are not allowed to do this action"));
//         }
//         next();
//     };
// };