import express, { Request, Response } from 'express';
import { searchAndFilterProducts } from '../controllers/search';

const router = express.Router();

// Define a route for searching and filtering products
router.get('/products', async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const { keyword, category } = req.query;

    // Call the service function
    const products = await searchAndFilterProducts(
      keyword as string,
      category as string
    );

    // Send the results
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
