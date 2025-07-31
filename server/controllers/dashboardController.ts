import { Request, Response } from 'express';
import User from '../models/User';
import Booking from '../models/Booking';
import ParkingSpot from '../models/ParkingSpot';
import mongoose from 'mongoose';
import { asyncHandler } from '../middlewares/errorHandler';

// Extend Express Request type to include user
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Get dashboard statistics and data
 * @route GET /api/dashboard
 * @access Private (Admin and User)
 */
export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  
  // Get total users count (admin only)
  const totalUsers = isAdmin ? await User.countDocuments() : 0;
  
  // Get active sessions today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const activeSessionsQuery: any = {
    status: 'active',
    startTime: { $lte: new Date() },
    endTime: { $gte: new Date() }
  };
  
  // If not admin, only show user's bookings
  if (!isAdmin && userId) {
    activeSessionsQuery.user = new mongoose.Types.ObjectId(userId);
  }
  
  const activeSessionsToday = await Booking.countDocuments(activeSessionsQuery);
  
  // Get recent users change (last 7 days vs previous 7 days) - admin only
  let recentUsersChange = 0;
  
  if (isAdmin) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    const lastSevenDaysUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo, $lt: today }
    });
    
    const previousSevenDaysUsers = await User.countDocuments({
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
    });
    
    if (previousSevenDaysUsers > 0) {
      recentUsersChange = ((lastSevenDaysUsers - previousSevenDaysUsers) / previousSevenDaysUsers) * 100;
    } else if (lastSevenDaysUsers > 0) {
      recentUsersChange = 100; // 100% increase if there were no users before
    }
  }
  
  // Get session activity for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    return date;
  }).reverse();
  
  const sessionActivityPromises = last7Days.map(async (date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const query: any = {
      startTime: { $gte: date, $lt: nextDay }
    };
    
    // If not admin, only show user's bookings
    if (!isAdmin && userId) {
      query.user = new mongoose.Types.ObjectId(userId);
    }
    
    const count = await Booking.countDocuments(query);
    
    return {
      date: date.toISOString().split('T')[0],
      count
    };
  });
  
  const sessionActivity = await Promise.all(sessionActivityPromises);
  
  // Get user growth data for the last 12 months (admin only)
  let userGrowth: Array<{ month: string; count: number }> = [];
  
  if (isAdmin) {
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      return date;
    }).reverse();
    
    const userGrowthPromises = last12Months.map(async (date) => {
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const count = await User.countDocuments({
        createdAt: { $gte: date, $lt: nextMonth }
      });
      
      return {
        month: date.toISOString().split('T')[0].substring(0, 7),
        count
      };
    });
    
    userGrowth = await Promise.all(userGrowthPromises);
  }
  
  // Get parking spot availability
  const availableSpotsCount = await ParkingSpot.countDocuments({ status: 'available' });
  const occupiedSpotsCount = await ParkingSpot.countDocuments({ status: 'occupied' });
  const maintenanceSpotsCount = await ParkingSpot.countDocuments({ status: 'maintenance' });
  const totalSpotsCount = await ParkingSpot.countDocuments();
  
  // Get recent bookings
  const bookingsQuery: any = {};
  
  // If not admin, only show user's bookings
  if (!isAdmin && userId) {
    bookingsQuery.user = new mongoose.Types.ObjectId(userId);
  }
  
  const recentBookings = await Booking.find(bookingsQuery)
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .populate('parkingSpot', 'name location rate');
  
  // Get earnings data for the last 6 months
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  }).reverse();
  
  const earningsPromises = last6Months.map(async (date) => {
    const nextMonth = new Date(date);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const query: any = {
      status: 'completed',
      endTime: { $gte: date, $lt: nextMonth }
    };
    
    // If not admin, only show user's bookings
    if (!isAdmin && userId) {
      query.user = new mongoose.Types.ObjectId(userId);
    }
    
    const bookings = await Booking.find(query);
    
    const totalEarnings = bookings.reduce((sum, booking) => sum + (booking.totalCost || 0), 0);
    
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      earnings: totalEarnings
    };
  });
  
  const earningsData = await Promise.all(earningsPromises);
  
  // Return dashboard data
  res.status(200).json({
    totalUsers,
    activeSessionsToday,
    recentUsersChange,
    sessionActivity,
    userGrowth,
    parkingSpots: {
      available: availableSpotsCount,
      occupied: occupiedSpotsCount,
      maintenance: maintenanceSpotsCount,
      total: totalSpotsCount
    },
    recentBookings,
    earningsData
  });
});