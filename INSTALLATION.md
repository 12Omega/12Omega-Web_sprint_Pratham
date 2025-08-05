# Installation Guide

This guide will help you set up the ParkEase Smart Parking System on your local machine.

## Prerequisites

### Required Software

1. **Node.js (v18 or higher)**
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB (v6 or higher)**
   - Download from: https://www.mongodb.com/try/download/community
   - Follow the installation guide for your operating system

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/12Omega/12Omega-Web_sprint_Pratham.git
cd 12Omega-Web_sprint_Pratham
```

### 2. Install Dependencies

```bash
npm install
```

If you encounter any issues, try:
```bash
npm install --legacy-peer-deps
```

### 3. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit the `.env` file with your preferred settings:
```env
# Server Configuration
PORT=5002
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/parkease

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend Configuration
VITE_API_URL=/api
```

### 4. Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Linux (CentOS/RHEL):**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 5. Verify MongoDB Connection

Check if MongoDB is running:
```bash
mongosh
```

If successful, you should see the MongoDB shell. Type `exit` to quit.

### 6. Seed the Database

Populate the database with sample data:
```bash
npm run seed
```

This creates:
- Admin and user accounts
- Sample parking spots
- Demo bookings and payments

### 7. Start the Application

**Option 1: Start both frontend and backend together**
```bash
npm run dev
```

**Option 2: Start them separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### 8. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5002
- **API Documentation:** http://localhost:5002/api-docs (if available)

## Default Login Credentials

After seeding, use these credentials:

**Admin Account:**
- Email: `admin@parkease.com`
- Password: `password123`

**User Accounts:**
- Email: `john@example.com` / Password: `password123`
- Email: `sarah@example.com` / Password: `password123`

## Troubleshooting

### Common Issues and Solutions

#### 1. MongoDB Connection Error
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
- Ensure MongoDB is installed and running
- Check if MongoDB service is started
- Verify the MONGODB_URI in your `.env` file

#### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5002
```

**Solutions:**
- Change the PORT in your `.env` file
- Kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5002
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:5002 | xargs kill -9
  ```

#### 3. Module Not Found Errors
```
Error: Cannot find module 'xyz'
```

**Solutions:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm install --legacy-peer-deps`

#### 4. Permission Errors (Linux/macOS)
```
EACCES: permission denied
```

**Solutions:**
- Use `sudo` for global installations
- Configure npm to use a different directory
- Use a Node version manager like nvm

#### 5. TypeScript Compilation Errors

**Solutions:**
- Ensure all dependencies are installed
- Run `npm run build` to check for issues
- Check TypeScript version compatibility

### Reset Everything

If you're having persistent issues:

```bash
# Clean installation
rm -rf node_modules package-lock.json
npm install

# Reset database
npm run seed

# Start fresh
npm run dev
```

### Alternative Seeding Methods

If the main seeding fails:

```bash
# Try the direct seeder
npm run seed:direct

# Or use the JavaScript version
npm run seed:js
```

## Development Tips

### Useful Commands

```bash
# Check if all services are running
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

### Database Management

```bash
# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use parkease database
use parkease

# Show collections
show collections

# View users
db.users.find()

# View parking spots
db.parkingspots.find()
```

## Getting Help

If you're still having issues:

1. Check the main [README.md](README.md) file
2. Look at existing [GitHub Issues](https://github.com/12Omega/12Omega-Web_sprint_Pratham/issues)
3. Create a new issue with:
   - Your operating system
   - Node.js version (`node --version`)
   - MongoDB version (`mongod --version`)
   - Complete error message
   - Steps you've already tried

## Next Steps

Once everything is running:

1. Explore the application features
2. Check out the API endpoints
3. Review the code structure
4. Start developing new features!

Happy coding! 🚀