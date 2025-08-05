# Contributing to ParkEase

Thank you for your interest in contributing to ParkEase! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/12Omega-Web_sprint_Pratham.git`
3. Follow the [Installation Guide](INSTALLATION.md) to set up the project
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Before Making Changes

1. Make sure your local main branch is up to date:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Run the setup check:
   ```bash
   npm run check-setup
   ```

### Making Changes

1. Make your changes in the appropriate files
2. Test your changes locally:
   ```bash
   npm run dev
   npm test
   ```

3. Lint and format your code:
   ```bash
   npm run lint
   npm run format
   ```

### Committing Changes

1. Stage your changes:
   ```bash
   git add .
   ```

2. Commit with a descriptive message:
   ```bash
   git commit -m "feat: add new parking spot validation"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

### Creating a Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your branch and provide a clear description
4. Wait for review and address any feedback

## Code Style Guidelines

### General Rules

- Use TypeScript for new code
- Follow the existing code style
- Add comments for complex logic
- Write meaningful variable and function names

### Frontend (React/TypeScript)

- Use functional components with hooks
- Follow React best practices
- Use TypeScript interfaces for props
- Keep components small and focused

### Backend (Node.js/Express)

- Use async/await instead of callbacks
- Implement proper error handling
- Add input validation
- Follow RESTful API conventions

## Testing

- Write tests for new features
- Ensure all existing tests pass
- Test both frontend and backend changes
- Include edge cases in your tests

## Documentation

- Update README.md if needed
- Add JSDoc comments for functions
- Update API documentation
- Include examples in your documentation

## Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node.js version, etc.)
- Screenshots if applicable

## Feature Requests

For new features:

- Check if the feature already exists
- Describe the use case clearly
- Explain why it would be valuable
- Consider implementation complexity

## Code Review Process

All contributions go through code review:

1. Automated checks must pass
2. At least one maintainer review required
3. Address all feedback before merging
4. Squash commits if requested

## Release Process

- Features are merged to `main` branch
- Releases are tagged with semantic versioning
- Changelog is updated for each release

## Getting Help

If you need help:

- Check the [Installation Guide](INSTALLATION.md)
- Look at existing issues and PRs
- Ask questions in issue comments
- Contact maintainers if needed

## Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to ParkEase! 🚀