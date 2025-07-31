# ParkEase Dashboard Implementation

This document provides instructions for setting up, running, and testing the ParkEase dashboard components.

## Overview

The dashboard provides real-time statistics and visualizations for the ParkEase parking management system, including:

- User statistics and growth trends
- Parking spot availability and usage
- Booking activity and patterns
- Revenue and earnings data

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or remote)
- Postman (for API testing)
- MongoDB Compass (for database visualization)

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

## Dashboard Components

The dashboard consists of the following components:

1. **StatsCards**: Displays key metrics like total users, active sessions, and user growth.
2. **EarningsChart**: Visualizes earnings data over time using a bar chart.
3. **UserGrowthChart**: Shows user growth trends using a line chart.
4. **DailyActivityOverview**: Displays daily session activity using an area chart.
5. **ParkingGrid**: Visualizes parking spot availability using a pie chart.

## API Endpoints

### Dashboard API

- **GET /api/dashboard**: Retrieves all dashboard data
  - Authentication: Required (JWT token)
  - Response: Dashboard statistics and data

### Authentication API

- **POST /api/auth/login**: User login
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Response: JWT token

- **POST /api/auth/register**: User registration
  - Body: `{ "name": "User Name", "email": "user@example.com", "password": "password123" }`
  - Response: User data and JWT token

## Testing with Postman

1. Import the Postman collection from `postman/ParkEase_Dashboard_API.postman_collection.json`
2. Set up environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `authToken`: (will be set after login)

3. Testing flow:
   - Execute the "Login" request to get an authentication token
   - The token will be automatically set to the `authToken` variable
   - Use the "Get Dashboard Data" request to test the dashboard API

## MongoDB Compass

1. Connect to your MongoDB database using the connection string:
   - `mongodb://localhost:27017/parkease`

2. Explore the collections:
   - `users`: User accounts and profiles
   - `parkingspots`: Parking spot information
   - `bookings`: Booking records and history

3. Use the sample queries provided in `mongodb-compass-connection.txt` to explore the data

## Data Structure

### Dashboard Data

```typescript
interface DashboardData {
  totalUsers: number;
  activeSessionsToday: number;
  recentUsersChange: number;
  sessionActivity: Array<{
    date: string;
    count: number;
  }>;
  userGrowth: Array<{
    month: string;
    count: number;
  }>;
  parkingSpots: {
    available: number;
    occupied: number;
    maintenance: number;
    total: number;
  };
  recentBookings: Array<any>;
  earningsData: Array<{
    month: string;
    earnings: number;
  }>;
}
```

## Troubleshooting

### Common Issues

1. **Connection to MongoDB fails**:
   - Ensure MongoDB is running
   - Check the connection string in the `.env` file

2. **API returns 401 Unauthorized**:
   - Ensure you're including the JWT token in the Authorization header
   - Token may have expired; try logging in again

3. **Charts not displaying data**:
   - Check browser console for errors
   - Ensure the API is returning the expected data format

### Debugging

- Backend logs are available in the terminal where you started the server
- Frontend React components include error boundaries to display error messages

## Further Development

- Add filtering capabilities to the dashboard
- Implement real-time updates using WebSockets
- Add export functionality for reports
- Create more detailed visualizations for specific metrics