/**
 * Booking Controller - Handle parking spot booking operations
 */

import { Request, Response } from 'express';
import Booking, { IBooking } from '../models/Booking';
import ParkingSpot from '../models/ParkingSpot';
import { asyncHandler, createError } from '../middlewares/errorHandler';

/**
 * Build HATEOAS links for booking
 */
const buildBookingLinks = (bookingId: string, booking: IBooking, userRole?: string) => {
  const links = [
    { rel: 'self', href: `/api/bookings/${bookingId}` },
    { rel: 'spot', href: `/api/spots/${booking.parkingSpot}` },
    { rel: 'user-bookings', href: '/api/bookings' }
  ];

  if (booking.status === 'active') {
    links.push(
      { rel: 'cancel', href: `/api/bookings/${bookingId}/cancel`, method: 'PATCH' },
      { rel: 'complete', href: `/api/bookings/${bookingId}/complete`, method: 'PATCH' }
    );
  }

  if (userRole === 'admin') {
    links.push(
      { rel: 'update', href: `/api/bookings/${bookingId}`, method: 'PUT' },
      { rel: 'delete', href: `/api/bookings/${bookingId}`, method: 'DELETE' }
    );
  }

  return links;
};

/**
 * Check for booking conflicts
 */
const checkBookingConflicts = async (spotId: string, startTime: Date, endTime: Date, excludeBookingId?: string) => {
  const conflictQuery: any = {
    parkingSpot: spotId,
    status: { $in: ['active', 'reserved'] },
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
    ]
  };

  if (excludeBookingId) {
    conflictQuery._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(conflictQuery);
  return conflictingBooking;
};

