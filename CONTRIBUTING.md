# Contributing to Monitor

Thank you for your interest in contributing to Monitor! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/Monitor.git
   cd Monitor
   ```
3. Install dependencies:
   ```bash
   bun install
   ```

## Development

### Running Tests

Run the test suite:
```bash
bun test
```

Run tests in watch mode:
```bash
bun test --watch
```

### Code Style

- Use TypeScript with strict mode enabled
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic

### Making Changes

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes and ensure tests pass

3. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "Add feature: description of what you added"
   ```

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request on GitHub

## Pull Request Guidelines

- Provide a clear description of what your PR does
- Reference any related issues
- Ensure all tests pass
- Update documentation if needed
- Keep PRs focused on a single feature or fix

## Reporting Issues

When reporting issues, please include:

- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, Bun version, etc.)
- Any relevant error messages or logs

## Feature Requests

We welcome feature requests! Please:

- Check if the feature has already been requested
- Provide a clear description of the feature
- Explain the use case and why it would be valuable
- Consider implementation complexity

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Questions?

If you have questions, feel free to:

- Open an issue for discussion
- Check existing issues and discussions
- Review the README for usage examples

Thank you for contributing to Monitor! 🎉

