import { User, IUser } from '../models/User';
import mongoose from 'mongoose';

interface UserQueryParams {
  role?: string;
  isActive?: string; // Query params are strings
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}

interface PaginatedUsersResult {
  data: Omit<IUser, 'password'>[]; // Exclude password from data items
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
  };
}

// Helper to exclude password from user object
const sanitizeUser = (user: IUser): Omit<IUser, 'password'> => {
  const userObject = user.toObject ? user.toObject() : { ...user };
  delete userObject.password;
  return userObject;
};


export const UserService = {
  async createUser(userData: Partial<IUser>): Promise<Omit<IUser, 'password'>> {
    if (!userData.username || !userData.email || !userData.password) {
      throw { status: 400, message: 'Username, email, and password are required.' };
    }
    try {
      const newUser = new User(userData);
      await newUser.save();
      return sanitizeUser(newUser);
    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw { status: 400, message: 'Validation Error', errors: error.errors };
      }
      if (error.code === 11000) {
        throw { status: 409, message: 'Duplicate username or email.', field: error.keyValue };
      }
      throw error;
    }
  },

  async getAllUsers(queryParams: UserQueryParams): Promise<PaginatedUsersResult> {
    const { role, isActive, search, sortBy, sortOrder } = queryParams;
    let query: any = {};

    if (search) {
        query.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
        ];
    }
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    let sortOptions: any = {};
    if (sortBy) {
      const order = (sortOrder === 'desc' || sortOrder === '-1') ? -1 : 1;
      sortOptions[sortBy] = order;
    } else {
      sortOptions.createdAt = -1; 
    }
    
    const page = parseInt(queryParams.page || '1');
    const limit = parseInt(queryParams.limit || '10');
    const skip = (page - 1) * limit;

    const users = await User.find(query, '-password') 
                              .sort(sortOptions)
                              .skip(skip)
                              .limit(limit)
                              .lean();
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    
    return {
      data: users as Omit<IUser, 'password'>[], // lean() returns plain objects, password already excluded
      pagination: { currentPage: page, totalPages, totalUsers, limit }
    };
  },

  async getUserById(userId: string): Promise<Omit<IUser, 'password'> | null> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw { status: 400, message: 'Invalid user ID format.' };
    }
    const user = await User.findById(userId, '-password').lean();
    return user as Omit<IUser, 'password'> | null;
  },

  async updateUser(
    userId: string, 
    updateData: Partial<IUser>, 
    requestingUser?: IUser // User performing the update
  ): Promise<Omit<IUser, 'password'> | null> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw { status: 400, message: 'Invalid user ID format.' };
    }

    const allowedUpdates: (keyof IUser)[] = ['email', 'firstName', 'lastName'];
    let finalUpdateData: Partial<IUser> = {};

    // Filter updates based on permissions
    if (requestingUser?.role === 'admin') {
        // Admin can update role and isActive
        if (updateData.role) finalUpdateData.role = updateData.role;
        if (updateData.isActive !== undefined) finalUpdateData.isActive = updateData.isActive;
        allowedUpdates.forEach(key => {
            if (updateData[key] !== undefined) (finalUpdateData as any)[key] = updateData[key];
        });
    } else if (requestingUser?._id.toString() === userId) {
        // User can update their own allowed fields
         allowedUpdates.forEach(key => {
            if (updateData[key] !== undefined) (finalUpdateData as any)[key] = updateData[key];
        });
        // Prevent self-update of role or isActive status
        if (updateData.role || updateData.isActive !== undefined) {
             throw { status: 403, message: 'Forbidden: You cannot update your own role or active status.' };
        }
    } else {
        throw { status: 403, message: 'Forbidden: You do not have permission to update this user.' };
    }
    
    try {
        // Handle password change separately to ensure hashing by model's pre-save hook
        if (updateData.password) {
            const userToUpdate = await User.findById(userId);
            if (!userToUpdate) return null; 
            userToUpdate.password = updateData.password; 
            await userToUpdate.save(); // This will trigger the pre-save hook for password
        }

        // Update other fields
        if (Object.keys(finalUpdateData).length > 0) {
            const updatedUser = await User.findByIdAndUpdate(userId, { $set: finalUpdateData }, { new: true, runValidators: true, select: '-password' }).lean();
            return updatedUser as Omit<IUser, 'password'> | null;
        } else if (updateData.password) { // If only password was updated
             return this.getUserById(userId); // Fetch the user again to get the updated (but password excluded) version
        }
        return this.getUserById(userId); // Return current state if no applicable fields were updated

    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw { status: 400, message: 'Validation Error', errors: error.errors };
      }
      if (error.code === 11000) {
        throw { status: 409, message: 'Duplicate username or email during update.', field: error.keyValue };
      }
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<Omit<IUser, 'password'> | null> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw { status: 400, message: 'Invalid user ID format.' };
    }
    const deletedUser = await User.findByIdAndDelete(userId, { select: '-password' }).lean();
    return deletedUser as Omit<IUser, 'password'> | null;
  }
};
