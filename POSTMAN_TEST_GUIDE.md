# 🧪 Postman Testing Guide for Smart Parking API

This guide provides complete examples for testing your MERN stack API with Postman.

## 🚀 Quick Start

1. **Start the server**:
   ```bash
   cd /workspace
   npm run server
   ```

2. **The server should show**:
   ```
   ✅ MongoDB Connected Successfully
   🚀 Server is running on http://localhost:5000
   ```

## 📋 Base Configuration

**Base URL**: `http://localhost:5000`

## 🧪 Test Endpoints

### 1. Health Check (Test First!)

**Method**: `GET`  
**URL**: `http://localhost:5000/health`  
**Headers**: None required

**Expected Response** (200 OK):
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "database": {
    "status": "connected",
    "host": "localhost",
    "name": "omega-db"
  },
  "memory": {
    "used": "45MB",
    "total": "128MB"
  },
  "version": "v18.17.0"
}
```

### 2. User Registration

**Method**: `POST`  
**URL**: `http://localhost:5000/api/auth/register`  
**Headers**:
```
Content-Type: application/json
```

**Request Body** (raw JSON):
```json
{
  "username": "testuser123",
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response** (201 Created):
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testuser123",
    "email": "test@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. User Login

**Method**: `POST`  
**URL**: `http://localhost:5000/api/auth/login`  
**Headers**:
```
Content-Type: application/json
```

**Request Body** (raw JSON):
```json
{
  "username": "testuser123",
  "password": "password123"
}
```

**Expected Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testuser123",
    "email": "test@example.com",
    "role": "user",
    "firstName": null,
    "lastName": null,
    "isActive": true,
    "lastLoginAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Get Current User (Protected Route)

**Method**: `GET`  
**URL**: `http://localhost:5000/api/auth/me`  
**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response** (200 OK):
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testuser123",
    "email": "test@example.com",
    "role": "user",
    "firstName": null,
    "lastName": null,
    "isActive": true,
    "lastLoginAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🧪 Testing Workflow

### Step-by-Step Testing:

1. **Health Check**: Verify server is running
2. **Register User**: Create a new user account
3. **Login User**: Get authentication token
4. **Test Protected Routes**: Use token to access protected endpoints

### Sample Test Data:

```json
// User 1
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

// User 2
{
  "username": "janedoe", 
  "email": "jane@example.com",
  "password": "securepass456"
}
```

## 🔑 Authentication Testing

### Using Token in Postman:

1. **Login** to get token
2. **Copy the token** from response
3. **Add to Headers**:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

## 🎯 Success Indicators

✅ **Server Started**: Console shows "Server is running"  
✅ **Database Connected**: Health check shows "connected"  
✅ **Registration Works**: Returns 201 with user object  
✅ **Login Works**: Returns 200 with token  
✅ **Protected Routes**: Accept valid tokens  

Your API is ready when all these indicators are green! 🎉