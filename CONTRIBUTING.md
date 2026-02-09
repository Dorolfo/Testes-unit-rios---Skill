# Contributing to Unit Testing Skill

🎉 First off, thank you for considering contributing to this project! This is a **build in public** project and we welcome all contributions.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Submission Guidelines](#submission-guidelines)
- [Style Guide](#style-guide)
- [Community](#community)

## 🤝 Code of Conduct

This project follows a Code of Conduct. By participating, you are expected to uphold this code:

- **Be respectful** and inclusive
- **Be constructive** in feedback
- **Be patient** with others
- **Focus on what's best** for the community

## 🎯 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** describing the problem
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, Python/Node version, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are welcome! Please include:

- **Use case**: Why would this be useful?
- **Proposed solution**: How would it work?
- **Alternatives considered**: Other approaches you've thought about
- **Examples**: Code samples showing the idea

### ✨ Adding Testing Patterns

We love new testing patterns! To add a pattern:

1. **Check existing patterns** to avoid duplicates
2. **Include working examples** in both Python and JavaScript (if applicable)
3. **Explain the why**: When and why to use this pattern
4. **Add to references**: Update `unit-testing/references/` if it's advanced

### 📝 Improving Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add more examples
- Improve code comments
- Translate to other languages

### 🌍 Translations

Help make this skill accessible to non-English speakers! To add a translation:

1. Create a new directory: `unit-testing/translations/[lang-code]/`
2. Translate `SKILL.md` and reference files
3. Update the main README with language links

## 🔧 Development Setup

### Prerequisites

- Git
- Python 3.8+ (for Python examples)
- Node.js 18+ (for JavaScript examples)
- Claude Code CLI

### Setup Steps

1. **Fork and clone:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Testes-unit-rios---Skill.git
   cd Testes-unit-rios---Skill
   ```

2. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

4. **Test your changes:**
   ```bash
   # For Python examples
   cd examples/python
   pytest

   # For JavaScript examples
   cd examples/javascript
   npm test
   ```

5. **Build the skill file:**
   ```bash
   # The .skill file is a ZIP of the unit-testing/ directory
   cd unit-testing
   zip -r ../unit-testing.skill .
   ```

## 📤 Submission Guidelines

### Pull Request Process

1. **Update documentation** if you're adding features
2. **Add examples** for new patterns
3. **Test your changes** thoroughly
4. **Update CHANGELOG.md** under "Unreleased" section
5. **Write clear commit messages**

### Commit Message Guidelines

Use conventional commits:

```
feat: add pytest parametrize examples
fix: correct mocking example in JavaScript section
docs: improve TDD workflow explanation
test: add integration test examples
refactor: reorganize test structure section
```

### PR Title Format

```
[Type] Brief description

Examples:
[Feature] Add React Testing Library patterns
[Fix] Correct pytest fixture example
[Docs] Improve mocking strategies guide
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Testing pattern addition

## Testing
How did you test your changes?

## Related Issues
Closes #(issue number)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Examples added (if applicable)
- [ ] Tests pass
- [ ] CHANGELOG.md updated
```

## 📐 Style Guide

### Markdown Style

- Use **clear headers** (H2 for sections, H3 for subsections)
- Include **code examples** with proper syntax highlighting
- Use **emoji sparingly** for visual organization
- Keep lines under **100 characters** when possible

### Code Style

**Python:**
- Follow PEP 8
- Use descriptive test names
- Include docstrings for complex tests

**JavaScript:**
- Follow Airbnb style guide
- Use ES6+ features
- Prefer `const` and `let` over `var`

### Example Format

When adding examples:

```python
# Python example
def test_descriptive_name():
    """
    Brief explanation of what this test does and why.

    This pattern is useful when [use case].
    """
    # Arrange
    data = setup_test_data()

    # Act
    result = function_under_test(data)

    # Assert
    assert result.is_valid()
```

## 🏗️ Project Structure

```
.
├── unit-testing/           # Main skill content
│   ├── SKILL.md           # Core skill file
│   └── references/        # Advanced guides
├── examples/              # Working examples
│   ├── python/
│   └── javascript/
├── docs/                  # Documentation
└── .github/              # GitHub config
```

## 🧪 Testing Guidelines

### For Python Examples

- Use `pytest`
- Follow AAA pattern
- Include fixtures where appropriate
- Mock external dependencies

### For JavaScript Examples

- Use `vitest` or `jest`
- Follow describe/test structure
- Use proper expect assertions
- Mock modules correctly

## 🤔 Questions?

- **GitHub Discussions**: For questions and ideas
- **GitHub Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions

## 🎖️ Recognition

Contributors will be:

- Listed in project acknowledgments
- Mentioned in release notes
- Part of the build-in-public journey!

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🙏 Your efforts help make testing better for everyone.
