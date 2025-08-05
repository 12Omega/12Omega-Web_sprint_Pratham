# ParkEase - Smart Parking Management System

A modern, full-stack parking management application built with React, TypeScript, Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication** - Secure login/register with JWT
- **Real-time Parking Spot Management** - View and book available spots
- **Interactive Dashboard** - Analytics and booking management
- **Payment Integration** - Multiple payment methods support
- **Responsive Design** - Works on desktop and mobile
- **Admin Panel** - Manage spots, users, and bookings

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Redux Toolkit for state management
- React Router for navigation
- Framer Motion for animations

**Backend:**
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- Express Rate Limiting

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/12Omega/12Omega-Web_sprint_Pratham.git
cd 12Omega-Web_sprint_Pratham
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=5002
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/parkease

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# API Configuration
VITE_API_URL=/api
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
```

### 5. Seed the Database

Populate the database with sample data:

```bash
npm run seed
```

This will create:
- Sample users (including admin@parkease.com)
- Parking spots with different types
- Sample bookings and payments

### 6. Start the Application

Run both frontend and backend:

```bash
npm run dev
```

Or run them separately:

```bash
# Backend only
npm run server

# Frontend only (in another terminal)
npm run client
```

### 7. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5002

## 👤 Default Login Credentials

After seeding the database, you can use these credentials:

**Admin Account:**
- Email: `admin@parkease.com`
- Password: `password123`

**User Accounts:**
- Email: `john@example.com` / Password: `password123`
- Email: `sarah@example.com` / Password: `password123`

## 📁 Project Structure

```
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── store/             # Redux store configuration
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── scripts/          # Database seeding scripts
│   └── services/         # Business logic services
├── public/               # Static assets
├── docs/                 # Documentation
└── tests/               # Test files
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test types
npm run test:frontend
npm run test:api
npm run test:integration
```

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the frontend development server
- `npm run server` - Start only the backend development server
- `npm run build` - Build the frontend for production
- `npm run seed` - Seed the database with sample data
- `npm run seed:direct` - Alternative seeding method
- `npm test` - Run the test suite
- `npm run lint` - Run ESLint on the codebase
- `npm run format` - Format code with Prettier

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running on your system.

**2. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5002
```
**Solution:** Change the PORT in your `.env` file or kill the process using the port.

**3. Module Not Found Errors**
```
Error: Cannot find module 'xyz'
```
**Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again.

**4. TypeScript Compilation Errors**
**Solution:** Make sure all dependencies are installed and run `npm run build` to check for issues.

### Reset Database

If you need to reset your database:

```bash
# This will clear all data and reseed
npm run seed
```

### Clean Installation

If you're having persistent issues:

```bash
# Remove dependencies
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Reseed database
npm run seed

# Start application
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/12Omega/12Omega-Web_sprint_Pratham/issues)
3. Create a new issue if your problem isn't covered

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by real-world parking management needs
- Thanks to all contributors and testers

---

**Happy Coding! 🚗💨**