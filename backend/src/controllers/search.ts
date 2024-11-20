import Product, { IProduct } from "../models/product";
import express from "express";

const router = express.Router();

// Search and filter function
export const searchAndFilterProducts = async (keyword: string, category?: string, pick_up_location?: string): Promise<IProduct[]> => {
  // Build the query object
  const query: any = {
    $and: [],
  };

  // Search logic: Check if the keyword matches any of the fields
  if (keyword) {
    const searchQuery = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { desc: { $regex: keyword, $options: 'i' } },
        { joint_purchase_information: { $regex: keyword, $options: 'i' } },
      ],
    };
    query.$and.push(searchQuery);
  }

  // Filter logic: Match the specified category
  if (category) {
    const categoryQuery = { category: category };
    query.$and.push(categoryQuery);
  }

  if (pick_up_location) {
    const pick_up_locationQuery = { pick_up_location: pick_up_location };
    query.$and.push(pick_up_locationQuery);
  }
  // Remove empty `$and` if no conditions were added
  if (query.$and.length === 0) {
    delete query.$and;
  }

  // Execute the query and return results
  return await Product.find(query);
};

export default router;