const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5002;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('ParkEase API Server is running!');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'ParkEase API is running',
    timestamp: new Date().toISOString(),
    links: [
      { rel: 'auth', href: '/api/auth' },
      { rel: 'spots', href: '/api/spots' },
      { rel: 'bookings', href: '/api/bookings' },
      { rel: 'dashboard', href: '/api/dashboard' },
      { rel: 'payments', href: '/api/payments' }
    ]
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/spots', require('./routes/spots'));

try {
  app.use('/api/bookings', require('./routes/bookings'));
} catch (e) {
  console.log('Bookings routes not found, skipping...');
}

try {
  app.use('/api/dashboard', require('./routes/dashboard'));
} catch (e) {
  console.log('Dashboard routes not found, skipping...');
}

try {
  app.use('/api/payments', require('./routes/payments'));
} catch (e) {
  console.log('Payments routes not found, skipping...');
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    links: [
      { rel: 'api-docs', href: '/api/health' }
    ]
  });
});

app.listen(port, () => {
  console.log(`🚗 ParkEase Server running on port ${port}`);
  console.log(`📍 API Health: http://localhost:${port}/api/health`);
});
