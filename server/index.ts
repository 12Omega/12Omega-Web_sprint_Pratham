import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboard';
import mongoose from 'mongoose';
import path from 'path';

// Load environment variables
const projectRoot = path.resolve(__dirname, '..');
const envPath = path.resolve(projectRoot, 'server', '.env');
console.log('[INFO] Loading .env from:', envPath);

const dotenvResult = dotenv.config({ path: envPath });
if (dotenvResult.error) {
  console.error('[ERROR] Failed to load .env file:', dotenvResult.error.message);
} else {
  console.log('[INFO] Environment variables loaded successfully');
}

// Environment variables
const MONGO_URI = process.env.MONGO_URI;
const PORT_STRING = process.env.PORT || '5000';
const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate required environment variables
if (!MONGO_URI) {
  console.error('❌ FATAL ERROR: MONGO_URI is not defined');
  console.error('📝 Please set up your MongoDB connection string in server/.env file');
  console.error('📝 Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/omega-db');
  console.error('📝 Or for local: MONGO_URI=mongodb://localhost:27017/omega-db');
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET is not defined');
  console.error('📝 Please add JWT_SECRET=your-secret-key to your .env file');
  process.exit(1);
}

const PORT: number = parseInt(PORT_STRING, 10);
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error('❌ FATAL ERROR: Invalid PORT number');
  process.exit(1);
}

const app = express();

// Enhanced MongoDB Connection
  const connectDB = async () => {
    try {
      console.log('🔄 Connecting to MongoDB...');
      console.log('🔗 Connection URI:', MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
      
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        maxPoolSize: 10, // Maintain up to 10 socket connections
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      });
    
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database Name:', mongoose.connection.db?.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
  } catch (err: any) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('💡 Troubleshooting steps:');
    console.error('   1. Check if MongoDB service is running');
    console.error('   2. Verify connection string in .env file');
    console.error('   3. Ensure network connectivity');
    console.error('   4. For MongoDB Atlas: whitelist your IP address');
    console.error('   5. Check username/password credentials');
    
    if (NODE_ENV === 'production') {
      console.error('🚨 Production mode: Exiting due to database connection failure');
      process.exit(1);
    } else {
      console.error('⚠️  Development mode: Server will continue without database');
      console.error('   🔍 API routes requiring database will return 503 errors');
    }
  }
};

// Mongoose connection event handlers
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 Mongoose reconnected to MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...');
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
});

// Middleware Configuration
app.use(cors({
  origin: [
    'http://localhost:3000',    // React default
    'http://localhost:5173',    // Vite default
    'http://localhost:8080',    // Common dev port
    'http://localhost:8000',    // Alternative port
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8000'
  ],
  credentials: true,
  optionsSuccessStatus: 200, // Support legacy browsers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ 
  limit: '10mb',
  strict: true,
  type: 'application/json'
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
  parameterLimit: 1000
}));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  const dbStatusText = statusMap[dbStatus] || 'unknown';

  const healthInfo = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    database: {
      status: dbStatusText,
      host: mongoose.connection.host || 'N/A',
      name: mongoose.connection.db?.databaseName || 'N/A'
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    },
    version: process.version
  };

  const statusCode = dbStatus === 1 ? 200 : 503;
  res.status(statusCode).json(healthInfo);
});

// API route prefix
app.get('/api', (req, res) => {
  res.json({
    message: 'Smart Parking API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      users: '/api/users',
      dashboard: '/api/dashboard',
      health: '/health'
    },
    documentation: 'See README.md for API documentation'
  });
});

// Database connection middleware for API routes
const requireDatabase = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database temporarily unavailable',
      message: 'Please try again later or check database connection',
      timestamp: new Date().toISOString()
    });
  }
  next();
};

// API Routes with database check
app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api/products', requireDatabase, productRoutes);
app.use('/api/users', requireDatabase, userRoutes);
app.use('/api/dashboard', requireDatabase, dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Smart Parking API Server is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    health: '/health',
    api: '/api'
  });
});

// Handle undefined routes (404)
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
    availableRoutes: {
      root: 'GET /',
      health: 'GET /health',
      api: 'GET /api',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      products: 'GET /api/products',
      users: 'GET /api/users',
      dashboard: 'GET /api/dashboard'
    }
  });
});

// Enhanced error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ Error:`, err.message);
  
  if (NODE_ENV === 'development') {
    console.error('Stack trace:', err.stack);
  }

  // MongoDB/Mongoose errors
  if (err.name === 'MongooseError' || err.name === 'MongoError' || err.name === 'MongoNetworkError') {
    return res.status(503).json({
      error: 'Database error',
      message: 'Database temporarily unavailable',
      timestamp,
      ...(NODE_ENV === 'development' && { details: err.message })
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Invalid input data',
      details: err.errors,
      timestamp
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Authentication error',
      message: 'Invalid or expired token',
      timestamp
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate entry',
      message: 'Resource already exists',
      timestamp
    });
  }

  // Default error response
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : err.name || 'Error',
    message: err.message || 'Something went wrong',
    timestamp,
    ...(NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err
    })
  });
});

// Start Server
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Start HTTP server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('\n🎉 ===================================');
      console.log('🚀 Smart Parking API Server Started!');
      console.log('🎉 ===================================');
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log(`� API Base: http://localhost:${PORT}/api`);
      console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
      console.log(`📦 Products: http://localhost:${PORT}/api/products`);
      console.log(`👥 Users: http://localhost:${PORT}/api/users`);
      console.log(`📈 Dashboard: http://localhost:${PORT}/api/dashboard`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log('🎉 ===================================\n');
    });

    // Handle server errors
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.error('💡 Try a different port or kill the process using this port');
        process.exit(1);
      } else {
        console.error('❌ Server error:', err.message);
        process.exit(1);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n🛑 Received SIGTERM. Starting graceful shutdown...');
      server.close(async () => {
        console.log('✅ HTTP server closed');
        try {
          await mongoose.connection.close();
          console.log('✅ Database connection closed');
          process.exit(0);
        } catch (err) {
          console.error('❌ Error during database shutdown:', err);
          process.exit(1);
        }
      });
    });

  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Initialize server
startServer().catch((error) => {
  console.error('❌ Unexpected error during server startup:', error);
  process.exit(1);
});





