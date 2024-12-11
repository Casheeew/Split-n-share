import express, { NextFunction, Request, Response } from 'express';

import type { ListItem } from './types';
import { getAll, getOne, updateOne, deleteOne, createOne } from '../base';
import Product from '../../models/product';
import AppError from '../../utils/appError';
import User from '../../models/user';
import GroupChat from '../../models/groupchat';

const titles = [
  'Shin Ramen, 120g, 32 packs',
  'Sterilized Milk Strawberry Flavored 200ml x 24 packs',
  'Shin Ramen, 120g, 32 packs',
  'Sterilized Milk Strawberry Flavored 200ml x 24 packs',
  'Sterilized Milk Strawberry Flavored 200ml x 24 packs',
  'Shin Ramen, 120g, 32 packs',
  'Sterilized Milk Strawberry Flavored 200ml x 24 packs',
  'Comet Premium Soft Tissue 280 Sheets',
];

const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];
const desc = [
  '那是一种内在的东西， 他们到达不了，也无法触及的',
  '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  '生命就像一盒巧克力，结果往往出人意料',
  '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  '那时候我只会想自己想要什么，从不想自己拥有什么',
];
const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
];

// function fakeProducts(count: number): ListItem[] {
//   const list = [];
//   for (let i = 0; i < count; i += 1) {
//     list.push({
//       id: `fake-list-${i}`,
//       owner: user[i % 10],
//       title: titles[i % 8],
//       avatar: avatars[i % 8],
//       cover: parseInt(`${i / 4}`, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)],
//       status: ['active', 'exception', 'normal'][i % 3] as
//         | 'normal'
//         | 'exception'
//         | 'active'
//         | 'success',
//       percent: Math.ceil(Math.random() * 50) + 50,
//       logo: avatars[i % 8],
//       href: 'https://ant.design',
//       updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
//       createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
//       subDescription: desc[i % 5],
//       description:
//         '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
//       activeUser: Math.ceil(Math.random() * 100000) + 100000,
//       newUser: Math.ceil(Math.random() * 1000) + 1000,
//       star: Math.ceil(Math.random() * 100) + 100,
//       like: Math.ceil(Math.random() * 100) + 100,
//       message: Math.ceil(Math.random() * 10) + 10,
//       content:
//         '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
//       members: [
//         {
//           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
//           name: '曲丽丽',
//           id: 'member1',
//         },
//         {
//           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
//           name: '王昭君',
//           id: 'member2',
//         },
//         {
//           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
//           name: '董娜娜',
//           id: 'member3',
//         },
//       ],
//     });
//   }

//   return list;
// }

// export function getAllProducts(req: Request, res: Response) {
//   const params: any = req.query;

//   const count = params.count * 1 || 20;

//   const result = fakeProducts(count);
//   return res.json({
//     data: {
//       list: result,
//     },
//   });
// }

const router = express.Router();

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => getAll(Product, req, res, next);
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isList = req.params.id.startsWith('[') && req.params.id.endsWith(']');
    const doc = isList ? await Product.find({ _id: req.params.id.slice(1, -1).split(',') }) : await Product.findById(req.params.id);

    if (!doc) {
      return next(new AppError(404, 'fail', 'No document found with that id'));
    }

    console.log({
      data: {
        status: 'success',
        data: doc,
      },
    })

    res.status(200).json({
      data: {
        status: 'success',
        data: doc,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Don't update password on this 
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => updateOne(Product, req, res, next);
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => deleteOne(Product, req, res, next);
export const createProduct = async (req: Request, res: Response, next: NextFunction) => createOne(Product, req, res, next);

export const joinProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    const userId = res.locals.user._id; // Current user's ID from authentication middleware

    // Validate target user 
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }
    
    // Update given_reviews and received_reviews
    const data = await Product.findByIdAndUpdate(productId, { $push: { cobuyers_queue: userId } });
    
    res.status(201).json({
      status: 'success',
      data, // Return the product data
    });
  } catch (err) {
    next(err);
  }
}

export const unjoinProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    const userId = res.locals.user._id; // Current user's ID from authentication middleware

    // Validate target user 
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }
    
    // Update given_reviews and received_reviews
    const data = await Product.findByIdAndUpdate(productId, { $pull: { cobuyers_queue: userId } });
    
    res.status(201).json({
      status: 'success',
      data, // Return the product data
    });
  } catch (err) {
    next(err);
  }
}

export const declineJoinProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId;
    const userId = req.params.userId;

    // Validate target user 
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }
    
    // Update given_reviews and received_reviews
    const data = await Product.findByIdAndUpdate(productId, { $pull: { cobuyers_queue: userId } });
    
    res.status(201).json({
      status: 'success',
      data, // Return the product data
    });
  } catch (err) {
    next(err);
  }
}

export const approveJoinProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId;
    const userId = req.params.userId;

    // Update given_reviews and received_reviews
    await Product.findByIdAndUpdate(productId, { $pull: { cobuyers_queue: userId } });
    const product = await Product.findByIdAndUpdate(productId, { $push: { cobuyers: userId } });

    const groupchat = await GroupChat.findOneAndUpdate({ productId }, { $push: { members: userId }});
    // await groupchat

    res.status(201).json({
      status: 'success',
      data: {
        product,
        groupchat,
      }, // Return the product data
    });
  } catch (err) {
    next(err);
  }
}

export const getUserProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params; // Extract userId from route parameter

    // Validate if userId is provided
    if (!userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'User ID is required',
      });
    }

    // Fetch products created by the specified user
    const userProducts = await Product.find({ creator: userId }).populate(['cobuyers', 'cobuyers_queue']);
    // Respond with the results
    res.status(200).json({
      status: 'success',
      results: userProducts.length,
      data: userProducts,
    });
  } catch (err) {
    next(err); // Pass error to global error handler
  }
};