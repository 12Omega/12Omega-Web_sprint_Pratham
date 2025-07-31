# ParkEase - Clean Project Structure

This document outlines the organized project structure for the ParkEase Smart Parking Management System.

## 📁 Root Directory Structure

```
ParkEase/
├── 📁 config/                    # Configuration files (backup)
│   ├── eslint.config.js         # ESLint configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── prettierrc.json          # Prettier formatting rules
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── tsconfig.app.json        # TypeScript app configuration
│   ├── tsconfig.json            # Main TypeScript configuration
│   ├── tsconfig.node.json       # TypeScript Node configuration
│   └── vite.config.ts           # Vite build configuration
├── 📁 docs/                     # Documentation files
│   ├── DASHBOARD-README.md      # Dashboard documentation
│   ├── DATABASE-SEED-README.md  # Database seeding guide
│   ├── DATE-FNS-FIX.md         # Date-fns troubleshooting
│   ├── folder-structure.txt     # Original folder structure
│   ├── mongodb-compass-connection.txt # MongoDB connection info
│   ├── openapi.yaml             # API specification
│   └── ReadMe.md                # Main project README
├── 📁 documents/                # Project reports and documentation
│   └── ParkEase_Project_Report.md # Comprehensive project report
├── 📁 postman/                  # API testing collections
│   ├── ParkEase_API_Part1.json
│   ├── ParkEase_API_Part2.json
│   ├── ParkEase_API_Part3.json
│   ├── ParkEase_API_Part4.json
│   └── ParkEase_Dashboard_API.postman_collection.json
├── 📁 public/                   # Static public assets
│   └── vite.svg
├── 📁 scripts/                  # Build and utility scripts
│   ├── debug-api-structure.js   # API debugging script
│   └── install_deps.sh          # Dependency installation script
├── 📁 server/                   # Backend Express.js application
│   ├── 📁 controllers/          # Route controllers
│   ├── 📁 middlewares/          # Express middlewares
│   ├── 📁 models/               # Mongoose models
│   ├── 📁 routes/               # Express routes
│   ├── 📁 tests/                # Backend tests
│   ├── index.ts                 # Server entry point
│   └── package.json             # Server dependencies
├── 📁 src/                      # Frontend React application
│   ├── 📁 components/           # React components
│   │   ├── 📁 dashboard/        # Dashboard components
│   │   └── 📁 payments/         # Payment components
│   ├── 📁 contexts/             # React contexts
│   ├── 📁 pages/                # Page components
│   └── 📁 services/             # API services
├── 📁 temp/                     # Temporary/unused files
│   ├── AboutPageScreen())       # Flutter/React Native fragments
│   ├── AlertDialog(
│   ├── ContactSupportScreen())
│   ├── EditProfileScreen())
│   ├── EditVehicleScreen())
│   ├── HelpCenterScreen())
│   ├── Navigator.of(context).pop()
│   ├── NotificationSettingsScreen())
│   └── PaymentMethodsScreen())
├── 📁 tests/                    # Organized test suites
│   ├── 📁 api/                  # Backend API tests
│   ├── 📁 frontend/             # Frontend component tests
│   ├── 📁 integration/          # End-to-end tests
│   ├── README.md                # Test documentation
│   ├── run-all-tests.js         # Test runner script
│   ├── test-utils.js            # Testing utilities
│   └── test.config.js           # Test configuration
├── 📁 utils/                    # Utility functions
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── eslint.config.js             # ESLint configuration (working copy)
├── index.html                   # Main HTML file
├── package.json                 # Project dependencies
├── package-lock.json            # Dependency lock file
├── postcss.config.js            # PostCSS configuration (working copy)
├── PROJECT_STRUCTURE.md         # This file
├── tailwind.config.js           # Tailwind configuration (working copy)
├── tsconfig.json                # TypeScript configuration (working copy)
└── vite.config.ts               # Vite configuration (working copy)
```

## 🗂️ Folder Organization Principles

### 📋 **Configuration Management**
- **Primary configs** remain in root for build tools compatibility
- **Backup configs** stored in `/config/` folder for organization
- All configuration files are properly documented

### 📚 **Documentation Structure**
- **`/docs/`**: Technical documentation, API specs, troubleshooting guides
- **`/documents/`**: Project reports, academic documentation
- **`/postman/`**: API testing collections and examples

### 🧪 **Testing Organization**
- **`/tests/api/`**: Backend API endpoint tests
- **`/tests/frontend/`**: React component and page tests
- **`/tests/integration/`**: End-to-end integration tests
- **`/server/tests/`**: Server-specific unit tests

### 🛠️ **Development Tools**
- **`/scripts/`**: Build scripts, debugging tools, installation helpers
- **`/utils/`**: Shared utility functions
- **`/temp/`**: Temporary files and code fragments

### 🏗️ **Application Structure**
- **`/src/`**: Frontend React application with organized components
- **`/server/`**: Backend Express.js application with MVC structure
- **`/public/`**: Static assets and public files

## 🚀 **Benefits of This Organization**

1. **Clear Separation of Concerns**: Each folder has a specific purpose
2. **Easy Navigation**: Developers can quickly find relevant files
3. **Maintainable**: Clean structure makes maintenance easier
4. **Scalable**: Structure supports project growth
5. **Professional**: Follows industry best practices

## 📝 **File Naming Conventions**

- **Configuration files**: `*.config.js`, `*.config.ts`
- **Documentation**: `*.md`, `*.txt`
- **Test files**: `test-*.js`, `*.test.js`, `*.test.tsx`
- **Component files**: `PascalCase.tsx`
- **Utility files**: `camelCase.js`, `kebab-case.js`

## 🔧 **Development Workflow**

1. **Frontend Development**: Work in `/src/` directory
2. **Backend Development**: Work in `/server/` directory  
3. **Testing**: Use organized test suites in `/tests/`
4. **Documentation**: Update relevant files in `/docs/`
5. **Configuration**: Modify root config files as needed

## 📦 **Build Process**

The build tools automatically reference the root configuration files:
- `vite.config.ts` - Vite bundler configuration
- `tsconfig.json` - TypeScript compilation
- `tailwind.config.js` - CSS framework configuration
- `eslint.config.js` - Code linting rules

This clean structure ensures efficient development, easy maintenance, and professional project organization.