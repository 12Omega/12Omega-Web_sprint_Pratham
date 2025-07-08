import { UserService } from './userService';
import { User, IUser } from '../models/User';
import mongoose from 'mongoose';

jest.mock('../models/User');

const mockUserModel = User as jest.Mocked<typeof User>;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = (idOverride?: string, data?: Partial<IUser>): IUser => ({
    _id: new mongoose.Types.ObjectId(idOverride),
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword', // In reality, this would be hashed
    role: 'user',
    isActive: true,
    firstName: 'Test',
    lastName: 'User',
    save: jest.fn().mockResolvedValue(this),
    comparePassword: jest.fn().mockResolvedValue(true),
    toObject: jest.fn().mockImplementation(() => {
        const obj = { ...this };
        delete obj.password; // Simulate password exclusion
        return obj;
    }),
    ...data,
  } as unknown as IUser);


  describe('createUser', () => {
    it('should create and save a new user, returning sanitized user', async () => {
      const userData = { username: 'newuser', email: 'new@example.com', password: 'password123' };
      const savedUser = mockUser(undefined, userData);
      
      // Mock the save method on the instance for this specific test path
      const mockSave = jest.fn().mockResolvedValue(savedUser);
      mockUserModel.prototype.save = mockSave;
      
      const result = await UserService.createUser(userData);
      
      expect(mockUserModel).toHaveBeenCalledWith(expect.objectContaining(userData));
      expect(mockSave).toHaveBeenCalled();
      expect(result.username).toBe(userData.username);
      expect(result.email).toBe(userData.email);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if required fields are missing for createUser', async () => {
      await expect(UserService.createUser({ username: 'incomplete' }))
        .rejects
        .toMatchObject({ status: 400, message: 'Username, email, and password are required.' });
    });
  });

  describe('getAllUsers', () => {
    it('should retrieve users with default pagination and sort, excluding passwords', async () => {
      const usersArray = [mockUser(), mockUser()];
      mockUserModel.find = jest.fn().mockReturnThis();
      mockUserModel.sort = jest.fn().mockReturnThis();
      mockUserModel.skip = jest.fn().mockReturnThis();
      mockUserModel.limit = jest.fn().mockResolvedValue(usersArray.map(u => ({...u, toObject: () => u}))); // Simulate lean()
      mockUserModel.countDocuments = jest.fn().mockResolvedValue(usersArray.length);

      const result = await UserService.getAllUsers({});
      
      expect(mockUserModel.find).toHaveBeenCalledWith({}, '-password');
      expect(mockUserModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result.data.length).toBe(usersArray.length);
      result.data.forEach(user => expect(user).not.toHaveProperty('password'));
    });
  });

  describe('getUserById', () => {
    it('should return a user (without password) if found', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const foundUser = mockUser(userId);
      mockUserModel.findById = jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(), // for '-password'
          lean: jest.fn().mockResolvedValue(foundUser)
      } as any);

      const result = await UserService.getUserById(userId);
      expect(mockUserModel.findById).toHaveBeenCalledWith(userId, '-password');
      expect(result?.username).toBe(foundUser.username);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error for invalid user ID format in getUserById', async () => {
        await expect(UserService.getUserById('invalid-id'))
            .rejects
            .toMatchObject({ status: 400, message: 'Invalid user ID format.' });
    });
  });

  describe('updateUser', () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const requestingAdmin = mockUser(undefined, { role: 'admin' });
    const requestingSelf = mockUser(userId, { role: 'user' }); // ID matches user being updated
    const otherUser = mockUser(new mongoose.Types.ObjectId().toString(), {role: 'user'});


    it('admin should update user fields including role and isActive', async () => {
      const updatePayload = { role: 'admin', isActive: false, firstName: 'AdminUpdated' } as Partial<IUser>;
      const originalUser = mockUser(userId);
      const updatedUserDoc = { ...originalUser, ...updatePayload, _id: userId };
      
      mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(updatedUserDoc)
      } as any);
      mockUserModel.findById = jest.fn().mockResolvedValue(mockUser(userId)); // For password update path, not hit here

      const result = await UserService.updateUser(userId, updatePayload, requestingAdmin);
      
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId, 
        { $set: expect.objectContaining({ role: 'admin', isActive: false, firstName: 'AdminUpdated' }) },
        expect.anything()
      );
      expect(result?.role).toBe('admin');
      expect(result?.isActive).toBe(false);
    });

    it('user should update their own allowed fields (firstName, email)', async () => {
        const updatePayload = { firstName: 'SelfUpdated', email: 'selfupdated@example.com' } as Partial<IUser>;
        const originalUser = mockUser(userId);
        const updatedUserDoc = { ...originalUser, ...updatePayload, _id: userId };

        mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(updatedUserDoc)
        } as any);
        mockUserModel.findById = jest.fn().mockResolvedValue(mockUser(userId));


        const result = await UserService.updateUser(userId, updatePayload, requestingSelf);
        expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
            userId,
            { $set: expect.objectContaining({ firstName: 'SelfUpdated', email: 'selfupdated@example.com' }) },
            expect.anything()
        );
        expect(result?.firstName).toBe('SelfUpdated');
    });
    
    it('user should be able to update their own password', async () => {
        const updatePayload = { password: 'newPassword123' } as Partial<IUser>;
        const userInstance = mockUser(userId); // This will have the mock save
        
        mockUserModel.findById = jest.fn().mockResolvedValue(userInstance); // For password update path
        // findByIdAndUpdate might not be called if only password is changed, service refetches.
        // So we set up a mock for the refetch path.
         mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(null) // Simulate no other fields updated
        } as any);


        await UserService.updateUser(userId, updatePayload, requestingSelf);
        expect(userInstance.password).toBe('newPassword123'); // Password set on instance
        expect(userInstance.save).toHaveBeenCalled(); // Pre-save hook will hash it
    });

    it('should throw error if user tries to update another user\'s profile (not admin)', async () => {
      const anotherUserId = new mongoose.Types.ObjectId().toString();
      await expect(UserService.updateUser(anotherUserId, { firstName: 'AttemptUpdate' }, requestingSelf))
        .rejects
        .toMatchObject({ status: 403, message: 'Forbidden: You do not have permission to update this user.' });
    });
    
    it('user cannot update their own role or isActive status', async () => {
        const updatePayload = { role: 'admin' } as Partial<IUser>;
         await expect(UserService.updateUser(userId, updatePayload, requestingSelf))
            .rejects
            .toMatchObject({ status: 403, message: 'Forbidden: You cannot update your own role or active status.' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return the sanitized user', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const deletedUserDoc = mockUser(userId);
      mockUserModel.findByIdAndDelete = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(deletedUserDoc)
      }as any);

      const result = await UserService.deleteUser(userId);
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId, {select: '-password'});
      expect(result?.username).toBe(deletedUserDoc.username);
      expect(result).not.toHaveProperty('password');
    });
  });
});