export const bookingController = {
  /**
   * @desc    Get user's bookings or all bookings (admin)
   * @route   GET /api/bookings
   * @access  Private
   */
  getBookings: asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter - users see only their bookings, admins see all
    const filter: any = req.user!.role === 'admin' ? {} : { user: req.user!._id };

    // Add status filter if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Execute query with population
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('user', 'name email')
        .populate('parkingSpot', 'spotNumber location address hourlyRate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(filter)
    ]);

    // Add HATEOAS links to each booking
    const bookingsWithLinks = bookings.map(booking => ({
      ...booking,
      links: buildBookingLinks(booking._id.toString(), booking as IBooking, req.user!.role)
    }));

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings: bookingsWithLinks,
        pagination: {
          currentPage: page,
          totalPages,
          totalBookings: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit
        }
      },
      links: [
        { rel: 'self', href: `/api/bookings?page=${page}&limit=${limit}` },
        { rel: 'create', href: '/api/bookings', method: 'POST' }
      ]
    });
  }),

  /**
   * @desc    Get single booking by ID
   * @route   GET /api/bookings/:id
   * @access  Private
   */
  getBookingById: asyncHandler(async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('parkingSpot', 'spotNumber location address coordinates hourlyRate type features');

    if (!booking) {
      throw createError('Booking not found', 404);
    }

    // Check if user can access this booking
    if (req.user!.role !== 'admin' && booking.user._id.toString() !== req.user!._id.toString()) {
      throw createError('Access denied', 403);
    }

    res.status(200).json({
      success: true,
      message: 'Booking retrieved successfully',
      data: {
        booking: {
          ...booking.toJSON(),
          links: buildBookingLinks(booking._id.toString(), booking, req.user!.role)
        }
      }
    });
  }),

  /**
   * @desc    Create new booking
   * @route   POST /api/bookings
   * @access  Private
   */
  createBooking: asyncHandler(async (req: Request, res: Response) => {
    const { parkingSpot, startTime, endTime, vehicleInfo, notes } = req.body;

    // Check if parking spot exists and is available
    const spot = await ParkingSpot.findById(parkingSpot);
    if (!spot) {
      throw createError('Parking spot not found', 404);
    }

    if (spot.status !== 'available') {
      throw createError('Parking spot is not available', 400);
    }

    // Check for booking conflicts
    const conflict = await checkBookingConflicts(parkingSpot, new Date(startTime), new Date(endTime));
    if (conflict) {
      throw createError('Parking spot is already booked for the selected time period', 409);
    }

    // Calculate duration and total cost
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
    const totalCost = duration * spot.hourlyRate;

    // Create booking
    const booking = await Booking.create({
      user: req.user!._id,
      parkingSpot,
      startTime: start,
      endTime: end,
      duration,
      totalCost,
      vehicleInfo,
      notes
    });

    // Update spot status to reserved
    await ParkingSpot.findByIdAndUpdate(parkingSpot, { status: 'reserved' });

    // Populate the created booking
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('parkingSpot', 'spotNumber location address hourlyRate');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: {
          ...populatedBooking!.toJSON(),
          links: buildBookingLinks(booking._id.toString(), booking, req.user!.role)
        }
      }
    });
  }),

  /**
   * @desc    Update booking
   * @route   PUT /api/bookings/:id
   * @access  Private
   */
  updateBooking: asyncHandler(async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw createError('Booking not found', 404);
    }

    // Check if user can update this booking
    if (req.user!.role !== 'admin' && booking.user.toString() !== req.user!._id.toString()) {
      throw createError('Access denied', 403);
    }

    // Don't allow updates to completed or cancelled bookings
    if (['completed', 'cancelled'].includes(booking.status)) {
      throw createError('Cannot update completed or cancelled booking', 400);
    }

    const { startTime, endTime, vehicleInfo, notes } = req.body;

    // If time is being updated, check for conflicts
    if (startTime || endTime) {
      const newStartTime = startTime ? new Date(startTime) : booking.startTime;
      const newEndTime = endTime ? new Date(endTime) : booking.endTime;

      const conflict = await checkBookingConflicts(
        booking.parkingSpot.toString(),
        newStartTime,
        newEndTime,
        booking._id.toString()
      );

      if (conflict) {
        throw createError('Updated time conflicts with another booking', 409);
      }

      // Recalculate cost if time changed
      if (startTime || endTime) {
        const spot = await ParkingSpot.findById(booking.parkingSpot);
        const duration = (newEndTime.getTime() - newStartTime.getTime()) / (1000 * 60 * 60);
        booking.duration = duration;
        booking.totalCost = duration * spot!.hourlyRate;
        booking.startTime = newStartTime;
        booking.endTime = newEndTime;
      }
    }

    // Update other fields
    if (vehicleInfo) booking.vehicleInfo = { ...booking.vehicleInfo, ...vehicleInfo };
    if (notes !== undefined) booking.notes = notes;

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('parkingSpot', 'spotNumber location address hourlyRate');

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: {
        booking: {
          ...updatedBooking!.toJSON(),
          links: buildBookingLinks(booking._id.toString(), booking, req.user!.role)
        }
      }
    });
  }),

  /**
   * @desc    Cancel booking
   * @route   PATCH /api/bookings/:id/cancel
   * @access  Private
   */
  cancelBooking: asyncHandler(async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw createError('Booking not found', 404);
    }

    // Check if user can cancel this booking
    if (req.user!.role !== 'admin' && booking.user.toString() !== req.user!._id.toString()) {
      throw createError('Access denied', 403);
    }

    if (booking.status !== 'active') {
      throw createError('Only active bookings can be cancelled', 400);
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update spot status back to available
    await ParkingSpot.findByIdAndUpdate(booking.parkingSpot, { status: 'available' });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking: {
          ...booking.toJSON(),
          links: buildBookingLinks(booking._id.toString(), booking, req.user!.role)
        }
      }
    });
  }),

  /**
   * @desc    Complete booking
   * @route   PATCH /api/bookings/:id/complete
   * @access  Private
   */
  completeBooking: asyncHandler(async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw createError('Booking not found', 404);
    }

    // Check if user can complete this booking
    if (req.user!.role !== 'admin' && booking.user.toString() !== req.user!._id.toString()) {
      throw createError('Access denied', 403);
    }

    if (booking.status !== 'active') {
      throw createError('Only active bookings can be completed', 400);
    }

    // Update booking status
    booking.status = 'completed';
    booking.paymentStatus = 'paid'; // Assume payment is processed
    await booking.save();

    // Update spot status back to available
    await ParkingSpot.findByIdAndUpdate(booking.parkingSpot, { status: 'available' });

    res.status(200).json({
      success: true,
      message: 'Booking completed successfully',
      data: {
        booking: {
          ...booking.toJSON(),
          links: buildBookingLinks(booking._id.toString(), booking, req.user!.role)
        }
      }
    });
  }),

  /**
   * @desc    Delete booking (admin only)
   * @route   DELETE /api/bookings/:id
   * @access  Private (Admin only)
   */
  deleteBooking: asyncHandler(async (req: Request, res: Response) => {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      throw createError('Booking not found', 404);
    }

    // If booking was active, update spot status
    if (booking.status === 'active') {
      await ParkingSpot.findByIdAndUpdate(booking.parkingSpot, { status: 'available' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: null,
      links: [
        { rel: 'all-bookings', href: '/api/bookings' }
      ]
    });
  }),

  /**
   * @desc    Get bookings for a specific spot
   * @route   GET /api/bookings/spot/:spotId
   * @access  Private (Admin only)
   */
  getSpotBookings: asyncHandler(async (req: Request, res: Response) => {
    const { spotId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check if spot exists
    const spot = await ParkingSpot.findById(spotId);
    if (!spot) {
      throw createError('Parking spot not found', 404);
    }

    const [bookings, total] = await Promise.all([
      Booking.find({ parkingSpot: spotId })
        .populate('user', 'name email')
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments({ parkingSpot: spotId })
    ]);

    const bookingsWithLinks = bookings.map(booking => ({
      ...booking,
      links: buildBookingLinks(booking._id.toString(), booking as IBooking, req.user!.role)
    }));

    res.status(200).json({
      success: true,
      message: 'Spot bookings retrieved successfully',
      data: {
        spot: {
          id: spot._id,
          spotNumber: spot.spotNumber,
          location: spot.location
        },
        bookings: bookingsWithLinks,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBookings: total,
          limit
        }
      },
      links: [
        { rel: 'spot', href: `/api/spots/${spotId}` },
        { rel: 'all-bookings', href: '/api/bookings' }
      ]
    });
  })
};