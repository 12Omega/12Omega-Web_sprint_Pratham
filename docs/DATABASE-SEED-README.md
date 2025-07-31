# ParkEase Database Seeder

This document explains how to use the database seeder to populate your MongoDB database with dummy data for development and testing purposes.

## Overview

The seeder script creates the following data:

- **Users**: Admin and regular user accounts
- **Parking Spots**: Various parking spots with different types and statuses
- **Bookings**: Active, completed, and upcoming bookings
- **Payments**: Payment records for bookings

## Running the Seeder

To populate your database with dummy data, follow these steps:

1. Make sure MongoDB is running locally or you have a connection to your MongoDB instance
2. Run one of the seeder scripts:

```bash
# Option 1: Using Mongoose (may have validation issues with historical data)
npm run seed

# Option 2: Using direct MongoDB operations (bypasses validation)
npm run seed:direct
```

If you encounter validation errors with the first option, use the second option which bypasses Mongoose validation.

This will:
1. Clear all existing data in the database (only in development mode)
2. Create sample users, parking spots, bookings, and payments
3. Generate historical data for dashboard analytics

## Generated Data

### Users

The seeder creates the following user accounts:

| Name          | Email               | Password    | Role  |
|---------------|---------------------|------------|-------|
| Admin User    | admin@parkease.com  | password123 | admin |
| John Smith    | john@example.com    | password123 | user  |
| Sarah Johnson | sarah@example.com   | password123 | user  |
| Michael Brown | michael@example.com | password123 | user  |
| Emily Davis   | emily@example.com   | password123 | user  |
| David Wilson  | david@example.com   | password123 | user  |

### Parking Spots

The seeder creates various parking spots with different types:

- Standard spots
- Compact spots
- Handicap spots
- Electric vehicle spots

### Bookings and Payments

The seeder creates:

- Active bookings (currently in progress)
- Upcoming bookings (scheduled for the future)
- Completed bookings (historical data)
- Payment records for paid bookings

## Viewing Data in MongoDB Compass

To view the seeded data in MongoDB Compass:

1. Open MongoDB Compass
2. Connect to your MongoDB instance (default: `mongodb://localhost:27017/parkease`)
3. Browse the collections:
   - `users`
   - `parkingspots`
   - `bookings`
   - `payments`

## Sample Queries

Here are some sample queries you can run in MongoDB Compass:

### Find all users
```
db.users.find({})
```

### Find available parking spots
```
db.parkingspots.find({ status: "available" })
```

### Find active bookings
```
db.bookings.find({ 
  status: "active",
  startTime: { $lte: new Date() },
  endTime: { $gte: new Date() }
})
```

### Find completed payments
```
db.payments.find({ status: "completed" })
```

### Find earnings data for dashboard
```
db.payments.aggregate([
  { 
    $match: { 
      status: "completed" 
    } 
  },
  {
    $group: {
      _id: { 
        $dateToString: { 
          format: "%Y-%m", 
          date: "$createdAt" 
        } 
      },
      earnings: { $sum: "$amount" }
    }
  },
  {
    $project: {
      _id: 0,
      month: "$_id",
      earnings: 1
    }
  },
  { $sort: { month: 1 } }
])
```

## Notes

- The seeder will only run in development mode to prevent accidental data loss in production
- All existing data will be cleared before seeding
- The script creates enough historical data to populate dashboard charts and analytics