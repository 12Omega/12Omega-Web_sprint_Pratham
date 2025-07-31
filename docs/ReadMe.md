# ParkEase - Smart Parking Management System

ParkEase is a comprehensive parking management system that helps users find, book, and manage parking spots efficiently.

## Features

- User authentication and profile management
- Interactive dashboard with real-time statistics
- Parking spot search and booking
- Payment processing
- Admin panel for managing spots, users, and bookings
- Reporting and analytics

## Dashboard Components

The dashboard provides a comprehensive overview of the parking system with the following components:

- **Stats Cards**: Display key metrics like total users, active sessions, and user growth
- **Earnings Chart**: Visualize earnings data over time
- **User Growth Chart**: Track user growth trends
- **Daily Activity Overview**: Monitor daily session activity
- **Parking Grid**: View parking spot availability
- **Recent Bookings**: See the latest booking activities

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or remote)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 12Omega-Web_sprint_Pratham-main
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parkease
JWT_SECRET=your_jwt_secret_key
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

This will start both the frontend and backend servers concurrently.

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/health

## Testing

### API Testing with Postman

1. Import the Postman collection from `postman/ParkEase_Dashboard_API.postman_collection.json`
2. Set up environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `authToken`: (will be set after login)

3. Testing flow:
   - Execute the "Login" request to get an authentication token
   - The token will be automatically set to the `authToken` variable
   - Use the "Get Dashboard Data" request to test the dashboard API

### Database Exploration with MongoDB Compass

1. Connect to your MongoDB database using the connection string:
   - `mongodb://localhost:27017/parkease`

2. Explore the collections:
   - `users`: User accounts and profiles
   - `parkingspots`: Parking spot information
   - `bookings`: Booking records and history

3. Use the sample queries provided in `mongodb-compass-connection.txt` to explore the data

## Project Structure

```
parkease/
├── client/               # Frontend React application
│   ├── public/           # Static files
│   └── src/              # React source code
│       ├── components/   # Reusable components
│       ├── contexts/     # React contexts
│       ├── pages/        # Page components
│       └── services/     # API services
├── server/               # Backend Express application
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   └── services/         # Business logic
├── .env                  # Environment variables
└── package.json          # Project dependencies
```

## API Documentation

### Authentication API

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login and get JWT token
- **GET /api/auth/profile**: Get user profile
- **PUT /api/auth/profile**: Update user profile
- **POST /api/auth/logout**: Logout user

### Dashboard API

- **GET /api/dashboard**: Get dashboard statistics and data

### Parking Spots API

- **GET /api/spots**: Get all parking spots
- **GET /api/spots/:id**: Get a specific parking spot
- **POST /api/spots**: Create a new parking spot
- **PUT /api/spots/:id**: Update a parking spot
- **DELETE /api/spots/:id**: Delete a parking spot

### Bookings API

- **GET /api/bookings**: Get all bookings
- **GET /api/bookings/:id**: Get a specific booking
- **POST /api/bookings**: Create a new booking
- **PUT /api/bookings/:id**: Update a booking
- **DELETE /api/bookings/:id**: Delete a booking

## Troubleshooting

### Date-fns Issues

If you encounter errors related to date-fns when running the application with Vite, see the [DATE-FNS-FIX.md](./DATE-FNS-FIX.md) file for detailed solutions.

### Common Issues

1. **MongoDB Connection Errors**:
   - Ensure MongoDB is running locally or update the connection string in `.env`
   - Check network connectivity if using a remote MongoDB instance

2. **API Errors**:
   - Check that the server is running on the correct port (default: 5002)
   - Verify that the proxy settings in vite.config.ts match the server port

3. **Authentication Issues**:
   - Ensure JWT_SECRET is properly set in the .env file
   - Check that tokens are being properly stored and sent with requests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)