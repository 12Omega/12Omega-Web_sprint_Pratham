# ParkEase Login Credentials

## Default Login Credentials (After Database Seeding)

All users have the same password: **`password123`**

### Admin Account
- **Email:** `admin@parkease.com`
- **Password:** `password123`
- **Role:** Admin
- **Phone:** +9779876543210

### Regular User Accounts
1. **John Smith**
   - **Email:** `john@example.com`
   - **Password:** `password123`
   - **Phone:** +9779876543211

2. **Sarah Johnson**
   - **Email:** `sarah@example.com`
   - **Password:** `password123`
   - **Phone:** +9779876543212

3. **Michael Brown**
   - **Email:** `michael@example.com`
   - **Password:** `password123`
   - **Phone:** +9779876543213

4. **Emily Davis**
   - **Email:** `emily@example.com`
   - **Password:** `password123`
   - **Phone:** +9779876543214

5. **David Wilson**
   - **Email:** `david@example.com`
   - **Password:** `password123`
   - **Phone:** +9779876543215

## How to Reset/Reseed Database

If credentials stop working, run:
```bash
npm run seed
```

This will clear the database and recreate all users with the default password `password123`.

## Server Information
- **API Base URL:** `http://localhost:5002/api`
- **Login Endpoint:** `POST /api/auth/login`
- **Health Check:** `GET /api/health`

## Troubleshooting

1. **Make sure MongoDB is running**
2. **Make sure the server is running:** `npm run server`
3. **If credentials don't work, reseed the database:** `npm run seed`
4. **Check server logs for any errors**