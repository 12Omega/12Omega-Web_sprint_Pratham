import request from 'supertest';
import express from 'express';
import productRoutes from './productRoutes'; // The router we're testing
import { ProductService } from '../services/productService'; // To mock its methods
import { IProduct } from '../models/Product';
import mongoose from 'mongoose';

// Mock the ProductService
jest.mock('../services/productService');
const mockProductService = ProductService as jest.Mocked<typeof ProductService>;

// Mock the authentication middleware
const mockAuthenticateToken = (req, res, next) => {
  // Simulate an authenticated user for protected routes
  // You can customize this mock to test different user roles or unauthenticated access
  req.user = { _id: new mongoose.Types.ObjectId().toString(), role: 'admin' }; 
  next();
};

jest.mock('../middleware/auth', () => ({
  authenticateToken: (req, res, next) => mockAuthenticateToken(req, res, next)
}));


const app = express();
app.use(express.json());
app.use('/api/products', productRoutes); // Mount the product routes

// Centralized error handler for testing
app.use((err, req, res, next) => {
  console.error("Test Error Handler:", err);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).json({ message, errors: err.errors, field: err.field });
});


describe('Product Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/products', () => {
    it('should create a new product and return 201', async () => {
      const productData = { name: 'Test Create', description: 'Desc', price: 100, category: 'Test', sku: 'SKUCREATE', stock: 10 };
      const createdProduct = { ...productData, _id: new mongoose.Types.ObjectId().toString() } as IProduct;
      mockProductService.createProduct.mockResolvedValue(createdProduct);

      const response = await request(app)
        .post('/api/products')
        .send(productData);
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(productData.name);
      expect(mockProductService.createProduct).toHaveBeenCalledWith(productData);
    });

    it('should return 400 if createProduct service throws validation error', async () => {
        const productData = { name: 'Test Create Bad' }; // Missing fields
        mockProductService.createProduct.mockRejectedValue({ status: 400, message: 'Validation Error', errors: { name: "Name is required"} });
  
        const response = await request(app)
          .post('/api/products')
          .send(productData);
        
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation Error');
      });
  });

  describe('GET /api/products', () => {
    it('should return a list of products with pagination and HATEOAS links', async () => {
      const mockProducts = [{ _id: new mongoose.Types.ObjectId().toString(), name: 'Product A' }] as IProduct[];
      const mockPagination = { currentPage: 1, totalPages: 1, totalProducts: 1, limit: 10 };
      mockProductService.getAllProducts.mockResolvedValue({ data: mockProducts, pagination: mockPagination });

      const response = await request(app).get('/api/products?page=1&limit=10');
      
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('Product A');
      expect(response.body.pagination).toEqual(mockPagination);
      expect(response.body._links.self).toBeDefined();
      expect(response.body.data[0]._links.self).toBeDefined();
      expect(mockProductService.getAllProducts).toHaveBeenCalledWith(expect.objectContaining({ page: '1', limit: '10' }));
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product with HATEOAS links and ETag', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      const mockProduct = { 
        _id: productId, 
        name: 'Single Product', 
        updatedAt: new Date(), 
        createdAt: new Date(),
        __v: 0 
      } as unknown as IProduct; // Cast to include __v for ETag
      mockProductService.getProductById.mockResolvedValue(mockProduct);

      const response = await request(app).get(`/api/products/${productId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Single Product');
      expect(response.body._links.self).toBeDefined();
      expect(response.headers.etag).toBeDefined();
    });

    it('should return 304 Not Modified if ETag matches', async () => {
        const productId = new mongoose.Types.ObjectId().toString();
        const now = new Date();
        const version = 0;
        const mockProduct = { _id: productId, name: 'Single Product', updatedAt: now, createdAt: now, __v: version } as unknown as IProduct;
        mockProductService.getProductById.mockResolvedValue(mockProduct);
        const etag = `"${now.getTime()}-${version}"`;
  
        const response = await request(app)
          .get(`/api/products/${productId}`)
          .set('If-None-Match', etag);
        
        expect(response.status).toBe(304);
      });

    it('should return 404 if product not found', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      mockProductService.getProductById.mockResolvedValue(null);

      const response = await request(app).get(`/api/products/${productId}`);
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product and return 200', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      const updateData = { name: 'Updated Name' };
      const updatedProduct = { _id: productId, ...updateData } as IProduct;
      mockProductService.updateProduct.mockResolvedValue(updatedProduct);

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
      expect(mockProductService.updateProduct).toHaveBeenCalledWith(productId, updateData);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product and return 200 with success message', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      const deletedProduct = { _id: productId, name: 'Deleted' } as IProduct;
      mockProductService.deleteProduct.mockResolvedValue(deletedProduct);

      const response = await request(app).delete(`/api/products/${productId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product deleted successfully');
      expect(response.body.product.name).toBe('Deleted');
      expect(mockProductService.deleteProduct).toHaveBeenCalledWith(productId);
    });
  });
});
