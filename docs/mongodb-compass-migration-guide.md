# MongoDB Compass Migration Guide

## Updating to Latest Version

### What's Changed

#### UI Updates
- **New Connection Interface**: Streamlined connection process with better saved connection management
- **Enhanced Query Bar**: Improved autocomplete and syntax highlighting
- **Redesigned Navigation**: Collections now in collapsible sidebar with breadcrumb navigation
- **Performance Tab**: New real-time monitoring capabilities

#### Feature Additions
- **Visual Aggregation Builder**: Drag-and-drop pipeline creation
- **Schema Validation**: Built-in JSON Schema validation tools
- **Import/Export Improvements**: Better format support and progress tracking
- **Query History**: Access to previously executed queries

### Migration Steps

#### 1. Update MongoDB Compass
```bash
# Download latest version from MongoDB website
# Uninstall old version (optional but recommended)
# Install new version
```

#### 2. Update Project Dependencies
```bash
# Update Mongoose to latest compatible version
npm install mongoose@^8.8.0

# Update other MongoDB-related packages if any
npm update
```

#### 3. Update Connection Configuration
The connection process has been streamlined:

**Old Method:**
- Click "Connect" → "Connect to Host"
- Fill individual fields

**New Method:**
- Click "New Connection" or "+" icon
- Use connection string directly
- Save with custom name

#### 4. Update Saved Connections
Your existing saved connections should migrate automatically, but verify:
- Check connection names and settings
- Test each saved connection
- Update any custom connection options

### Code Changes Required

#### Server Connection (server/index.ts)
```typescript
// Updated connection with latest Mongoose options
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parkease', {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

#### Test Configuration (tests/test.config.js)
```javascript
database: {
  MONGODB_URI: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/parkease_test',
  CONNECTION_OPTIONS: {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    bufferMaxEntries: 0
  }
}
```

### New Features to Leverage

#### 1. Visual Aggregation Builder
Instead of writing aggregation pipelines manually:
```javascript
// Old way: Write entire pipeline in shell
db.bookings.aggregate([...])

// New way: Use visual builder
// 1. Go to Aggregations tab
// 2. Add stages visually
// 3. Preview results in real-time
// 4. Export to code when ready
```

#### 2. Enhanced Schema Analysis
```javascript
// Automatic schema detection
// View field types and distributions
// Identify data quality issues
// Set up validation rules
```

#### 3. Performance Monitoring
```javascript
// Real-time performance metrics
// Slow operation detection
// Index usage statistics
// Query optimization suggestions
```

### Troubleshooting Migration Issues

#### Connection Problems
```bash
# Clear old connection cache
# Windows: %APPDATA%\MongoDB Compass Community\
# macOS: ~/Library/Application Support/MongoDB Compass Community/
# Linux: ~/.config/MongoDB Compass Community/

# Reset to defaults if needed
# Delete the entire folder above
```

#### Query Compatibility
```javascript
// Some query syntax may need updates
// Old ObjectId syntax
ObjectId("507f1f77bcf86cd799439011")

// New syntax (still works but prefer)
new ObjectId("507f1f77bcf86cd799439011")
```

#### Aggregation Pipeline Changes
```javascript
// Pipeline stages now have better validation
// Use the visual builder to catch syntax errors
// Export validated pipelines to your code
```

### Best Practices After Migration

#### 1. Connection Management
- Use descriptive names for saved connections
- Separate development, staging, and production connections
- Regularly review and clean up unused connections

#### 2. Query Development
- Use the query history feature to track your work
- Leverage autocomplete for field names
- Use explain plans to optimize performance

#### 3. Data Management
- Use the new import/export features for data migration
- Set up schema validation for data quality
- Monitor performance regularly with the new tools

#### 4. Team Collaboration
- Share aggregation pipelines using the export feature
- Document common queries in your project
- Use consistent naming conventions for saved connections

### Verification Checklist

After migration, verify:
- [ ] All saved connections work correctly
- [ ] Query performance is maintained or improved
- [ ] Aggregation pipelines execute without errors
- [ ] Import/export functionality works as expected
- [ ] Schema validation rules are properly configured
- [ ] Performance monitoring shows expected metrics

### Rollback Plan

If issues occur:
1. Keep the old Compass installer as backup
2. Export important queries and aggregations before migration
3. Document current connection settings
4. Test thoroughly in development before production use

### Getting Help

- **MongoDB Compass Documentation**: [docs.mongodb.com/compass](https://docs.mongodb.com/compass)
- **Community Forums**: [community.mongodb.com](https://community.mongodb.com)
- **GitHub Issues**: [github.com/mongodb-js/compass](https://github.com/mongodb-js/compass)