const express = require('express');
const app = express();

const dashboardRouter = require('./routes/dashboard');

// ... your existing middleware

app.use('/api/dashboard', dashboardRouter);

// ... other routes and app.listen()
