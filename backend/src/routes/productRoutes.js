import express from 'express';
import { 
  getProducts, 
  getProductById, 
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products - Get all products (with optional queries category, minPrice, maxPrice, sort, search, page, limit)
router.get('/', getProducts);

// GET /api/products/slug/:slug - Get single product by SEO slug (Must be declared before :id to prevent collision)
router.get('/slug/:slug', getProductBySlug);

// GET /api/products/:id - Get single product by Mongoose ID
router.get('/:id', getProductById);

// Admin-only product management routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
