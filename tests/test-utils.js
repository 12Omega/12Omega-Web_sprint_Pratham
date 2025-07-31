/**
 * ParkEase Test Utilities
 * Common functions and helpers for all test suites
 */

const axios = require('axios');
const config = require('./test.config');

class TestUtils {
  constructor() {
    this.baseURL = config.environment.API_BASE_URL;
    this.authToken = null;
    this.testUsers = config.testUsers;
  }

  /**
   * Create HTTP client with base configuration
   */
  createHttpClient() {
    const client = axios.create({
      baseURL: this.baseURL,
      timeout: config.environment.TEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add auth token if available
    if (this.authToken) {
      client.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
    }

    return client;
  }

  /**
   * Login and get authentication token
   */
  async login(userType = 'user') {
    const user = this.testUsers[userType];
    const client = this.createHttpClient();

    try {
      const response = await client.post(config.endpoints.auth.login, {
        email: user.email,
        password: user.password
      });

      this.authToken = response.data.data.token;
      return {
        success: true,
        token: this.authToken,
        user: response.data.data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Register a new test user
   */
  async register(userData = null) {
    const user = userData || {
      name: `Test User ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123',
      phone: '1234567890'
    };

    const client = this.createHttpClient();

    try {
      const response = await client.post(config.endpoints.auth.register, user);
      return {
        success: true,
        user: response.data.data.user,
        token: response.data.data.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Create a test parking spot
   */
  async createParkingSpot(spotData = null) {
    const spot = spotData || config.sampleData.parkingSpot;
    const client = this.createHttpClient();

    try {
      const response = await client.post(config.endpoints.spots.create, spot);
      return {
        success: true,
        spot: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Create a test booking
   */
  async createBooking(bookingData = null) {
    const booking = bookingData || config.sampleData.booking;
    const client = this.createHttpClient();

    try {
      const response = await client.post(config.endpoints.bookings.create, booking);
      return {
        success: true,
        booking: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Wait for a specified amount of time
   */
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry a function with exponential backoff
   */
  async retry(fn, maxRetries = config.retry.maxRetries) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await this.wait(config.retry.retryDelay * Math.pow(2, i));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Assert that a condition is true
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  /**
   * Assert that two values are equal
   */
  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`Assertion failed: ${message}. Expected: ${expected}, Actual: ${actual}`);
    }
  }

  /**
   * Assert that a value is truthy
   */
  assertTruthy(value, message) {
    if (!value) {
      throw new Error(`Assertion failed: ${message}. Value is falsy: ${value}`);
    }
  }

  /**
   * Assert that a value is falsy
   */
  assertFalsy(value, message) {
    if (value) {
      throw new Error(`Assertion failed: ${message}. Value is truthy: ${value}`);
    }
  }

  /**
   * Log test results with colors
   */
  logResult(testName, success, error = null) {
    const colors = {
      green: '\x1b[32m',
      red: '\x1b[31m',
      reset: '\x1b[0m'
    };

    if (success) {
      console.log(`${colors.green}✅ ${testName} - PASSED${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ ${testName} - FAILED${colors.reset}`);
      if (error) {
        console.log(`   Error: ${error.message || error}`);
      }
    }
  }

  /**
   * Run a test with proper error handling and logging
   */
  async runTest(testName, testFunction) {
    try {
      await testFunction();
      this.logResult(testName, true);
      return true;
    } catch (error) {
      this.logResult(testName, false, error);
      return false;
    }
  }

  /**
   * Clean up test data
   */
  async cleanup() {
    // Reset auth token
    this.authToken = null;
    
    // Additional cleanup can be added here
    // e.g., delete test users, clear test database, etc.
  }

  /**
   * Generate random test data
   */
  generateTestData() {
    const timestamp = Date.now();
    return {
      email: `test${timestamp}@example.com`,
      name: `Test User ${timestamp}`,
      phone: `555${timestamp.toString().slice(-7)}`,
      licensePlate: `TEST${timestamp.toString().slice(-3)}`
    };
  }
}

module.exports = TestUtils;