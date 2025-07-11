# Database Setup Instructions

Your MERN stack application is experiencing connection errors in Postman because MongoDB is not properly configured. Here are the solutions:

## 🔥 Quick Fix: MongoDB Atlas (Recommended)

1. **Create a MongoDB Atlas Account** (Free):
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Sign up for a free account
   - Create a new cluster (free tier)

2. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/omega-db`)

3. **Update Your `.env` File**:
   ```env
   MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/omega-db?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

4. **Whitelist Your IP**:
   - In Atlas, go to Network Access
   - Add your current IP address (or use 0.0.0.0/0 for development)

## 🐳 Alternative: Local MongoDB with Docker

If you have Docker installed:

```bash
# Start MongoDB container
docker run --name mongodb -d -p 27017:27017 mongo:latest

# Update .env to use local connection
MONGO_URI=mongodb://localhost:27017/omega-db
```

## 🛠️ Local MongoDB Installation

For Ubuntu/Debian:
```bash
# Install MongoDB
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

For macOS:
```bash
# Install with Homebrew
brew install mongodb-community
brew services start mongodb-community
```

## 🧪 Testing Your Fix

1. **Start the server**:
   ```bash
   npm run server
   ```

2. **Test health endpoint in Postman**:
   ```
   GET http://localhost:5000/health
   ```
   Should return: `{"status": "OK", "database": "connected", ...}`

3. **Test auth endpoint**:
   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json

   {
     "username": "testuser",
     "email": "test@example.com", 
     "password": "password123"
   }
   ```

## 🚨 Common Issues & Solutions

### Error: "connect ECONNREFUSED 127.0.0.1:27017"
- **Cause**: MongoDB is not running
- **Solution**: Follow the installation steps above

### Error: "Authentication failed"
- **Cause**: Wrong username/password in connection string
- **Solution**: Check your MongoDB Atlas credentials

### Error: "IP not whitelisted"
- **Cause**: Your IP is not allowed to connect
- **Solution**: Add your IP to MongoDB Atlas Network Access

### Error: "Database temporarily unavailable"
- **Cause**: Connection issues
- **Solution**: Server will continue running, fix connection and restart

## 🎯 Recommended Development Setup

1. **Use MongoDB Atlas** for cloud database (free tier available)
2. **Keep local backup** with Docker MongoDB
3. **Use environment variables** for different environments:
   - `.env.development` - local/development database
   - `.env.production` - production database

## 📱 Flutter/Dart Integration

Make sure your Flutter app points to the correct API endpoint:

```dart
// In your Flutter HTTP client
const String baseUrl = 'http://localhost:5000/api'; // For local development
// or
const String baseUrl = 'https://your-api-domain.com/api'; // For production
```

## 🔍 Debugging Tips

1. **Check server logs** for detailed error messages
2. **Use the health endpoint** to verify database connection
3. **Test with Postman** before integrating with Flutter
4. **Monitor MongoDB Atlas** dashboard for connection issues

Your application should now work properly with Postman! 🎉