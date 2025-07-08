import { ProductService } from './productService';
import { Product, IProduct } from '../models/Product';
import mongoose from 'mongoose';

// Mock the Product model
jest.mock('../models/Product');

const mockProductModel = Product as jest.Mocked<typeof Product>;

describe('ProductService', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and methods before each test
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should retrieve products with default pagination and sort', async () => {
      const mockProducts = [{ name: 'Product 1' }, { name: 'Product 2' }] as IProduct[];
      mockProductModel.find = jest.fn().mockReturnThis(); // for chaining sort, skip, limit
      mockProductModel.sort = jest.fn().mockReturnThis();
      mockProductModel.skip = jest.fn().mockReturnThis();
      mockProductModel.limit = jest.fn().mockResolvedValue(mockProducts);
      mockProductModel.countDocuments = jest.fn().mockResolvedValue(2);

      const result = await ProductService.getAllProducts({});
      
      expect(mockProductModel.find).toHaveBeenCalledWith({});
      expect(mockProductModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockProductModel.skip).toHaveBeenCalledWith(0);
      expect(mockProductModel.limit).toHaveBeenCalledWith(10);
      expect(mockProductModel.countDocuments).toHaveBeenCalledWith({});
      expect(result.data).toEqual(mockProducts);
      expect(result.pagination.totalProducts).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should apply filters, sorting, and pagination correctly', async () => {
      const queryParams = {
        category: 'Electronics',
        sortBy: 'price',
        sortOrder: 'asc',
        page: '2',
        limit: '5',
        search: 'test',
        minPrice: '10',
        maxPrice: '100',
        status: 'active',
        brand: 'TestBrand'
      };
      const mockProducts = [{ name: 'Filtered Product' }] as IProduct[];
      mockProductModel.find = jest.fn().mockReturnThis();
      mockProductModel.sort = jest.fn().mockReturnThis();
      mockProductModel.skip = jest.fn().mockReturnThis();
      mockProductModel.limit = jest.fn().mockResolvedValue(mockProducts);
      mockProductModel.countDocuments = jest.fn().mockResolvedValue(1);

      await ProductService.getAllProducts(queryParams);

      expect(mockProductModel.find).toHaveBeenCalledWith({
        $text: { $search: 'test' },
        category: 'Electronics',
        price: { $gte: 10, $lte: 100 },
        status: 'active',
        brand: 'TestBrand'
      });
      expect(mockProductModel.sort).toHaveBeenCalledWith({ price: 1 });
      expect(mockProductModel.skip).toHaveBeenCalledWith(5); // (2-1)*5
      expect(mockProductModel.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('createProduct', () => {
    it('should create and save a new product', async () => {
      const productData = { name: 'New Product', description: 'Desc', price: 10, category: 'Cat', sku: 'SKU123', stock: 100 } as Partial<IProduct>;
      const savedProduct = { ...productData, _id: new mongoose.Types.ObjectId() } as IProduct;
      
      // Mock the save method on the instance
      const mockSave = jest.fn().mockResolvedValue(savedProduct);
      mockProductModel.prototype.save = mockSave;
      
      const result = await ProductService.createProduct(productData);
      
      expect(mockProductModel).toHaveBeenCalledWith(productData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(savedProduct);
    });

    it('should throw error if required fields are missing', async () => {
      const productData = { name: 'Incomplete Product' } as Partial<IProduct>;
      await expect(ProductService.createProduct(productData))
        .rejects
        .toMatchObject({ status: 400, message: 'Missing required product fields.' });
    });

    it('should throw error for duplicate SKU', async () => {
        const productData = { name: 'Duplicate Product', description: 'Desc', price: 10, category: 'Cat', sku: 'SKU123', stock: 100 } as Partial<IProduct>;
        const mongoError = { code: 11000, keyValue: { sku: 'SKU123' } };
        mockProductModel.prototype.save = jest.fn().mockRejectedValue(mongoError);
        
        await expect(ProductService.createProduct(productData))
            .rejects
            .toMatchObject({ status: 409, message: 'Duplicate SKU or other unique field.', field: { sku: 'SKU123' } });
    });
  });

  describe('getProductById', () => {
    it('should return a product if found', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      const mockProduct = { _id: productId, name: 'Test Product' } as IProduct;
      mockProductModel.findById = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockProduct)
      } as any);

      const result = await ProductService.getProductById(productId);
      expect(mockProductModel.findById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduct);
    });

    it('should return null if product not found', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      mockProductModel.findById = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      } as any);
      
      const result = await ProductService.getProductById(productId);
      expect(result).toBeNull();
    });

    it('should throw error for invalid product ID format', async () => {
        await expect(ProductService.getProductById('invalid-id'))
            .rejects
            .toMatchObject({ status: 400, message: 'Invalid product ID format.' });
    });
  });

  describe('updateProduct', () => {
    it('should update and return the product', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      const updateData = { name: 'Updated Product Name' } as Partial<IProduct>;
      const updatedProduct = { _id: productId, ...updateData } as IProduct;
      mockProductModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(updatedProduct)
      } as any);

      const result = await ProductService.updateProduct(productId, updateData);
      expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(productId, updateData, { new: true, runValidators: true });
      expect(result).toEqual(updatedProduct);
    });
     it('should return null if product to update is not found', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      mockProductModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      } as any);
      const result = await ProductService.updateProduct(productId, { name: 'test' });
      expect(result).toBeNull();
    });
  });

  describe('deleteProduct', () => {
    it('should delete and return the product', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      const deletedProduct = { _id: productId, name: 'Deleted Product' } as IProduct;
      mockProductModel.findByIdAndDelete = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(deletedProduct)
      } as any);
      
      const result = await ProductService.deleteProduct(productId);
      expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith(productId);
      expect(result).toEqual(deletedProduct);
    });

    it('should return null if product to delete is not found', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      mockProductModel.findByIdAndDelete = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      } as any);
      const result = await ProductService.deleteProduct(productId);
      expect(result).toBeNull();
    });
  });
});
