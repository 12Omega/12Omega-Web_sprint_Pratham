import { Router, Request, Response, NextFunction } from 'express';
import { IProduct } from '../models/Product'; // IProduct might still be useful for request body typing
import { authenticateToken } from '../middleware/auth';
import { ProductService } from '../services/productService';
import mongoose from 'mongoose'; // Keep for ObjectId.isValid if not handled in service

const router = Router();

// Create a new product
router.post('/', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData: Partial<IProduct> = req.body;
    const newProduct = await ProductService.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error: any) {
    // Service layer now throws structured errors with status
    if (error.status) {
      return res.status(error.status).json({ message: error.message, errors: error.errors, field: error.field });
    }
    next(error); // Pass other errors to the global error handler
  }
});

// Get all products with filtering, sorting, and basic text search
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Cast query parameters to string as ProductService expects them that way
    const queryParams = {
      category: req.query.category as string | undefined,
      brand: req.query.brand as string | undefined,
      status: req.query.status as string | undefined,
      minPrice: req.query.minPrice as string | undefined,
      maxPrice: req.query.maxPrice as string | undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: req.query.sortOrder as string | undefined,
      page: req.query.page as string | undefined,
      limit: req.query.limit as string | undefined,
    };

    const result = await ProductService.getAllProducts(queryParams);
    
    const productsWithLinks = result.data.map(product => ({
      ...product, // Product is already a plain object from .lean()
      _links: {
        self: { href: `/api/products/${product._id}` }
      }
    }));
    
    const page = result.pagination.currentPage;
    const limit = result.pagination.limit;
    const totalPages = result.pagination.totalPages;

    // Construct full query string for HATEOAS links, excluding page/limit from original if they exist
    let existingQueryString = '';
    for (const key in req.query) {
        if (key !== 'page' && key !== 'limit') {
            if (existingQueryString === '') existingQueryString += '?';
            else existingQueryString += '&';
            existingQueryString += `${encodeURIComponent(key)}=${encodeURIComponent(req.query[key] as string)}`;
        }
    }
    if(existingQueryString !== '' && !existingQueryString.startsWith('?')) existingQueryString = `?${existingQueryString}`;


    const collectionLinks: any = {
        self: { href: `/api/products${existingQueryString}${existingQueryString ? '&' : '?'}page=${page}&limit=${limit}` },
        first: { href: `/api/products${existingQueryString}${existingQueryString ? '&' : '?'}page=1&limit=${limit}` }
    };
    if (page > 1) {
        collectionLinks.prev = { href: `/api/products${existingQueryString}${existingQueryString ? '&' : '?'}page=${page - 1}&limit=${limit}` };
    }
    if (page < totalPages) {
        collectionLinks.next = { href: `/api/products${existingQueryString}${existingQueryString ? '&' : '?'}page=${page + 1}&limit=${limit}` };
    }
     if (totalPages > 0) {
        collectionLinks.last = { href: `/api/products${existingQueryString}${existingQueryString ? '&' : '?'}page=${totalPages}&limit=${limit}` };
    }

    res.status(200).json({
      data: productsWithLinks,
      pagination: result.pagination,
      _links: collectionLinks
    });
  } catch (error: any) {
    next(error);
  }
});

// Get a single product by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const etag = `"${new Date(product.updatedAt || product.createdAt!).getTime()}-${(product as any).__v}"`;
    res.setHeader('ETag', etag);
    if (product.updatedAt || product.createdAt) {
        res.setHeader('Last-Modified', (product.updatedAt || product.createdAt!).toUTCString());
    }

    if (req.headers['if-none-match'] === etag) {
      return res.status(304).send();
    }
    
    const productWithLinks = {
      ...product,
      _links: {
        self: { href: `/api/products/${product._id}` },
        collection: { href: '/api/products' }
      }
    };
    res.status(200).json(productWithLinks);
  } catch (error: any) {
     if (error.status) { // Errors from service
      return res.status(error.status).json({ message: error.message });
    }
    next(error);
  }
});

// Update an existing product by ID
router.put('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData: Partial<IProduct> = req.body;
    const updatedProduct = await ProductService.updateProduct(req.params.id, productData);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found for update' });
    }
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message, errors: error.errors, field: error.field });
    }
    next(error);
  }
});

// Delete a product by ID
router.delete('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedProduct = await ProductService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found for deletion' });
    }
    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error: any) {
    if (error.status) { // Errors from service
      return res.status(error.status).json({ message: error.message });
    }
    next(error);
  }
});

export default router;
