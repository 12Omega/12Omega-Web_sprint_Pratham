import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Product document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stock: number;
  brand?: string;
  status?: string; // e.g., 'active', 'discontinued', 'out-of-stock'
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for Product
const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, index: true },
    sku: { type: String, required: true, unique: true, trim: true, index: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    brand: { type: String, trim: true, index: true },
    status: { type: String, trim: true, default: 'active', index: true },
    // Potentially add other fields like images, dimensions, ratings etc.
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Text index for searching
ProductSchema.index({ name: 'text', description: 'text', category: 'text', brand: 'text', sku: 'text' });

// Export the Mongoose model
export const Product = mongoose.model<IProduct>('Product', ProductSchema);
