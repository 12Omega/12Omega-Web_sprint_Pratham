/**
 * Dummy data for dashboard and related pages
 * Used for development and preview purposes
 */

// Dashboard Stats
export const dashboardStats = {
  totalUsers: 1248,
  activeSessionsToday: 87,
  recentUsersChange: 12.5,
  totalRevenue: 125800,
  revenueChange: 8.2,
  totalBookings: 3567,
  bookingsChange: 5.7,
  occupancyRate: 78.3,
  occupancyChange: 3.1
};

// User Growth Data
export const userGrowthData = [
  { month: 'Jan', count: 850 },
  { month: 'Feb', count: 900 },
  { month: 'Mar', count: 950 },
  { month: 'Apr', count: 1000 },
  { month: 'May', count: 1050 },
  { month: 'Jun', count: 1100 },
  { month: 'Jul', count: 1150 },
  { month: 'Aug', count: 1200 },
  { month: 'Sep', count: 1248 }
];

// Daily Activity Data
export const dailyActivityData = [
  { time: '00:00', bookings: 5 },
  { time: '02:00', bookings: 3 },
  { time: '04:00', bookings: 2 },
  { time: '06:00', bookings: 8 },
  { time: '08:00', bookings: 15 },
  { time: '10:00', bookings: 12 },
  { time: '12:00', bookings: 18 },
  { time: '14:00', bookings: 16 },
  { time: '16:00', bookings: 14 },
  { time: '18:00', bookings: 20 },
  { time: '20:00', bookings: 13 },
  { time: '22:00', bookings: 9 }
];

// Earnings Data
export const earningsData = [
  { month: 'Jan', earnings: 9500 },
  { month: 'Feb', earnings: 10200 },
  { month: 'Mar', earnings: 11500 },
  { month: 'Apr', earnings: 12800 },
  { month: 'May', earnings: 13100 },
  { month: 'Jun', earnings: 14500 },
  { month: 'Jul', earnings: 15200 },
  { month: 'Aug', earnings: 16800 },
  { month: 'Sep', earnings: 17500 }
];

// Parking Spots Data
export const parkingSpotsData = {
  available: 45,
  occupied: 32,
  maintenance: 3,
  total: 80
};

// Recent Bookings
export const recentBookingsData = [
  {
    _id: 'b1',
    user: {
      name: 'John Smith',
      email: 'john@example.com'
    },
    parkingSpot: {
      _id: 'ps1',
      name: 'Spot A1',
      location: 'Level 1, Section A'
    },
    startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    duration: 2,
    totalCost: 15.00,
    status: 'active',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: 'b2',
    user: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com'
    },
    parkingSpot: {
      _id: 'ps2',
      name: 'Spot B3',
      location: 'Level 2, Section B'
    },
    startTime: new Date(Date.now() - 7200000).toISOString(),
    endTime: new Date(Date.now() + 1800000).toISOString(),
    duration: 2.5,
    totalCost: 18.75,
    status: 'active',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 10800000).toISOString()
  },
  {
    _id: 'b3',
    user: {
      name: 'Michael Brown',
      email: 'michael@example.com'
    },
    parkingSpot: {
      _id: 'ps3',
      name: 'Spot C2',
      location: 'Level 1, Section C'
    },
    startTime: new Date(Date.now() + 3600000).toISOString(),
    endTime: new Date(Date.now() + 10800000).toISOString(),
    duration: 2,
    totalCost: 15.00,
    status: 'active',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'b4',
    user: {
      name: 'Emily Davis',
      email: 'emily@example.com'
    },
    parkingSpot: {
      _id: 'ps4',
      name: 'Spot A4',
      location: 'Level 1, Section A'
    },
    startTime: new Date(Date.now() - 10800000).toISOString(),
    endTime: new Date(Date.now() - 3600000).toISOString(),
    duration: 2,
    totalCost: 15.00,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    _id: 'b5',
    user: {
      name: 'David Wilson',
      email: 'david@example.com'
    },
    parkingSpot: {
      _id: 'ps5',
      name: 'Spot D1',
      location: 'Level 3, Section D'
    },
    startTime: new Date(Date.now() + 7200000).toISOString(),
    endTime: new Date(Date.now() + 14400000).toISOString(),
    duration: 2,
    totalCost: 15.00,
    status: 'active',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 43200000).toISOString()
  }
];

