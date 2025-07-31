/**
 * Parking Spot Controller - Handle parking spot operations
 */

import { Request, Response } from 'express';
import ParkingSpot, { IParkingSpot } from '../models/ParkingSpot';
import { asyncHandler, createError } from '../middlewares/errorHandler';

/**
 * Build HATEOAS links for parking spot
 */
const buildSpotLinks = (spotId: string, userRole?: string) => {
  const links = [
    { rel: 'self', href: `/api/spots/${spotId}` },
    { rel: 'book', href: '/api/bookings', method: 'POST' },
    { rel: 'all-spots', href: '/api/spots' }
  ];

  if (userRole === 'admin') {
    links.push(
      { rel: 'update', href: `/api/spots/${spotId}`, method: 'PUT' },
      { rel: 'delete', href: `/api/spots/${spotId}`, method: 'DELETE' },
      { rel: 'update-status', href: `/api/spots/${spotId}/status`, method: 'PATCH' }
    );
  }

  return links;
};

export const spotController = {
  /**
   * @desc    Get all parking spots with filtering, sorting, and pagination
   * @route   GET /api/spots
   * @access  Public
   */
  getAllSpots: asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }
    if (req.query.minRate || req.query.maxRate) {
      filter.hourlyRate = {};
      if (req.query.minRate) filter.hourlyRate.$gte = parseFloat(req.query.minRate as string);
      if (req.query.maxRate) filter.hourlyRate.$lte = parseFloat(req.query.maxRate as string);
    }

    // Build sort object
    const sort: any = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort.createdAt = -1; // Default sort by newest first
    }

    // Execute query
    const [spots, total] = await Promise.all([
      ParkingSpot.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ParkingSpot.countDocuments(filter)
    ]);

    // Add HATEOAS links to each spot
    const spotsWithLinks = spots.map(spot => ({
      ...spot,
      links: buildSpotLinks(spot._id.toString(), req.user?.role)
    }));

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      message: 'Parking spots retrieved successfully',
      data: {
        spots: spotsWithLinks,
        pagination: {
          currentPage: page,
          totalPages,
          totalSpots: total,
          hasNextPage,
          hasPrevPage,
          limit
        }
      },
      links: [
        { rel: 'self', href: `/api/spots?page=${page}&limit=${limit}` },
        ...(hasNextPage ? [{ rel: 'next', href: `/api/spots?page=${page + 1}&limit=${limit}` }] : []),
        ...(hasPrevPage ? [{ rel: 'prev', href: `/api/spots?page=${page - 1}&limit=${limit}` }] : []),
        { rel: 'create', href: '/api/spots', method: 'POST' }
      ]
    });
  }),

  /**
   * @desc    Get single parking spot by ID
   * @route   GET /api/spots/:id
   * @access  Public
   */
  getSpotById: asyncHandler(async (req: Request, res: Response) => {
    const spot = await ParkingSpot.findById(req.params.id);

    if (!spot) {
      throw createError('Parking spot not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Parking spot retrieved successfully',
      data: {
        spot: {
          ...spot.toJSON(),
          links: buildSpotLinks(spot._id.toString(), req.user?.role)
        }
      }
    });
  }),

  /**
   * @desc    Create new parking spot
   * @route   POST /api/spots
   * @access  Private (Admin only)
   */
  createSpot: asyncHandler(async (req: Request, res: Response) => {
    const spot = await ParkingSpot.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Parking spot created successfully',
      data: {
        spot: {
          ...spot.toJSON(),
          links: buildSpotLinks(spot._id.toString(), req.user?.role)
        }
      }
    });
  }),

  /**
   * @desc    Update parking spot
   * @route   PUT /api/spots/:id
   * @access  Private (Admin only)
   */
  updateSpot: asyncHandler(async (req: Request, res: Response) => {
    const spot = await ParkingSpot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!spot) {
      throw createError('Parking spot not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Parking spot updated successfully',
      data: {
        spot: {
          ...spot.toJSON(),
          links: buildSpotLinks(spot._id.toString(), req.user?.role)
        }
      }
    });
  }),

  /**
   * @desc    Update parking spot status
   * @route   PATCH /api/spots/:id/status
   * @access  Private (Admin only)
   */
  updateSpotStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!['available', 'occupied', 'reserved', 'maintenance'].includes(status)) {
      throw createError('Invalid status value', 400);
    }

    const spot = await ParkingSpot.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!spot) {
      throw createError('Parking spot not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Parking spot status updated successfully',
      data: {
        spot: {
          ...spot.toJSON(),
          links: buildSpotLinks(spot._id.toString(), req.user?.role)
        }
      }
    });
  }),

  /**
   * @desc    Delete parking spot
   * @route   DELETE /api/spots/:id
   * @access  Private (Admin only)
   */
  deleteSpot: asyncHandler(async (req: Request, res: Response) => {
    const spot = await ParkingSpot.findByIdAndDelete(req.params.id);

    if (!spot) {
      throw createError('Parking spot not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Parking spot deleted successfully',
      data: null,
      links: [
        { rel: 'all-spots', href: '/api/spots' },
        { rel: 'create', href: '/api/spots', method: 'POST' }
      ]
    });
  }),

  /**
   * @desc    Get nearby parking spots
   * @route   GET /api/spots/nearby/:lat/:lng
   * @access  Public
   */
  getNearbySpots: asyncHandler(async (req: Request, res: Response) => {
    const { lat, lng } = req.params;
    const radius = parseFloat(req.query.radius as string) || 1000; // Default 1km radius
    const limit = parseInt(req.query.limit as string) || 10;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw createError('Invalid coordinates provided', 400);
    }

    const spots = await ParkingSpot.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radius
        }
      },
      status: 'available'
    }).limit(limit);

    const spotsWithLinks = spots.map(spot => ({
      ...spot.toJSON(),
      links: buildSpotLinks(spot._id.toString(), req.user?.role)
    }));

    res.status(200).json({
      success: true,
      message: 'Nearby parking spots retrieved successfully',
      data: {
        spots: spotsWithLinks,
        searchCenter: { latitude, longitude },
        radius,
        count: spots.length
      },
      links: [
        { rel: 'all-spots', href: '/api/spots' }
      ]
    });
  })
};