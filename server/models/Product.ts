import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  sku: string;
  stock: number;
  images?: string[];
  tags?: string[];
  status: 'active' | 'inactive' | 'discontinued';
  featured?: boolean;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  brand: { type: String, trim: true },
  sku: { type: String, required: true, unique: true, trim: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  images: [{ type: String }],
  tags: [{ type: String, trim: true }],
  status: { type: String, enum: ['active', 'inactive', 'discontinued'], default: 'active' },
  featured: { type: Boolean, default: false },
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  }
}, {
  timestamps: true
});

// Index for better search performance
ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);