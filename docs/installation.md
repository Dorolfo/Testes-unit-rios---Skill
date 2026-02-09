# Installation Guide

This guide will help you install and set up the Unit Testing Skill for Claude Code.

## Prerequisites

- **Claude Code CLI**: Make sure you have Claude Code installed
- **Git**: For cloning the repository
- **Python 3.8+**: If using Python examples
- **Node.js 18+**: If using JavaScript examples

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Dorolfo/Testes-unit-rios---Skill.git
cd Testes-unit-rios---Skill
```

### 2. Install the Skill

#### Option A: Copy to Skills Directory

```bash
# Copy the .skill file to your Claude Code skills directory
cp unit-testing.skill ~/.claude/skills/

# On Windows
copy unit-testing.skill %USERPROFILE%\.claude\skills\
```

#### Option B: Symlink for Development

If you want to modify the skill:

```bash
# Create a symlink instead of copying
ln -s $(pwd)/unit-testing.skill ~/.claude/skills/unit-testing.skill
```

### 3. Reload Claude Code

After installing, restart Claude Code or reload the skills:

```bash
# In Claude Code
/reload-skills

# Or restart Claude Code
```

### 4. Verify Installation

Check that the skill is loaded:

```bash
# In Claude Code
/skills

# You should see "unit-testing" in the list
```

## Setting Up Examples

### Python Examples

```bash
cd examples/python

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run tests to verify
pytest -v
```

### JavaScript Examples

```bash
cd examples/javascript

# Install dependencies
npm install

# Run tests to verify
npm test
```

## Configuration

### Skill Triggers

The skill automatically triggers when you mention:

- "testing", "unit tests", "test coverage"
- "mocking", "test frameworks", "TDD"
- "pytest", "Jest", "Vitest"
- "test patterns", "assertions"

You can also explicitly invoke it:

```
@unit-testing help me write tests for this function
```

### Customization

To modify skill behavior, edit `unit-testing/SKILL.md`:

```bash
# Extract the skill
unzip unit-testing.skill -d temp/

# Edit the SKILL.md
nano temp/unit-testing/SKILL.md

# Repackage
cd temp/unit-testing
zip -r ../../unit-testing.skill .
```

## Troubleshooting

### Skill Not Loading

1. **Check file location**: Ensure the .skill file is in `~/.claude/skills/`
2. **Check permissions**: The file should be readable
   ```bash
   chmod 644 ~/.claude/skills/unit-testing.skill
   ```
3. **Reload skills**: Try `/reload-skills` in Claude Code

### Examples Not Working

1. **Python examples**:
   - Ensure virtual environment is activated
   - Check Python version: `python --version`
   - Reinstall dependencies: `pip install -r requirements.txt`

2. **JavaScript examples**:
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check Node version: `node --version`

### Skill Not Triggering

1. **Use explicit keywords**: Mention "testing", "unit tests", or "TDD"
2. **Try direct invocation**: `@unit-testing <your question>`
3. **Check skill is loaded**: Run `/skills` to verify

## Updating

To update to the latest version:

```bash
cd Testes-unit-rios---Skill
git pull origin main
cp unit-testing.skill ~/.claude/skills/

# In Claude Code
/reload-skills
```

## Uninstallation

To remove the skill:

```bash
rm ~/.claude/skills/unit-testing.skill

# In Claude Code
/reload-skills
```

## Next Steps

- Read the [Usage Guide](usage.md)
- Explore [MCP Integrations](integrations.md)
- Check out the [examples](../examples/)
- Read the main [SKILL.md](../unit-testing/SKILL.md)

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/Dorolfo/Testes-unit-rios---Skill/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Dorolfo/Testes-unit-rios---Skill/discussions)
- **Documentation**: [README](../README.md)
