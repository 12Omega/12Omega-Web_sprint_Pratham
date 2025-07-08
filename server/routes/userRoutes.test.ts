import request from 'supertest';
import express from 'express';
import userRoutes from './userRoutes'; // The router we're testing
import { UserService } from '../services/userService'; // To mock its methods
import { IUser } from '../models/User';
import mongoose from 'mongoose';

// Mock the UserService
jest.mock('../services/userService');
const mockUserService = UserService as jest.Mocked<typeof UserService>;

// Mock the authentication middleware
let currentMockUser: Partial<IUser> | null = null;
const mockAuthenticateToken = (req, res, next) => {
  req.user = currentMockUser; 
  next();
};

jest.mock('../middleware/auth', () => ({
  authenticateToken: (req, res, next) => mockAuthenticateToken(req, res, next)
}));

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

// Centralized error handler for testing
app.use((err, req, res, next) => {
  console.error("Test Error Handler (UserRoutes):", err);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).json({ message, errors: err.errors, field: err.field });
});

const adminUser = { _id: new mongoose.Types.ObjectId().toString(), role: 'admin', username: 'admin', email: 'admin@test.com' } as IUser;
const regularUser = { _id: new mongoose.Types.ObjectId().toString(), role: 'user', username: 'user', email: 'user@test.com' } as IUser;


describe('User Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentMockUser = null; // Reset mock user
  });

  describe('POST /api/users (Admin Creation)', () => {
    it('should allow admin to create a new user and return 201', async () => {
      currentMockUser = adminUser;
      const newUserData = { username: 'newbyadmin', email: 'newbyadmin@example.com', password: 'password123', role: 'user' };
      const createdUser = { ...newUserData, _id: new mongoose.Types.ObjectId().toString() } as Omit<IUser, 'password'>;
      mockUserService.createUser.mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/api/users')
        .send(newUserData);
      
      expect(response.status).toBe(201);
      expect(response.body.username).toBe(newUserData.username);
      expect(mockUserService.createUser).toHaveBeenCalledWith(newUserData);
    });

    it('should prevent non-admin from creating a user and return 403', async () => {
      currentMockUser = regularUser;
      const newUserData = { username: 'newbyuser', email: 'newbyuser@example.com', password: 'password123' };
      
      const response = await request(app)
        .post('/api/users')
        .send(newUserData);
        
      expect(response.status).toBe(403);
      expect(mockUserService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/users (Admin Listing)', () => {
    it('should allow admin to get a list of users', async () => {
      currentMockUser = adminUser;
      const mockUsers = [{ _id: new mongoose.Types.ObjectId().toString(), username: 'UserA' }] as Omit<IUser, 'password'>[];
      const mockPagination = { currentPage: 1, totalPages: 1, totalUsers: 1, limit: 10 };
      mockUserService.getAllUsers.mockResolvedValue({ data: mockUsers, pagination: mockPagination });

      const response = await request(app).get('/api/users?page=1');
      
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.pagination).toEqual(mockPagination);
      expect(mockUserService.getAllUsers).toHaveBeenCalledWith(expect.objectContaining({ page: '1' }));
    });
     it('should prevent non-admin from listing users and return 403', async () => {
      currentMockUser = regularUser;
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(403);
      expect(mockUserService.getAllUsers).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/users/:id', () => {
    it('admin should get any user by ID', async () => {
      currentMockUser = adminUser;
      const targetUserId = new mongoose.Types.ObjectId().toString();
      const mockUser = { _id: targetUserId, username: 'TargetUser', updatedAt: new Date(), createdAt: new Date(), __v: 0 } as unknown as Omit<IUser, 'password'>;
      mockUserService.getUserById.mockResolvedValue(mockUser);

      const response = await request(app).get(`/api/users/${targetUserId}`);
      expect(response.status).toBe(200);
      expect(response.body.username).toBe('TargetUser');
    });

    it('user should get their own profile by ID', async () => {
      currentMockUser = regularUser; // regularUser._id is the ID we'll request
      const mockUser = { ...regularUser, updatedAt: new Date(), createdAt: new Date(), __v: 0 } as unknown as Omit<IUser, 'password'>;
      mockUserService.getUserById.mockResolvedValue(mockUser);

      const response = await request(app).get(`/api/users/${regularUser._id}`);
      expect(response.status).toBe(200);
      expect(response.body.username).toBe(regularUser.username);
    });
    
    it('user should NOT get another user\'s profile by ID and return 403', async () => {
        currentMockUser = regularUser;
        const anotherUserId = new mongoose.Types.ObjectId().toString(); // Different ID
  
        const response = await request(app).get(`/api/users/${anotherUserId}`);
        expect(response.status).toBe(403);
        expect(mockUserService.getUserById).not.toHaveBeenCalled(); // Service method should not be called
      });

    it('should return 404 if user not found by service', async () => {
      currentMockUser = adminUser; // Admin can try to get any ID
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      mockUserService.getUserById.mockResolvedValue(null);
      
      const response = await request(app).get(`/api/users/${nonExistentId}`);
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('admin should update any user', async () => {
      currentMockUser = adminUser;
      const targetUserId = new mongoose.Types.ObjectId().toString();
      const updateData = { firstName: 'AdminUpdatedName' };
      const updatedUser = { _id: targetUserId, ...updateData } as Omit<IUser, 'password'>;
      mockUserService.updateUser.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put(`/api/users/${targetUserId}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('AdminUpdatedName');
      expect(mockUserService.updateUser).toHaveBeenCalledWith(targetUserId, updateData, adminUser);
    });

    it('user should update their own profile', async () => {
      currentMockUser = regularUser;
      const updateData = { lastName: 'UserSelfUpdated' };
      const updatedUser = { ...regularUser, ...updateData } as Omit<IUser, 'password'>;
      mockUserService.updateUser.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put(`/api/users/${regularUser._id}`)
        .send(updateData);
        
      expect(response.status).toBe(200);
      expect(response.body.lastName).toBe('UserSelfUpdated');
      expect(mockUserService.updateUser).toHaveBeenCalledWith(regularUser._id.toString(), updateData, regularUser);
    });
    
    it('user should NOT update another user\'s profile and return 403 from service/route', async () => {
        currentMockUser = regularUser;
        const anotherUserId = new mongoose.Types.ObjectId().toString();
        const updateData = { firstName: 'AttemptUpdate' };
        // Simulate service throwing a 403
        mockUserService.updateUser.mockRejectedValue({ status: 403, message: 'Forbidden: You do not have permission to update this user.' });
  
        const response = await request(app)
          .put(`/api/users/${anotherUserId}`)
          .send(updateData);
          
        expect(response.status).toBe(403);
      });
  });

  describe('DELETE /api/users/:id (Admin Deletion)', () => {
    it('admin should delete a user', async () => {
      currentMockUser = adminUser;
      const targetUserId = new mongoose.Types.ObjectId().toString();
      const deletedUser = { _id: targetUserId, username: 'DeletedUser' } as Omit<IUser, 'password'>;
      mockUserService.deleteUser.mockResolvedValue(deletedUser);

      const response = await request(app).delete(`/api/users/${targetUserId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted successfully');
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(targetUserId);
    });

    it('non-admin should NOT delete a user and return 403', async () => {
      currentMockUser = regularUser;
      const targetUserId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app).delete(`/api/users/${targetUserId}`);
      expect(response.status).toBe(403);
      expect(mockUserService.deleteUser).not.toHaveBeenCalled();
    });
  });
});
