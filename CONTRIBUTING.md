# Contributing to Fortune Telling Agent

We welcome contributions to the Fortune Telling Agent project! This document provides guidelines for contributing.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use clear, descriptive titles** for new issues
3. **Provide detailed information** including:
   - Steps to reproduce the problem
   - Expected vs actual behavior
   - Your environment (OS, Node.js version, etc.)
   - Relevant logs or error messages

### Submitting Pull Requests

1. **Fork the repository** and create your feature branch from `main`
2. **Make sure your code follows** the project's coding standards
3. **Add or update tests** as needed
4. **Update documentation** if you're adding new features
5. **Run the validation script** before submitting: `npm run validate-data`
6. **Create a pull request** with a clear description of changes

## 🏗️ Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/fortuneTellingAgent.git
cd fortuneTellingAgent

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Validate data files
npm run validate-data

# Start development server
npm run dev
```

## 📋 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns and structure
- Use descriptive variable and function names
- Add JSDoc comments for complex functions
- Keep functions focused and small

### Data Files

When modifying JSON data files in `src/mastra/data/`:

- **Maintain consistency** with existing data structure
- **Validate changes** using `npm run validate-data`
- **Test thoroughly** to ensure interpretations remain accurate
- **Respect cultural authenticity** for traditional divination systems
- **Add proper sources** for new data when applicable

### New Features

When adding new divination systems or tools:

1. **Create data file** in `src/mastra/data/` if needed
2. **Implement tool function** in `src/mastra/agents/index.ts`
3. **Add validation** in `scripts/validate-data.mjs`
4. **Update documentation** in README.md
5. **Add CLI support** in `scripts/cli.mjs`
6. **Test thoroughly** with various inputs

### Cultural Sensitivity

- **Research thoroughly** before implementing traditional practices
- **Respect cultural contexts** and avoid appropriation
- **Use appropriate terminology** and historical context
- **Consult authentic sources** for accuracy
- **Acknowledge limitations** of digital interpretations

## 🧪 Testing

### Running Tests

```bash
# Validate data integrity
npm run validate-data

# Test CLI functionality
npm run cli

# Build project
npm run build

# Run linting (if configured)
npm run lint
```

### Test Cases to Consider

- **Edge cases** with invalid or missing input data
- **Different cultural contexts** for international users
- **Various input formats** for dates, names, etc.
- **Error handling** for network issues or API failures
- **Memory usage** with large data sets

## 📚 Documentation Standards

### README Updates

- Keep examples current and working
- Update tool lists when adding features
- Maintain clear installation instructions
- Include troubleshooting information

### Code Documentation

- Document complex algorithms or calculations
- Explain cultural or historical context where relevant
- Include parameter descriptions for tools
- Add usage examples for new features

### API Documentation

- Document all tool parameters and return types
- Include example requests and responses
- Note any breaking changes in updates
- Maintain version compatibility information

## 🎯 Areas for Contribution

### High Priority

- **Accuracy improvements** to existing divination systems
- **Performance optimizations** for large data processing
- **Error handling** and user experience improvements
- **Mobile-friendly** interface considerations
- **Internationalization** support for multiple languages

### Medium Priority

- **Additional divination systems** (e.g., Vedic astrology, Nordic runes)
- **Enhanced calculations** for more accurate readings
- **Web interface** for browser-based interactions
- **API endpoints** for external integrations
- **Batch processing** capabilities

### Lower Priority

- **Visual enhancements** for CLI output
- **Configuration options** for customization
- **Caching mechanisms** for improved performance
- **Analytics** and usage tracking
- **Advanced scheduling** features

## 🚨 What Not to Include

Please avoid contributing:

- **Copyrighted material** without proper attribution
- **Inaccurate or misleading** traditional interpretations
- **Harmful or negative predictions** (death, illness, extreme misfortune)
- **Personally identifiable information** in examples
- **Religious or political bias** in interpretations
- **Commercial or promotional content**

## 📖 Learning Resources

### Understanding the Systems

- **Western Astrology**: Study planetary influences, house meanings, aspect interpretations
- **Chinese Astrology**: Learn about Five Elements theory, animal characteristics, Ba Zi principles
- **Tarot**: Understand card symbolism, spread meanings, historical context
- **I Ching**: Study hexagram interpretations, changing lines, philosophical background
- **Numerology**: Learn calculation methods, number meanings, cultural variations
- **Palmistry**: Study line interpretations, hand shapes, traditional meanings
- **Feng Shui**: Understand directional energies, Five Elements, Ba Gua applications

### Technical Resources

- [Mastra Framework Documentation](https://mastra.ai/docs)
- [Deepseek AI API Documentation](https://deepseek.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

## ❓ Getting Help

- **Discord/Slack**: Join our community channels (if available)
- **GitHub Issues**: Ask questions using the "question" label
- **Documentation**: Check README.md and code comments
- **Examples**: Review existing tool implementations

## 🏆 Recognition

Contributors will be recognized in:
- Project README acknowledgments
- Release notes for significant contributions
- Community highlights for ongoing support

## 📄 License Agreement

By contributing to this project, you agree that your contributions will be licensed under the same ISC License that covers the project.

---

Thank you for contributing to Fortune Telling Agent! Your efforts help make divination wisdom more accessible while respecting traditional practices. 🌟
