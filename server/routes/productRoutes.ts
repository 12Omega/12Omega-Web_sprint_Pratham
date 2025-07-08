import { Router, Request, Response, NextFunction } from 'express';
import { Product, IProduct } from '../models/Product';
import { authenticateToken } from '../middleware/auth'; // Corrected path
import mongoose from 'mongoose';

const router = Router();

// Middleware to verify JWT - apply to all product routes or specific ones as needed
// For now, let's assume all product modification routes require authentication
// and fetching products is public. This can be adjusted.

// Create a new product
router.post('/', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData: Partial<IProduct> = req.body;
    // Ensure required fields are present (basic validation)
    if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.sku || productData.stock === undefined) {
      return res.status(400).json({ message: 'Missing required product fields.' });
    }
    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.code === 11000) { // MongoError: E11000 duplicate key error
        return res.status(409).json({ message: 'Duplicate SKU or other unique field.', field: error.keyValue });
    }
    next(error); // Pass other errors to the global error handler
  }
});

// Get all products with filtering, sorting, and basic text search
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, brand, status, minPrice, maxPrice, search, sortBy, sortOrder } = req.query;

    let query: any = {};

    // Text search
    if (search && typeof search === 'string') {
      query.$text = { $search: search };
    }

    // Filtering
    if (category && typeof category === 'string') query.category = category;
    if (brand && typeof brand === 'string') query.brand = brand;
    if (status && typeof status === 'string') query.status = status;
    if (minPrice && !isNaN(parseFloat(minPrice as string))) {
      query.price = { ...query.price, $gte: parseFloat(minPrice as string) };
    }
    if (maxPrice && !isNaN(parseFloat(maxPrice as string))) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice as string) };
    }

    let sortOptions: any = {};
    if (sortBy && typeof sortBy === 'string') {
      const order = (sortOrder === 'desc' || sortOrder === '-1') ? -1 : 1;
      sortOptions[sortBy] = order;
    } else {
      sortOptions.createdAt = -1; // Default sort by newest
    }

    // Pagination (basic example, can be enhanced)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
                                  .sort(sortOptions)
                                  .skip(skip)
                                  .limit(limit);
    
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const productsWithLinks = products.map(product => ({
      ...product.toObject(),
      _links: {
        self: { href: `/api/products/${product._id}` }
      }
    }));
    
    const collectionLinks: any = {
        self: { href: `/api/products?page=${page}&limit=${limit}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`.replace(/&?page=\d+&?/, '').replace(/&?limit=\d+&?/, '') }, // Keep other query params
        first: { href: `/api/products?page=1&limit=${limit}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`.replace(/&?page=\d+&?/, '').replace(/&?limit=\d+&?/, '') }
    };
    if (page > 1) {
        collectionLinks.prev = { href: `/api/products?page=${page - 1}&limit=${limit}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`.replace(/&?page=\d+&?/, '').replace(/&?limit=\d+&?/, '') };
    }
    if (page < totalPages) {
        collectionLinks.next = { href: `/api/products?page=${page + 1}&limit=${limit}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`.replace(/&?page=\d+&?/, '').replace(/&?limit=\d+&?/, '') };
    }
     if (totalPages > 0) {
        collectionLinks.last = { href: `/api/products?page=${totalPages}&limit=${limit}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`.replace(/&?page=\d+&?/, '').replace(/&?limit=\d+&?/, '') };
    }


    res.status(200).json({
      data: productsWithLinks,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit
      },
      _links: collectionLinks
    });
  } catch (error) {
    next(error);
  }
});

// Get a single product by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid product ID format.' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ETag generation: simple approach using product's updatedAt timestamp and version
    // A more robust ETag might involve hashing the content or using a dedicated library.
    const etag = `"${new Date(product.updatedAt || product.createdAt).getTime()}-${product.__v}"`;
    
    res.setHeader('ETag', etag);
    res.setHeader('Last-Modified', (product.updatedAt || product.createdAt).toUTCString());


    // Check If-None-Match header
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).send(); // Not Modified
    }
    
    const productWithLinks = {
      ...product.toObject(),
      _links: {
        self: { href: `/api/products/${product._id}` },
        collection: { href: '/api/products' }
      }
    };
    res.status(200).json(productWithLinks);
  } catch (error) {
    next(error);
  }
});

// Update an existing product by ID
router.put('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid product ID format.' });
    }
    const productData: Partial<IProduct> = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productData, { new: true, runValidators: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found for update' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.code === 11000) { // MongoError: E11000 duplicate key error
        return res.status(409).json({ message: 'Duplicate SKU or other unique field during update.', field: error.keyValue });
    }
    next(error);
  }
});

// Delete a product by ID
router.delete('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid product ID format.' });
    }
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found for deletion' });
    }
    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    next(error);
  }
});

export default router;
