# 🧪 Unit Testing Skill for Claude Code

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

A comprehensive Claude Code skill for writing, organizing, and maintaining unit tests with best practices for Python and JavaScript/TypeScript projects.

## 🎯 What is this?

This is a **Claude Code Skill** that provides expert guidance on:

- ✅ Unit testing best practices (Python & JavaScript)
- ✅ Test-Driven Development (TDD) workflows
- ✅ Mocking strategies for external dependencies
- ✅ Test organization and structure (AAA pattern)
- ✅ Integration testing patterns
- ✅ Coverage analysis and optimization
- ✅ Framework-specific patterns (pytest, Jest, Vitest)

Perfect for developers who want to improve their testing skills or need guidance on testing patterns while coding.

## 🚀 Quick Start

### Installation

1. **Clone this repository:**
   ```bash
   git clone https://github.com/Dorolfo/Testes-unit-rios---Skill.git
   cd Testes-unit-rios---Skill
   ```

2. **Install the skill in Claude Code:**
   ```bash
   # Copy the .skill file to your Claude Code skills directory
   cp unit-testing.skill ~/.claude/skills/
   ```

3. **Reload Claude Code** to activate the skill.

### Usage

Once installed, the skill triggers automatically when you mention testing-related topics:

```
"Help me write unit tests for this function"
"Show me how to mock this API call"
"Explain TDD workflow for this feature"
"How do I structure my test files?"
```

## 📚 What You'll Learn

### Core Concepts

- **AAA Pattern**: Arrange-Act-Assert structure for clear tests
- **Test Organization**: Directory structure and naming conventions
- **Fixtures**: Reusable test data and setup/teardown patterns
- **Mocking**: When and how to mock dependencies
- **TDD**: Red-Green-Refactor cycle with practical examples
- **Integration Tests**: Testing multiple components together
- **Parametrized Tests**: Running same test with different inputs
- **Coverage**: Measuring and improving test coverage

### Supported Frameworks

| Language | Frameworks |
|----------|-----------|
| Python | pytest, unittest |
| JavaScript/TypeScript | Jest, Vitest, Mocha |

## 💡 Examples

### Python (pytest)

```python
import pytest
from myapp.users import UserService

@pytest.fixture
def sample_user():
    return {"email": "test@example.com", "name": "Test User"}

def test_user_creation(sample_user):
    """Test that user creation works with valid data"""
    service = UserService()
    result = service.create_user(sample_user)

    assert result.success is True
    assert result.user.email == sample_user["email"]
```

### JavaScript (Vitest)

```javascript
import { describe, test, expect } from 'vitest'
import { UserService } from '../src/users'

describe('UserService', () => {
  test('creates user with valid data', () => {
    const userData = { email: 'test@example.com', name: 'Test User' }
    const service = new UserService()

    const result = service.createUser(userData)

    expect(result.success).toBe(true)
    expect(result.user.email).toBe(userData.email)
  })
})
```

See the [examples/](examples/) directory for more comprehensive examples.

## 🏗️ Project Structure

```
.
├── unit-testing/
│   ├── SKILL.md                    # Main skill content
│   └── references/                 # Deep-dive guides
│       ├── pytest-advanced.md
│       ├── jest-advanced.md
│       └── mock-strategies.md
├── examples/
│   ├── python/                     # Python examples
│   └── javascript/                 # JavaScript examples
├── docs/
│   ├── installation.md
│   ├── usage.md
│   └── integrations.md             # MCP integrations
├── .github/
│   ├── workflows/                  # CI/CD
│   └── ISSUE_TEMPLATE/
├── CONTRIBUTING.md
├── CHANGELOG.md
└── unit-testing.skill             # Packaged skill file
```

## 🔌 MCP Integrations

This skill works great with Claude Code MCP servers:

- **Supabase**: Track testing patterns usage and community feedback
- **Playwright**: Integration with E2E testing examples
- **Firecrawl**: Fetch real-world testing examples from open source

See [docs/integrations.md](docs/integrations.md) for setup instructions.

## 🤝 Contributing

We love contributions! This is a **build in public** project and we welcome:

- 🐛 Bug reports
- 💡 Feature suggestions
- 📝 Documentation improvements
- ✨ New testing patterns
- 🌍 Translations

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📖 Documentation

- [Installation Guide](docs/installation.md)
- [Usage Guide](docs/usage.md)
- [MCP Integrations](docs/integrations.md)
- [Changelog](CHANGELOG.md)

## 🗺️ Roadmap

- [x] Core testing patterns for Python and JavaScript
- [x] TDD workflow examples
- [x] Mocking strategies
- [ ] TypeScript-specific patterns
- [ ] React Testing Library integration
- [ ] FastAPI testing patterns
- [ ] GraphQL testing examples
- [ ] Community-contributed patterns library

## 📊 Build in Public

This project is developed openly on GitHub. Follow along:

- **Development**: All work happens in public branches
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Track progress on the Issues page
- **Releases**: Check CHANGELOG.md for updates

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Inspired by the testing community's best practices
- Built for [Claude Code](https://claude.ai/claude-code)
- Thanks to all contributors!

## 📬 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/Dorolfo/Testes-unit-rios---Skill/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Dorolfo/Testes-unit-rios---Skill/discussions)

---

Made with ❤️ by the community | [⭐ Star this repo](https://github.com/Dorolfo/Testes-unit-rios---Skill) if you find it useful!
