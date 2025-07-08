import { Router, Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User'; // For req.body typing and req.user
import { authenticateToken } from '../middleware/auth';
import { UserService } from '../services/userService';
// import mongoose from 'mongoose'; // Not directly needed if service handles ID validation

const router = Router();

// Custom request interface to include user from authenticateToken
interface AuthenticatedRequest extends Request {
  user?: IUser; // from authenticateToken
}

// Middleware to check if user is an admin
const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Requires admin privileges.' });
  }
};

// Create a new user (Admin only)
router.post('/', authenticateToken, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Service expects all fields, even if optional, from IUser for creation
    const userData: Partial<IUser> = req.body; 
    const newUser = await UserService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message, errors: error.errors, field: error.field });
    }
    next(error);
  }
});

// Get all users (Admin only for full list, basic filtering/sorting)
router.get('/', authenticateToken, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const queryParams = {
      role: req.query.role as string | undefined,
      isActive: req.query.isActive as string | undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: req.query.sortOrder as string | undefined,
      page: req.query.page as string | undefined,
      limit: req.query.limit as string | undefined,
    };
    const result = await UserService.getAllUsers(queryParams);

    const usersWithLinks = result.data.map(user => ({
      ...user, // user is already a plain object, password excluded by service
      _links: { self: { href: `/api/users/${user._id}` } }
    }));
    
    const page = result.pagination.currentPage;
    const limit = result.pagination.limit;
    const totalPages = result.pagination.totalPages;

    let existingQueryString = '';
    for (const key in req.query) {
        if (key !== 'page' && key !== 'limit') {
            if (existingQueryString === '') existingQueryString += '?';
            else existingQueryString += '&';
            existingQueryString += `${encodeURIComponent(key)}=${encodeURIComponent(req.query[key] as string)}`;
        }
    }
    if(existingQueryString !== '' && !existingQueryString.startsWith('?')) existingQueryString = `?${existingQueryString}`;

    const collectionLinks: any = {
        self: { href: `/api/users${existingQueryString}${existingQueryString ? '&' : '?'}page=${page}&limit=${limit}` },
        first: { href: `/api/users${existingQueryString}${existingQueryString ? '&' : '?'}page=1&limit=${limit}` }
    };
    if (page > 1) collectionLinks.prev = { href: `/api/users${existingQueryString}${existingQueryString ? '&' : '?'}page=${page - 1}&limit=${limit}` };
    if (page < totalPages) collectionLinks.next = { href: `/api/users${existingQueryString}${existingQueryString ? '&' : '?'}page=${page + 1}&limit=${limit}` };
    if (totalPages > 0) collectionLinks.last = { href: `/api/users${existingQueryString}${existingQueryString ? '&' : '?'}page=${totalPages}&limit=${limit}` };
    
    res.status(200).json({ 
        data: usersWithLinks,
        pagination: result.pagination,
        _links: collectionLinks
    });
  } catch (error: any) {
    next(error);
  }
});

// Get a single user by ID (Admin or user themselves)
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Permission check: Admin or the user themselves
    if (req.user?.role !== 'admin' && req.user?._id.toString() !== req.params.id) {
        return res.status(403).json({ message: 'Forbidden: You can only access your own profile or you need admin rights.' });
    }

    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ETag and Last-Modified (assuming service returns lean objects with __v and timestamps)
    const etag = `"${new Date(user.updatedAt || user.createdAt!).getTime()}-${(user as any).__v}"`;
    res.setHeader('ETag', etag);
     if (user.updatedAt || user.createdAt) {
        res.setHeader('Last-Modified', (user.updatedAt || user.createdAt!).toUTCString());
    }


    if (req.headers['if-none-match'] === etag) {
      return res.status(304).send();
    }
    
    const userWithLinks = {
        ...user,
        _links: {
            self: { href: `/api/users/${user._id}` },
            collection: { href: '/api/users' }
        }
    };
    res.status(200).json(userWithLinks);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    next(error);
  }
});

// Update an existing user by ID (Admin or user themselves for certain fields)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updateData: Partial<IUser> = req.body;
    // Pass the authenticated user (req.user) to the service for permission checks
    const updatedUser = await UserService.updateUser(req.params.id, updateData, req.user); 
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found or update failed' });
    }
    res.status(200).json(updatedUser);
  } catch (error: any) {
     if (error.status) {
      return res.status(error.status).json({ message: error.message, errors: error.errors, field: error.field });
    }
    next(error);
  }
});

// Delete a user by ID (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deletedUser = await UserService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found for deletion' });
    }
    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    next(error);
  }
});

export default router;
