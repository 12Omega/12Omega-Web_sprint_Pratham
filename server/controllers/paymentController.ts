import { Request, Response } from 'express';
import axios from 'axios';
import { asyncHandler } from '../middlewares/errorHandler';
import Booking, { IBooking } from '../models/Booking';
import Payment, { IPayment } from '../models/Payment';
import { IUser } from '../models/User';
import mongoose from 'mongoose';

// Extend Express Request type to include user
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Interfaces for populated documents
interface PopulatedUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
}

interface PopulatedParkingSpot extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  location: string;
  rate: number;
}

interface PopulatedBooking extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  parkingSpot: PopulatedParkingSpot;
  startTime: Date;
  endTime: Date;
  duration: number;
}

interface PopulatedPayment extends Omit<IPayment, 'user' | 'booking'> {
  _id: mongoose.Types.ObjectId;
  user: PopulatedUser;
  booking: PopulatedBooking;
}

/**
 * Verify Khalti payment
 * @route POST /api/payments/verify-khalti
 * @access Private
 */
export const verifyKhaltiPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token, amount, bookingId } = req.body;
  
  if (!token || !amount || !bookingId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: token, amount, or bookingId'
    });
  }
  
  try {
    // Verify the payment with Khalti API
    const response = await axios.post(
      'https://khalti.com/api/v2/payment/verify/',
      {
        token,
        amount
      },
      {
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY || 'test_secret_key_5c9e36656c6a4562b96c1d8287c633fb'}`
        }
      }
    );
    
    // If payment is verified, update the booking and create a payment record
    if (response.data && response.data.idx) {
      // Find the booking
      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
      
      // Check if the user is authorized to make this payment
      if (booking.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to make payment for this booking'
        });
      }
      
      // Create a payment record
      const payment = await Payment.create({
        user: req.user?.id,
        booking: bookingId,
        amount: amount / 100, // Convert from paisa to NPR
        method: 'khalti',
        status: 'completed',
        transactionId: response.data.idx,
        paymentDetails: response.data
      });
      
      // Update the booking status
      booking.paymentStatus = 'paid';
      await booking.save();
      
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          payment,
          khaltiResponse: response.data
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        data: response.data
      });
    }
  } catch (error: any) {
    console.error('Khalti verification error:', error.response?.data || error.message);
    
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.response?.data || error.message
    });
  }
});

/**
 * Get payment history
 * @route GET /api/payments
 * @access Private
 */
export const getPaymentHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  
  const query: any = {};
  
  // If not admin, only show user's payments
  if (!isAdmin && userId) {
    query.user = userId;
  }
  
  // Filter by status if provided
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  // Filter by date range if provided
  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate as string),
      $lte: new Date(req.query.endDate as string)
    };
  }
  
  const payments = await Payment.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .populate({
      path: 'booking',
      populate: {
        path: 'parkingSpot',
        select: 'name location'
      }
    }) as unknown as PopulatedPayment[];
  
  const total = await Payment.countDocuments(query);
  
  return res.status(200).json({
    success: true,
    message: 'Payment history retrieved successfully',
    data: payments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
});

/**
 * Get payment by ID
 * @route GET /api/payments/:id
 * @access Private
 */
export const getPaymentById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  
  const payment = await Payment.findById(req.params.id)
    .populate('user', 'name email')
    .populate({
      path: 'booking',
      populate: {
        path: 'parkingSpot',
        select: 'name location'
      }
    }) as unknown as PopulatedPayment;
  
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }
  
  // Check if the user is authorized to view this payment
  if (payment.user._id.toString() !== userId && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to view this payment'
    });
  }
  
  return res.status(200).json({
    success: true,
    message: 'Payment retrieved successfully',
    data: payment
  });
});

/**
 * Get payment receipt
 * @route GET /api/payments/:id/receipt
 * @access Private
 */
export const getPaymentReceipt = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  
  const payment = await Payment.findById(req.params.id)
    .populate('user', 'name email')
    .populate({
      path: 'booking',
      populate: {
        path: 'parkingSpot',
        select: 'name location rate'
      }
    }) as unknown as PopulatedPayment;
  
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }
  
  // Check if the user is authorized to view this payment
  if (payment.user._id.toString() !== userId && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to view this payment receipt'
    });
  }
  
  // Generate receipt data
  const receipt = {
    receiptNumber: `RCPT-${payment._id.toString().substring(0, 8).toUpperCase()}`,
    paymentId: payment._id,
    transactionId: payment.transactionId,
    date: payment.createdAt,
    customerName: payment.user.name,
    customerEmail: payment.user.email,
    paymentMethod: payment.method,
    status: payment.status,
    bookingDetails: {
      bookingId: payment.booking._id,
      parkingSpot: payment.booking.parkingSpot.name,
      location: payment.booking.parkingSpot.location,
      startTime: payment.booking.startTime,
      endTime: payment.booking.endTime,
      duration: payment.booking.duration,
      rate: payment.booking.parkingSpot.rate
    },
    amount: payment.amount,
    currency: 'NPR'
  };
  
  return res.status(200).json({
    success: true,
    message: 'Payment receipt generated successfully',
    data: receipt
  });
});

/**
 * Get payment analytics
 * @route GET /api/payments/analytics
 * @access Private (Admin)
 */
export const getPaymentAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Check if user is admin
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  
  // Get date range from query params or use default (last 30 days)
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
  const startDate = req.query.startDate 
    ? new Date(req.query.startDate as string) 
    : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  
  // Base query for completed payments within date range
  const baseQuery = {
    status: 'completed',
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  // Get total earnings
  const totalEarnings = await Payment.aggregate([
    { $match: baseQuery },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  
  // Get earnings by payment method
  const earningsByMethod = await Payment.aggregate([
    { $match: baseQuery },
    { $group: { _id: '$method', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } }
  ]);
  
  // Get earnings by parking spot
  const earningsByParkingSpot = await Payment.aggregate([
    { $match: baseQuery },
    { 
      $lookup: {
        from: 'bookings',
        localField: 'booking',
        foreignField: '_id',
        as: 'bookingData'
      }
    },
    { $unwind: '$bookingData' },
    {
      $lookup: {
        from: 'parkingspots',
        localField: 'bookingData.parkingSpot',
        foreignField: '_id',
        as: 'spotData'
      }
    },
    { $unwind: '$spotData' },
    {
      $group: {
        _id: {
          spotId: '$spotData._id',
          spotName: '$spotData.name',
          location: '$spotData.location'
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } }
  ]);
  
  // Get earnings by day
  const earningsByDay = await Payment.aggregate([
    { $match: baseQuery },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  // Get payment method distribution
  const paymentMethodDistribution = await Payment.aggregate([
    { $match: baseQuery },
    { $group: { _id: '$method', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  return res.status(200).json({
    success: true,
    message: 'Payment analytics retrieved successfully',
    data: {
      totalEarnings: totalEarnings.length > 0 ? totalEarnings[0].total : 0,
      earningsByMethod,
      earningsByParkingSpot,
      earningsByDay,
      paymentMethodDistribution,
      dateRange: {
        startDate,
        endDate
      }
    }
  });
});

export default {
  verifyKhaltiPayment,
  getPaymentHistory,
  getPaymentById,
  getPaymentReceipt,
  getPaymentAnalytics
};