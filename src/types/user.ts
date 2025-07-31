// This is a frontend-specific representation or a base for FrontendUser.
// It should align with the fields expected from the backend, excluding sensitive data.
export interface IUser {
  _id: any; // Or string, depending on Mongoose version/typings
  username: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  lastLoginAt?: Date;
  createdAt?: Date; // If needed on frontend
  updatedAt?: Date; // If needed on frontend
  status?: 'active' | 'inactive' | 'suspended';
  phone?: string;
  password?: string;
}
