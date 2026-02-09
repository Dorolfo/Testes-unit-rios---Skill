# ⚡ Quick Start Guide

Get up and running with the Unit Testing Skill in under 5 minutes!

## 🚀 Installation (30 seconds)

```bash
# Clone the repository
git clone https://github.com/Dorolfo/Testes-unit-rios---Skill.git
cd Testes-unit-rios---Skill

# Install the skill
cp unit-testing.skill ~/.claude/skills/

# Reload Claude Code
# In Claude Code, run: /reload-skills
```

## ✅ Verify Installation (10 seconds)

```bash
# In Claude Code
/skills
# You should see "unit-testing" listed
```

## 💡 First Use (1 minute)

Try these commands in Claude Code:

```
"Help me write unit tests for this function"
"Show me the AAA pattern"
"How do I mock API calls in pytest?"
```

## 📚 Next Steps

### Try the Examples

**Python:**
```bash
cd examples/python
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
pytest -v
```

**JavaScript:**
```bash
cd examples/javascript
npm install
npm test
```

### Read the Docs

- [Full README](README.md) - Complete overview
- [Installation Guide](docs/installation.md) - Detailed setup
- [Usage Guide](docs/usage.md) - How to use effectively
- [MCP Integrations](docs/integrations.md) - Advanced features

### Explore Features

- **AAA Pattern**: Structure your tests clearly
- **Mocking**: Handle external dependencies
- **TDD**: Test-Driven Development workflow
- **Parametrized Tests**: Test multiple inputs efficiently
- **Coverage**: Measure and improve test coverage

## 🆘 Having Issues?

### Skill Not Loading?
```bash
# Check file location
ls ~/.claude/skills/unit-testing.skill

# Reload skills
# In Claude Code: /reload-skills
```

### Examples Not Working?
```bash
# Python: Check Python version
python --version  # Should be 3.8+

# JavaScript: Check Node version
node --version    # Should be 18+
```

## 🤝 Get Help

- [GitHub Issues](https://github.com/Dorolfo/Testes-unit-rios---Skill/issues)
- [GitHub Discussions](https://github.com/Dorolfo/Testes-unit-rios---Skill/discussions)
- [Full Documentation](docs/)

---

**That's it!** You're ready to write better tests. 🎉

For complete details, see the [full README](README.md).
