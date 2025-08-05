# MongoDB Compass Latest Version Setup Guide

## Installation

### Download Latest Version
1. Visit [MongoDB Compass Download Page](https://www.mongodb.com/try/download/compass)
2. Select your operating system
3. Download the latest stable version
4. Install following the platform-specific instructions

## First Time Setup

### 1. Initial Connection
```
Connection String: mongodb://localhost:27017/parkease
Connection Name: ParkEase Local Development
```

### 2. Connection Configuration
- **Host**: localhost
- **Port**: 27017
- **Database**: parkease
- **Authentication**: None (for local development)

### 3. Save Connection
- Click "Save & Connect" to save for future use
- Connection will appear in your saved connections list

## New Features in Latest Version

### Enhanced Query Experience
- **IntelliSense**: Auto-completion for field names and operators
- **Query History**: Access previously run queries
- **Query Performance**: Built-in explain plans

### Visual Aggregation Builder
- Drag-and-drop pipeline stages
- Real-time preview of results
- Export pipelines to code

### Schema Insights
- Automatic schema detection
- Field type analysis
- Data distribution charts

### Performance Monitoring
- Real-time performance metrics
- Slow operation detection
- Index usage statistics

## Development Workflow

### 1. Database Exploration
```javascript
// View all collections
// Navigate using the sidebar collection list

// Quick collection stats
// Click on collection name to see document count and size
```

### 2. Document Management
```javascript
// Insert new document
// Click "Insert Document" button in Documents tab

// Edit existing document
// Click on any document to edit in place

// Delete documents
// Use the trash icon or bulk operations
```

### 3. Query Development
```javascript
// Simple filter
{ status: "active" }

// Complex query with multiple conditions
{
  status: "active",
  createdAt: { $gte: new Date("2024-01-01") },
  user: { $exists: true }
}

// Text search (if text index exists)
{ $text: { $search: "parking" } }
```

### 4. Aggregation Pipelines
```javascript
// User growth analysis
[
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]

// Revenue analysis
[
  { $match: { status: "completed" } },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m", date: "$endTime" } },
      revenue: { $sum: "$totalAmount" },
      bookings: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]
```

## Index Management

### Creating Indexes
```javascript
// Single field index
{ status: 1 }

// Compound index
{ user: 1, createdAt: -1 }

// Text index for search
{ title: "text", description: "text" }

// Geospatial index (for location-based queries)
{ location: "2dsphere" }
```

### Index Performance
- Use the "Explain Plan" feature to analyze query performance
- Monitor index usage in the Performance tab
- Remove unused indexes to improve write performance

## Data Import/Export

### Import Data
1. Click "Collection" menu → "Import Data"
2. Select file format (JSON, CSV, BSON)
3. Configure field mapping
4. Review and import

### Export Data
1. Apply filters if needed
2. Click "Collection" menu → "Export Data"
3. Choose format and options
4. Export to file

## Troubleshooting

### Connection Issues
```bash
# Check MongoDB service status (Windows)
net start MongoDB

# Check if port is available
netstat -an | findstr :27017

# Test connection from command line
mongosh mongodb://localhost:27017/parkease
```

### Performance Issues
- Enable profiling in MongoDB to track slow queries
- Use the Performance tab to identify bottlenecks
- Create appropriate indexes for frequently queried fields

### Memory Usage
- Monitor memory usage in the Performance tab
- Consider using projection to limit returned fields
- Use pagination for large result sets

## Best Practices

### Query Optimization
- Always use indexes for frequently queried fields
- Limit result sets with proper filtering
- Use projection to return only needed fields

### Security
- Never use admin credentials for development
- Create specific database users with limited permissions
- Use connection string authentication in production

### Data Modeling
- Use the Schema tab to understand your data structure
- Validate document schemas using JSON Schema validation
- Consider embedding vs referencing based on query patterns

## Integration with ParkEase

### Development Database
```javascript
// Connection for local development
mongodb://localhost:27017/parkease

// Test database
mongodb://localhost:27017/parkease_test
```

### Collections Structure
- **users**: User accounts and profiles
- **parkingspots**: Available parking locations
- **bookings**: Reservation records
- **payments**: Payment transaction history

### Common Queries for ParkEase
```javascript
// Find available spots near location
{
  status: "available",
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: 1000
    }
  }
}

// User booking history
{
  user: ObjectId("user_id"),
  status: { $in: ["completed", "active"] }
}

// Revenue by time period
[
  {
    $match: {
      status: "completed",
      endTime: {
        $gte: new Date("2024-01-01"),
        $lt: new Date("2024-02-01")
      }
    }
  },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$totalAmount" },
      totalBookings: { $sum: 1 }
    }
  }
]
```