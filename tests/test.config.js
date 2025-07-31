/**
 * ParkEase Test Configuration
 * Central configuration for all test suites
 */

module.exports = {
  // Test environment settings
  environment: {
    NODE_ENV: 'test',
    API_BASE_URL: 'http://localhost:5000/api',
    FRONTEND_URL: 'http://localhost:3000',
    TEST_TIMEOUT: 30000, // 30 seconds
  },

  // Database settings for testing
  database: {
    MONGODB_URI: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/parkease_test',
    DROP_DATABASE_BEFORE_TESTS: true,
    SEED_TEST_DATA: true,
  },

  // Test user credentials for authentication tests
  testUsers: {
    admin: {
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'testpassword123',
      role: 'admin'
    },
    user: {
      name: 'Test User',
      email: 'user@test.com', 
      password: 'testpassword123',
      role: 'user'
    }
  },

  // API endpoints for testing
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      profile: '/auth/profile',
      logout: '/auth/logout'
    },
    dashboard: {
      stats: '/dashboard',
      earnings: '/dashboard/earnings',
      userGrowth: '/dashboard/user-growth'
    },
    spots: {
      list: '/spots',
      create: '/spots',
      update: '/spots/:id',
      delete: '/spots/:id'
    },
    bookings: {
      list: '/bookings',
      create: '/bookings',
      update: '/bookings/:id',
      cancel: '/bookings/:id/cancel'
    },
    payments: {
      initiate: '/payments/initiate',
      verify: '/payments/verify',
      history: '/payments/history'
    }
  },

  // Test data samples
  sampleData: {
    parkingSpot: {
      name: 'Test Parking Spot',
      location: {
        address: '123 Test Street',
        lat: 40.7128,
        lng: -74.0060
      },
      pricePerHour: 5.00,
      amenities: ['covered', 'security'],
      status: 'available'
    },
    booking: {
      startTime: new Date(Date.now() + 3600000), // 1 hour from now
      endTime: new Date(Date.now() + 7200000),   // 2 hours from now
      vehicleInfo: {
        licensePlate: 'TEST123',
        make: 'Toyota',
        model: 'Camry',
        color: 'Blue'
      }
    },
    payment: {
      amount: 10.00,
      paymentMethod: 'khalti',
      currency: 'NPR'
    }
  },

  // Test reporting settings
  reporting: {
    generateCoverageReport: true,
    coverageThreshold: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    },
    outputFormats: ['console', 'json', 'html']
  },

  // Retry settings for flaky tests
  retry: {
    maxRetries: 3,
    retryDelay: 1000 // 1 second
  },

  // Browser settings for frontend tests
  browser: {
    headless: true,
    viewport: {
      width: 1280,
      height: 720
    },
    timeout: 10000
  }
};