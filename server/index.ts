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
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (err: any) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Mongoose connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected.');
});

// --- End MongoDB Connection ---

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Basic error handling middleware (can be expanded)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const startServer = async () => {
  await connectDB(); // Connect to DB before starting the server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();





