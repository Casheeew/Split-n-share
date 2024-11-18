import { NextFunction, Request, Response } from 'express';
import Chat from '../models/chat';
import { getAll, getOne, updateOne, deleteOne, createOne } from './base';

export const getAllChats = async (req: Request, res: Response, next: NextFunction) => getAll(Chat, req, res, next);
export const getChat = async (req: Request, res: Response, next: NextFunction) => getOne(Chat, req, res, next);

// Don't update password on this 
export const updateChat = async (req: Request, res: Response, next: NextFunction) => updateOne(Chat, req, res, next);
export const deleteChat = async (req: Request, res: Response, next: NextFunction) => deleteOne(Chat, req, res, next);
export const createChat = async (req: Request, res: Response, next: NextFunction) => createOne(Chat, req, res, next);
