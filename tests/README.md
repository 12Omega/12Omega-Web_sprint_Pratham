# ParkEase Test Suite Organization

This directory contains all test files organized by test type and functionality.

## Directory Structure

```
tests/
├── api/                    # Backend API tests
│   ├── test-api-endpoints.js      # General API endpoint testing
│   ├── test-auth-working.js       # Authentication API tests
│   ├── test-login.js              # Login functionality tests
│   ├── test-registration.js       # User registration tests
│   └── test-payments-api.js       # Payment API tests
├── frontend/               # Frontend component and page tests
│   ├── test-frontend-api.js       # Frontend API integration tests
│   ├── test-frontend-pages.js     # Page component tests
│   └── test-frontend-signup.js    # Frontend signup flow tests
├── integration/            # End-to-end and integration tests
│   ├── test-complete-signup.js    # Complete signup flow test
│   ├── test-final-fix.js          # Final integration fixes
│   ├── test-signup.js             # Signup integration test
│   └── test-typescript-fixes.js   # TypeScript integration tests
└── README.md              # This file
```

## Test Categories

### API Tests (`/api/`)
These tests focus on backend API functionality:
- **Authentication**: Login, registration, token validation
- **Endpoints**: CRUD operations for parking spots, bookings, payments
- **Security**: Authorization, input validation, error handling

### Frontend Tests (`/frontend/`)
These tests cover React components and frontend functionality:
- **Component Testing**: Individual component behavior
- **Page Testing**: Full page rendering and interactions
- **API Integration**: Frontend-backend communication

### Integration Tests (`/integration/`)
These tests verify end-to-end functionality:
- **User Flows**: Complete user journeys from signup to booking
- **System Integration**: Frontend + Backend + Database interactions
- **Cross-browser Testing**: Compatibility across different environments

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Categories
```bash
# API Tests
npm run test:api

# Frontend Tests  
npm run test:frontend

# Integration Tests
npm run test:integration
```

### Individual Test Files
```bash
# Run specific test file
node tests/api/test-login.js
```

## Test File Naming Convention

- `test-[functionality].js` - General test files
- `[component].test.js` - Component-specific tests (in src/components)
- `[page].test.js` - Page-specific tests (in src/pages)

## Test Data and Mocks

Test files may include:
- Mock data for consistent testing
- Database seeding scripts
- API response mocks
- User authentication tokens for testing

## Coverage Reports

Test coverage reports are generated in the `coverage/` directory after running:
```bash
npm run test:coverage
```

## Contributing to Tests

When adding new features:
1. Add corresponding tests in the appropriate directory
2. Follow existing naming conventions
3. Include both positive and negative test cases
4. Update this README if adding new test categories