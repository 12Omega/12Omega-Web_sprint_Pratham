import { Product, IProduct } from '../models/Product';
import mongoose from 'mongoose';

interface ProductQueryParams {
  category?: string;
  brand?: string;
  status?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}

interface PaginatedProductsResult {
  data: IProduct[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    limit: number;
  };
}

export const ProductService = {
  async getAllProducts(queryParams: ProductQueryParams): Promise<PaginatedProductsResult> {
    const { category, brand, status, minPrice, maxPrice, search, sortBy, sortOrder } = queryParams;

    let query: any = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filtering
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (status) query.status = status;
    if (minPrice && !isNaN(parseFloat(minPrice))) {
      query.price = { ...query.price, $gte: parseFloat(minPrice) };
    }
    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    }

    let sortOptions: any = {};
    if (sortBy) {
      const order = (sortOrder === 'desc' || sortOrder === '-1') ? -1 : 1;
      sortOptions[sortBy] = order;
    } else {
      sortOptions.createdAt = -1; // Default sort by newest
    }

    const page = parseInt(queryParams.page || '1');
    const limit = parseInt(queryParams.limit || '10');
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
                                  .sort(sortOptions)
                                  .skip(skip)
                                  .limit(limit)
                                  .lean(); // Use .lean() for faster queries if not modifying docs
    
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      data: products as IProduct[], // Cast because lean() returns plain objects
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit
      }
    };
  },

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    // Basic validation, can be expanded or handled by a dedicated validation layer
    if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.sku || productData.stock === undefined) {
      throw { status: 400, message: 'Missing required product fields.' }; // Throw custom error object
    }
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw { status: 400, message: 'Validation Error', errors: error.errors };
      }
      if (error.code === 11000) {
        throw { status: 409, message: 'Duplicate SKU or other unique field.', field: error.keyValue };
      }
      throw error; // Re-throw other errors
    }
  },

  async getProductById(productId: string): Promise<IProduct | null> {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw { status: 400, message: 'Invalid product ID format.' };
    }
    return Product.findById(productId).lean();
  },

  async updateProduct(productId: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw { status: 400, message: 'Invalid product ID format.' };
    }
    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true, runValidators: true }).lean();
      return updatedProduct;
    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw { status: 400, message: 'Validation Error', errors: error.errors };
      }
      if (error.code === 11000) {
        throw { status: 409, message: 'Duplicate SKU or other unique field during update.', field: error.keyValue };
      }
      throw error;
    }
  },

  async deleteProduct(productId: string): Promise<IProduct | null> {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw { status: 400, message: 'Invalid product ID format.' };
    }
    const deletedProduct = await Product.findByIdAndDelete(productId).lean();
    return deletedProduct;
  }
};
