import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { getAll, getOne, updateOne, deleteOne, createOne } from './base';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => getAll(User, req, res, next);
export const getUser = async (req: Request, res: Response, next: NextFunction) => getOne(User, req, res, next);

// Don't update password on this 
export const updateUser = async (req: Request, res: Response, next: NextFunction) => updateOne(User, req, res, next);
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => deleteOne(User, req, res, next);
export const createUser = async (req: Request, res: Response, next: NextFunction) => createOne(User, req, res, next);
