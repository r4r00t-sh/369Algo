# Contributing to 369 Algo

Thank you for your interest in contributing to **369 Algo**! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git
- Docker (optional, for local development)

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/369Algo.git`
3. Create a virtual environment: `python -m venv venv`
4. Activate the environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`
5. Install dependencies: `pip install -r backend/requirements.txt`
6. Install frontend dependencies: `cd frontend && npm install`

## 🌿 Branch Strategy

We follow a **Git Flow** branching strategy:

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: New features and enhancements
- **`hotfix/*`**: Critical bug fixes
- **`release/*`**: Release preparation

### Branch Naming Convention
- Features: `feature/descriptive-name`
- Bug fixes: `fix/issue-description`
- Hotfixes: `hotfix/critical-issue`
- Releases: `release/version-number`

## 📝 Code Style

### Python (Backend)
- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Use type hints
- Maximum line length: 88 characters
- Use Black for code formatting
- Use isort for import sorting

### TypeScript/React (Frontend)
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Use functional components with hooks
- Follow React best practices

### General
- Write meaningful commit messages
- Use conventional commits format
- Add comments for complex logic
- Write self-documenting code

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest tests/ -v --cov=.
```

### Frontend Testing
```bash
cd frontend
npm test
npm run test:coverage
```

### Integration Testing
```bash
# Run the full test suite
npm run test:full
```

## 📋 Pull Request Process

1. **Create a feature branch** from `develop`
2. **Make your changes** following the code style
3. **Write/update tests** for new functionality
4. **Update documentation** if needed
5. **Run tests** to ensure everything passes
6. **Commit your changes** with clear messages
7. **Push to your fork** and create a Pull Request
8. **Request review** from maintainers

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🐛 Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to reproduce**: Detailed steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, Python/Node versions, etc.
- **Screenshots**: If applicable

## 💡 Feature Requests

For feature requests:

- **Description**: Clear description of the feature
- **Use case**: Why this feature is needed
- **Proposed solution**: How you think it should work
- **Alternatives**: Other approaches considered

## 🔒 Security

- **DO NOT** commit sensitive information
- **DO NOT** commit API keys or secrets
- Report security vulnerabilities privately
- Use environment variables for configuration

## 📚 Documentation

- Keep README.md updated
- Document new API endpoints
- Update architecture diagrams
- Add inline code comments

## 🏷️ Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## 🤝 Code Review

### Review Guidelines
- Be constructive and respectful
- Focus on code quality and functionality
- Suggest improvements when possible
- Approve only when satisfied

### Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are adequate
- [ ] Documentation is updated
- [ ] No security issues
- [ ] Performance considerations addressed

## 📞 Communication

- **Issues**: Use GitHub Issues for bugs and features
- **Discussions**: Use GitHub Discussions for questions
- **Chat**: Join our community channels
- **Email**: For sensitive matters

## 🎯 Contribution Areas

We welcome contributions in:

- **Backend**: FastAPI, database models, services
- **Frontend**: React components, UI/UX improvements
- **Testing**: Unit tests, integration tests
- **Documentation**: README, API docs, guides
- **DevOps**: CI/CD, deployment, monitoring
- **Security**: Authentication, authorization, validation

## 🏆 Recognition

Contributors will be recognized in:

- Project README
- Release notes
- Contributor hall of fame
- Special acknowledgments

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🆘 Need Help?

- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Contact maintainers directly
- Join our community channels

---

**Thank you for contributing to 369 Algo!** 🚀

Your contributions help make this project better for everyone in the trading community.
