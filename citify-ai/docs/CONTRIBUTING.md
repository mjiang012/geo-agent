# Contributing to Citify AI

Thank you for your interest in contributing to Citify AI! This document provides guidelines for contributing to the project.

## Code of Conduct

### Our Pledge
In the interest of fostering an open and welcoming environment, we pledge to make participation in our project and our community a harassment-free experience for everyone.

## How Can I Contribute?

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include detailed steps to reproduce
4. Provide system information
5. Attach screenshots or logs if applicable

### Suggesting Enhancements

1. Check existing issues for similar suggestions
2. Use the feature request template
3. Clearly describe the problem and solution
4. Provide use cases and examples

### Contributing Code

#### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (optional, for containerized development)

#### Development Setup

1. Fork the repository
2. Clone your fork
```bash
git clone https://github.com/[your-username]/citify-ai.git
cd citify-ai
```

3. Set up development environment
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install

# Extension setup (if working on extension)
# See extension/README.md
```

4. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

5. Make your changes
6. Write tests
7. Verify everything works
8. Commit your changes
9. Push to your fork
10. Open a pull request

## Development Guidelines

### Branching Strategy

- `main` - Stable production branch
- `develop` - Integration branch for features
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Urgent production fixes

### Commit Messages

Use clear and descriptive commit messages following this format:

```
<type>: <subject>

<description>

<footer>
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Refactoring
- `test` - Test changes
- `chore` - Build/tooling changes

### Code Style

#### Python (Backend)

- Follow PEP 8 guidelines
- Use type hints
- Max line length: 88 characters
- Use black for formatting
- Use flake8 for linting

#### TypeScript/React (Frontend)

- Follow TypeScript best practices
- Use functional components with hooks
- Use ESLint and Prettier
- Follow Tailwind CSS best practices

#### Browser Extension

- Follow Chrome extension best practices
- Keep content scripts lightweight
- Follow Manifest V3 guidelines

### Testing

- Write unit tests for all new features
- Write integration tests for API endpoints
- Ensure all tests pass before submitting PR
- Aim for 80%+ code coverage

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Update documentation for any new features
3. Write tests for your changes
4. Ensure all tests pass
5. Create a pull request with a clear description
6. Link any relevant issues
7. Your PR will be reviewed by the maintainers
8. Address any feedback or comments
9. Once approved, your PR will be merged

## Issue Labels

- `bug` - Bug reports
- `enhancement` - Feature requests
- `documentation` - Documentation updates
- `good first issue` - Good for newcomers
- `help wanted` - Needs help
- `priority/high` - High priority
- `priority/medium` - Medium priority
- `priority/low` - Low priority

## Security

If you discover a security vulnerability, please send an email to security@citify.ai instead of opening an issue.

## Community

- Join our Discord server
- Participate in discussions
- Help answer questions in the issue tracker
- Review pull requests

## License

By contributing to Citify AI, you agree that your contributions will be licensed under the project's MIT license.

## Questions?

If you have questions, please open an issue or contact support@citify.ai.
