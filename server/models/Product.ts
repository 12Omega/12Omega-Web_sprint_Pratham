// Frontend-specific representation of a Product.
// It should align with the fields expected from the backend.
export interface IProduct {
  _id: any; // Or string, depending on Mongoose version/typings and frontend needs
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
  createdAt?: Date; // If needed on frontend
  updatedAt?: Date; // If needed on frontend
  // Exclude Mongoose Document specific methods if any were part of the backend interface
}
