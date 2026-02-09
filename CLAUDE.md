# Claude Code Configuration

This file provides context and guidelines for Claude Code when working on this project.

## Project Overview

**Unit Testing Skill for Claude Code** - A comprehensive skill providing expert guidance on unit testing, TDD, and testing best practices for Python and JavaScript/TypeScript projects.

This is a **build in public** open-source project.

## Project Type

- **Type**: Claude Code Skill
- **Languages**: Python, JavaScript/TypeScript, SQL
- **Frameworks**: pytest, Jest, Vitest, Supabase
- **Purpose**: Educational/Developer Tool

## Architecture

### Core Components

1. **Skill Content** (`unit-testing/`)
   - Main skill file: `SKILL.md`
   - Reference guides in `references/`
   - Packaged as `.skill` file (ZIP format)

2. **Examples** (`examples/`)
   - Python examples using pytest
   - JavaScript examples using Vitest
   - Fully working, tested code

3. **Documentation** (`docs/`)
   - Installation guide
   - Usage guide
   - MCP integrations guide

4. **Integrations** (`integrations/`)
   - Supabase schema for analytics
   - Community examples system
   - Feedback collection

5. **CI/CD** (`.github/workflows/`)
   - Automated testing
   - Skill validation
   - Release automation

## Working with This Project

### When Making Changes

1. **Editing the Skill**
   - Edit `unit-testing/SKILL.md` for content changes
   - Edit reference files in `unit-testing/references/`
   - After editing, rebuild: `./build.sh`
   - Test the skill in Claude Code

2. **Adding Examples**
   - Python: Add to `examples/python/`
   - JavaScript: Add to `examples/javascript/`
   - Follow existing patterns (AAA structure, clear comments)
   - Include test coverage
   - Update respective README.md

3. **Updating Documentation**
   - Main docs in `docs/`
   - Keep README.md in sync
   - Update CHANGELOG.md for significant changes

4. **Modifying Integrations**
   - Supabase schema: `integrations/supabase/schema.sql`
   - Test changes on a dev Supabase instance first
   - Document schema changes

### Code Standards

#### Python
- Follow PEP 8
- Use type hints where appropriate
- Descriptive test names: `test_<action>_<condition>_<expected>`
- AAA pattern in tests
- pytest for all examples

#### JavaScript
- ES6+ syntax
- Use `const`/`let`, avoid `var`
- Descriptive test names
- Vitest for examples (Jest-compatible)
- AAA pattern in tests

#### Documentation
- Clear, concise language
- Code examples for complex concepts
- Keep lines under 100 characters in markdown
- Use proper markdown syntax

### Testing

#### Before Committing

```bash
# Python examples
cd examples/python
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pytest -v

# JavaScript examples
cd examples/javascript
npm install
npm test

# Skill validation
unzip -t unit-testing.skill
```

#### CI/CD

- All tests run automatically on push/PR
- Python tests: 3.8, 3.9, 3.10, 3.11, 3.12
- JavaScript tests: Node 18, 20, 22
- Skill file validation
- Markdown linting

### Building the Skill

```bash
# Build the .skill file
./build.sh

# Manual build
cd unit-testing
zip -r ../unit-testing.skill .
```

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with conventional commits: `feat:`, `fix:`, `docs:`, etc.
4. Push and create PR
5. CI must pass before merge

### Commit Message Format

```
<type>: <subject>

[optional body]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Test updates
- `refactor`: Code refactoring
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

## Project Context

### Build in Public Philosophy

This project is developed openly:
- All development happens in public branches
- Clear documentation for every feature
- Community contributions welcome
- Transparent decision-making
- Regular updates via CHANGELOG

### Target Audience

1. **Primary**: Developers learning testing best practices
2. **Secondary**: Teams wanting standardized testing patterns
3. **Tertiary**: Contributors to open-source testing tools

### Key Features to Maintain

- ✅ Comprehensive testing guidance (Python & JavaScript)
- ✅ Practical, working examples
- ✅ TDD workflow documentation
- ✅ Mocking strategies
- ✅ Framework-specific patterns
- ✅ MCP integrations
- ✅ Community features

## Common Tasks

### Adding a New Testing Pattern

1. Update `unit-testing/SKILL.md` with the pattern
2. Add examples to `examples/python/` and/or `examples/javascript/`
3. Update reference docs if advanced
4. Test examples thoroughly
5. Update CHANGELOG.md
6. Rebuild skill: `./build.sh`

### Adding MCP Integration

1. Create directory in `integrations/[mcp-name]/`
2. Add schema/setup files
3. Create README.md with setup instructions
4. Update `docs/integrations.md`
5. Add examples if applicable

### Creating a Release

1. Update CHANGELOG.md with version changes
2. Update version references in docs
3. Commit: `chore: prepare release v0.x.0`
4. Tag: `git tag -a v0.x.0 -m "Release v0.x.0"`
5. Push: `git push origin main --tags`
6. GitHub Actions will create release

## File Organization

### Don't Track
- `__pycache__/`, `*.pyc`
- `node_modules/`
- `venv/`, `env/`
- `.pytest_cache/`, `coverage/`
- `.DS_Store`
- Development environments

### Do Track
- Source code
- Documentation
- Configuration files
- Examples (source only)
- Tests
- CI/CD configs

## Dependencies

### Python
- pytest >= 7.4.0
- pytest-cov >= 4.1.0
- requests >= 2.31.0

### JavaScript
- vitest >= 1.2.0
- @vitest/coverage-v8 >= 1.2.0

### Development
- Git
- Python 3.8+
- Node.js 18+
- Claude Code CLI

## Important Notes

### Skill File (.skill)

- The `.skill` file is a ZIP archive
- Contains `unit-testing/` directory
- Must have valid YAML frontmatter in SKILL.md
- Build with `./build.sh`

### Examples

- Must be working, tested code
- Should demonstrate best practices
- Keep simple for beginners
- Add complexity gradually
- Document thoroughly

### Documentation

- Keep docs in sync with code
- Update CHANGELOG for all changes
- Use clear, beginner-friendly language
- Include code examples

### Community

- Respond to issues promptly
- Welcome all contributors
- Provide constructive feedback
- Acknowledge contributions

## Troubleshooting

### Skill Not Loading
- Check SKILL.md frontmatter format
- Verify .skill is valid ZIP
- Check Claude Code logs

### Tests Failing
- Verify Python/Node versions
- Clean and reinstall dependencies
- Check for platform-specific issues

### Build Issues
- Ensure you're in project root
- Check file permissions
- Verify directory structure

## Resources

- **Claude Code Docs**: https://claude.ai/claude-code
- **pytest Docs**: https://docs.pytest.org
- **Vitest Docs**: https://vitest.dev
- **Supabase Docs**: https://supabase.com/docs

## Questions?

- Check existing [Issues](https://github.com/Dorolfo/Testes-unit-rios---Skill/issues)
- Start a [Discussion](https://github.com/Dorolfo/Testes-unit-rios---Skill/discussions)
- Read [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Note**: This file helps Claude Code understand the project context. Keep it updated as the project evolves.
