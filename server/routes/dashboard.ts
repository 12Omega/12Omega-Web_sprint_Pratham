import express, { Router, Request, Response } from 'express';
import moment from 'moment';
import { IUser } from '../models/User'; // Assuming IUser might be on req.user

const router: Router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: IUser; // Or a more specific type for your user object
  query: {
    start?: string;
    end?: string;
  }
}

router.get('/history', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { start, end } = req.query;

    const startDate = start && moment(start, 'YYYY-MM-DD', true).isValid() ? moment(start).toDate() : moment().subtract(6, 'days').startOf('day').toDate();
    const endDate = end && moment(end, 'YYYY-MM-DD', true).isValid() ? moment(end).toDate() : moment().endOf('day').toDate();

    if (moment(startDate).isAfter(moment(endDate))) {
      return res.status(400).json({ message: 'Start date cannot be after end date.' });
    }

    const userGrowth: Array<{ date: string; count: number }> = [];
    const sessionActivity: Array<{ date: string; activeSessions: number }> = [];

    let current = moment(startDate);
    while (current.isSameOrBefore(moment(endDate), 'day')) {
      userGrowth.push({
        date: current.format('YYYY-MM-DD'),
        count: Math.floor(Math.random() * 100) + 50, // Sample data
      });
      sessionActivity.push({
        date: current.format('YYYY-MM-DD'),
        activeSessions: Math.floor(Math.random() * 50) + 10, // Sample data
      });
      current.add(1, 'days');
    }

    // Sample overall stats
    const totalUsers = 500 + Math.floor(Math.random() * 100); // Sample data
    const activeSessionsToday = 42 + Math.floor(Math.random() * 10); // Sample data
    const recentUsersChange = (Math.random() * 10).toFixed(2); // Sample data

    res.json({
      totalUsers,
      activeSessionsToday,
      recentUsersChange,
      userGrowth,
      sessionActivity,
      userRole: req.user?.username || 'guest', // Example: Tying to user property if available
      queryReceived: { start: req.query.start, end: req.query.end } // Echoing back query params for clarity
    });

  } catch (error: any) {
    console.error('Error fetching dashboard history data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;

