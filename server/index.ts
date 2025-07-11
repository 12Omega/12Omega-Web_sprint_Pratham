import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes'; // Corrected import
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboard'; // Now a .ts file
import mongoose from 'mongoose';
import path from 'path'; // Import path module

// DOTENV DEBUGGING --- MOVED TO VERY TOP
const projectRoot = path.resolve(__dirname, '..');
const envPath = path.resolve(projectRoot, 'server', '.env');
console.log('[DEBUG] Attempting to load .env from:', envPath); // Renamed for clarity
const dotenvResult = dotenv.config({ path: envPath, debug: true }); // Added debug option for dotenv

console.log('[DEBUG] Dotenv result:', JSON.stringify(dotenvResult, null, 2));
if (dotenvResult.error) {
  console.error('[DEBUG] Dotenv error:', dotenvResult.error);
}
console.log('[DEBUG] MONGO_URI directly from process.env after config:', process.env.MONGO_URI);
console.log('[DEBUG] PORT directly from process.env after config:', process.env.PORT);
// END DOTENV DEBUGGING

const MONGO_URI = process.env.MONGO_URI; // Read after debug logs
const PORT_STRING = process.env.PORT || '5000'; // Read after debug logs

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined. Check .env path and content.');
  console.error('Please set up your MongoDB connection string in server/.env file');
  console.error('Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/omega-db');
  process.exit(1);
}
if (!PORT_STRING) { // Should not happen with fallback
  console.error('FATAL ERROR: PORT is not defined. Check .env path and content.');
  process.exit(1);
}

const PORT: number = parseInt(PORT_STRING, 10);

const app = express();
// --- MongoDB Connection ---
// MOVED MONGO_URI and PORT declaration higher, an explicit check is already done.

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      // Remove deprecated options
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      maxPoolSize: 10, // Maintain up to 10 socket connections
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (err: any) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('💡 Please check:');
    console.error('   1. Your MongoDB service is running');
    console.error('   2. Your connection string is correct in .env file');
    console.error('   3. Your network allows MongoDB connections');
    console.error('   4. For MongoDB Atlas: whitelist your IP address');
    
    // Don't exit immediately, let the server start for other routes
    console.error('⚠️  Server will continue without database connection');
    console.error('   API routes requiring database will return 503 errors');
  }
};

// Mongoose connection events
mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected.');
});

// --- End MongoDB Connection ---

// CORS configuration for development
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'], // Add common dev ports
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Increase JSON limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/products',
      'GET /api/users',
      'GET /api/dashboard'
    ]
  });
});

// Enhanced error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err.stack);
  
  // Database connection errors
  if (err.name === 'MongooseError' || err.name === 'MongoError') {
    return res.status(503).json({ 
      message: 'Database temporarily unavailable',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Service temporarily unavailable'
    });
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation error',
      errors: err.errors
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const startServer = async () => {
  await connectDB(); // Connect to DB before starting the server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
    console.log(`📦 Products endpoints: http://localhost:${PORT}/api/products`);
    console.log(`👥 Users endpoints: http://localhost:${PORT}/api/users`);
    console.log(`📈 Dashboard endpoints: http://localhost:${PORT}/api/dashboard`);
  });
};

startServer();