// Payments Data
export const paymentsData = [
  {
    _id: 'p1',
    amount: 15.00,
    status: 'completed' as 'completed' | 'pending' | 'failed' | 'refunded',
    method: 'khalti' as 'khalti' | 'credit_card' | 'debit_card' | 'paypal' | 'cash',
    transactionId: 'txn_1234567890',
    booking: {
      _id: 'b1',
      parkingSpot: {
        spotNumber: 'A1',
        location: 'Level 1, Section A'
      },
      startTime: new Date(Date.now() - 86400000).toISOString(),
      endTime: new Date(Date.now() - 79200000).toISOString()
    },
    createdAt: new Date(Date.now() - 79000000).toISOString(),
    updatedAt: new Date(Date.now() - 79000000).toISOString()
  },
  {
    _id: 'p2',
    amount: 22.50,
    status: 'completed' as 'completed' | 'pending' | 'failed' | 'refunded',
    method: 'credit_card' as 'khalti' | 'credit_card' | 'debit_card' | 'paypal' | 'cash',
    transactionId: 'txn_0987654321',
    booking: {
      _id: 'b2',
      parkingSpot: {
        spotNumber: 'B3',
        location: 'Level 2, Section B'
      },
      startTime: new Date(Date.now() - 172800000).toISOString(),
      endTime: new Date(Date.now() - 162000000).toISOString()
    },
    createdAt: new Date(Date.now() - 161000000).toISOString(),
    updatedAt: new Date(Date.now() - 161000000).toISOString()
  },
  {
    _id: 'p3',
    amount: 18.75,
    status: 'completed' as 'completed' | 'pending' | 'failed' | 'refunded',
    method: 'khalti' as 'khalti' | 'credit_card' | 'debit_card' | 'paypal' | 'cash',
    transactionId: 'txn_2468135790',
    booking: {
      _id: 'b3',
      parkingSpot: {
        spotNumber: 'C2',
        location: 'Level 1, Section C'
      },
      startTime: new Date(Date.now() - 259200000).toISOString(),
      endTime: new Date(Date.now() - 252000000).toISOString()
    },
    createdAt: new Date(Date.now() - 251000000).toISOString(),
    updatedAt: new Date(Date.now() - 251000000).toISOString()
  },
  {
    _id: 'p4',
    amount: 30.00,
    status: 'completed' as 'completed' | 'pending' | 'failed' | 'refunded',
    method: 'cash' as 'khalti' | 'credit_card' | 'debit_card' | 'paypal' | 'cash',
    transactionId: 'txn_1357924680',
    booking: {
      _id: 'b4',
      parkingSpot: {
        spotNumber: 'A4',
        location: 'Level 1, Section A'
      },
      startTime: new Date(Date.now() - 345600000).toISOString(),
      endTime: new Date(Date.now() - 331200000).toISOString()
    },
    createdAt: new Date(Date.now() - 330000000).toISOString(),
    updatedAt: new Date(Date.now() - 330000000).toISOString()
  },
  {
    _id: 'p5',
    amount: 15.00,
    status: 'pending' as 'completed' | 'pending' | 'failed' | 'refunded',
    method: 'khalti' as 'khalti' | 'credit_card' | 'debit_card' | 'paypal' | 'cash',
    transactionId: 'txn_pending123',
    booking: {
      _id: 'b5',
      parkingSpot: {
        spotNumber: 'D1',
        location: 'Level 3, Section D'
      },
      startTime: new Date(Date.now() + 7200000).toISOString(),
      endTime: new Date(Date.now() + 14400000).toISOString()
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  }
];

// Payment Analytics Data
export const paymentAnalyticsData = {
  totalEarnings: 12580,
  earningsByMethod: [
    { _id: 'khalti', total: 8750 },
    { _id: 'credit_card', total: 2500 },
    { _id: 'cash', total: 1330 }
  ],
  earningsByParkingSpot: [
    { _id: { spotId: '1', spotName: 'Spot A1', location: 'Level 1, Section A' }, total: 3200, count: 16 },
    { _id: { spotId: '2', spotName: 'Spot B3', location: 'Level 2, Section B' }, total: 2800, count: 14 },
    { _id: { spotId: '3', spotName: 'Spot C2', location: 'Level 1, Section C' }, total: 2400, count: 12 },
    { _id: { spotId: '4', spotName: 'Spot A4', location: 'Level 1, Section A' }, total: 2100, count: 10 },
    { _id: { spotId: '5', spotName: 'Spot D1', location: 'Level 3, Section D' }, total: 2080, count: 8 }
  ],
  earningsByDay: [
    { _id: '2024-07-14', total: 450, count: 3 },
    { _id: '2024-07-15', total: 600, count: 4 },
    { _id: '2024-07-16', total: 300, count: 2 },
    { _id: '2024-07-17', total: 750, count: 5 },
    { _id: '2024-07-18', total: 900, count: 6 },
    { _id: '2024-07-19', total: 600, count: 4 },
    { _id: '2024-07-20', total: 450, count: 3 }
  ],
  paymentMethodDistribution: [
    { _id: 'khalti', count: 35 },
    { _id: 'credit_card', count: 10 },
    { _id: 'cash', count: 7 }
  ],
  dateRange: {
    startDate: '2024-06-20',
    endDate: '2024-07-20'
  }
};

// Vehicles Data
export const vehiclesData = [
  {
    _id: 'v1',
    licensePlate: 'ABC-1234',
    make: 'Toyota',
    model: 'Corolla',
    color: 'Silver',
    user: {
      _id: 'u1',
      name: 'John Smith',
      email: 'john@example.com'
    },
    createdAt: new Date(Date.now() - 2592000000).toISOString() // 30 days ago
  },
  {
    _id: 'v2',
    licensePlate: 'XYZ-5678',
    make: 'Honda',
    model: 'Civic',
    color: 'Blue',
    user: {
      _id: 'u2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com'
    },
    createdAt: new Date(Date.now() - 1728000000).toISOString() // 20 days ago
  },
  {
    _id: 'v3',
    licensePlate: 'DEF-9012',
    make: 'Ford',
    model: 'Focus',
    color: 'Red',
    user: {
      _id: 'u3',
      name: 'Michael Brown',
      email: 'michael@example.com'
    },
    createdAt: new Date(Date.now() - 864000000).toISOString() // 10 days ago
  },
  {
    _id: 'v4',
    licensePlate: 'GHI-3456',
    make: 'Nissan',
    model: 'Altima',
    color: 'Black',
    user: {
      _id: 'u4',
      name: 'Emily Davis',
      email: 'emily@example.com'
    },
    createdAt: new Date(Date.now() - 432000000).toISOString() // 5 days ago
  },
  {
    _id: 'v5',
    licensePlate: 'JKL-7890',
    make: 'Hyundai',
    model: 'Elantra',
    color: 'White',
    user: {
      _id: 'u5',
      name: 'David Wilson',
      email: 'david@example.com'
    },
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
];

// Parking Spots Detailed Data
export const parkingSpotsDetailedData = [
  {
    _id: 'ps1',
    name: 'Spot A1',
    location: 'Level 1, Section A',
    type: 'standard',
    status: 'available',
    rate: 7.50,
    features: ['covered', 'camera_surveillance'],
    dimensions: {
      length: 5.5,
      width: 2.5
    },
    createdAt: new Date(Date.now() - 7776000000).toISOString() // 90 days ago
  },
  {
    _id: 'ps2',
    name: 'Spot B3',
    location: 'Level 2, Section B',
    type: 'compact',
    status: 'occupied',
    rate: 6.00,
    features: ['covered'],
    dimensions: {
      length: 4.5,
      width: 2.2
    },
    createdAt: new Date(Date.now() - 7776000000).toISOString() // 90 days ago
  },
  {
    _id: 'ps3',
    name: 'Spot C2',
    location: 'Level 1, Section C',
    type: 'handicap',
    status: 'available',
    rate: 7.50,
    features: ['covered', 'camera_surveillance', 'handicap_accessible'],
    dimensions: {
      length: 6.0,
      width: 3.0
    },
    createdAt: new Date(Date.now() - 7776000000).toISOString() // 90 days ago
  },
  {
    _id: 'ps4',
    name: 'Spot A4',
    location: 'Level 1, Section A',
    type: 'standard',
    status: 'occupied',
    rate: 7.50,
    features: ['covered', 'camera_surveillance'],
    dimensions: {
      length: 5.5,
      width: 2.5
    },
    createdAt: new Date(Date.now() - 7776000000).toISOString() // 90 days ago
  },
  {
    _id: 'ps5',
    name: 'Spot D1',
    location: 'Level 3, Section D',
    type: 'large',
    status: 'maintenance',
    rate: 9.00,
    features: ['covered', 'camera_surveillance', 'ev_charging'],
    dimensions: {
      length: 6.5,
      width: 3.0
    },
    createdAt: new Date(Date.now() - 7776000000).toISOString() // 90 days ago
  }
];

// Reports Data
export const reportsData = {
  occupancyByHour: [
    { hour: '00:00', occupancyRate: 35 },
    { hour: '02:00', occupancyRate: 28 },
    { hour: '04:00', occupancyRate: 20 },
    { hour: '06:00', occupancyRate: 32 },
    { hour: '08:00', occupancyRate: 65 },
    { hour: '10:00', occupancyRate: 78 },
    { hour: '12:00', occupancyRate: 82 },
    { hour: '14:00', occupancyRate: 75 },
    { hour: '16:00', occupancyRate: 68 },
    { hour: '18:00', occupancyRate: 85 },
    { hour: '20:00', occupancyRate: 72 },
    { hour: '22:00', occupancyRate: 55 }
  ],
  revenueByDay: [
    { date: '2024-07-14', revenue: 1250 },
    { date: '2024-07-15', revenue: 1450 },
    { date: '2024-07-16', revenue: 1350 },
    { date: '2024-07-17', revenue: 1550 },
    { date: '2024-07-18', revenue: 1650 },
    { date: '2024-07-19', revenue: 1850 },
    { date: '2024-07-20', revenue: 1750 }
  ],
  popularParkingSpots: [
    { spotName: 'Spot A1', bookings: 45, revenue: 3200 },
    { spotName: 'Spot B3', bookings: 38, revenue: 2800 },
    { spotName: 'Spot C2', bookings: 32, revenue: 2400 },
    { spotName: 'Spot A4', bookings: 28, revenue: 2100 },
    { spotName: 'Spot D1', bookings: 25, revenue: 2080 }
  ],
  userStatistics: {
    totalUsers: 1248,
    newUsersThisMonth: 87,
    activeUsers: 625,
    averageBookingsPerUser: 2.8
  }
};