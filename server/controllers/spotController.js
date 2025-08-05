const ParkingSpot = require('../models/ParkingSpot.js');

const getAllSpots = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }

    // Build sort object
    const sort = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
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

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      message: 'Parking spots retrieved successfully',
      data: spots,
      links: [
        { rel: 'self', href: `/api/spots?page=${page}&limit=${limit}` },
        ...(hasNextPage ? [{ rel: 'next', href: `/api/spots?page=${page + 1}&limit=${limit}` }] : []),
        ...(hasPrevPage ? [{ rel: 'prev', href: `/api/spots?page=${page - 1}&limit=${limit}` }] : [])
      ]
    });
  } catch (err) {
    console.error('Get spots error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllSpots
};