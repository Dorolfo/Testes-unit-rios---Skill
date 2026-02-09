# Usage Guide

Learn how to use the Unit Testing Skill effectively with Claude Code.

## Basic Usage

### Automatic Triggering

The skill automatically activates when you mention testing-related keywords:

```
"Help me write unit tests for this function"
"How do I mock this API call?"
"Explain the AAA pattern"
"Show me TDD workflow"
```

### Explicit Invocation

You can explicitly call the skill:

```
@unit-testing help me structure my test files
@unit-testing show mocking strategies for Python
```

## Common Use Cases

### 1. Writing Your First Test

Ask Claude Code to help you write tests:

```
I have this function:

def calculate_discount(price, discount_percent):
    return price * (1 - discount_percent / 100)

Help me write unit tests for it.
```

Claude Code will provide:
- Test structure using AAA pattern
- Multiple test cases
- Edge case handling
- Best practices

### 2. Structuring Test Files

Ask for guidance on organization:

```
I'm starting a new Python project. How should I organize my tests?
```

You'll get:
- Directory structure recommendations
- Naming conventions
- Import patterns
- Fixture organization

### 3. Mocking External Dependencies

Get help with mocking:

```
I have a function that calls an external API. How do I mock it in pytest?
```

Learn about:
- When to mock
- How to use unittest.mock
- Verifying mock calls
- Mock best practices

### 4. TDD Workflow

Learn Test-Driven Development:

```
Teach me TDD workflow with a practical example
```

Get:
- Red-Green-Refactor explanation
- Step-by-step example
- Best practices
- Common pitfalls

### 5. Framework-Specific Help

Get framework-specific guidance:

```
# For Python
Show me advanced pytest features

# For JavaScript
How do I use Vitest matchers?

# For both
Compare pytest and Jest approaches
```

## Advanced Usage

### Parametrized Tests

```
How do I test the same function with multiple inputs in pytest?
```

Learn about:
- `@pytest.mark.parametrize`
- `test.each()` in Jest/Vitest
- Test data organization

### Integration Tests

```
How do I write integration tests for my API?
```

Get guidance on:
- Integration vs unit tests
- Database setup/teardown
- API testing patterns
- Test fixtures

### Coverage Analysis

```
How do I measure and improve test coverage?
```

Learn:
- Using pytest-cov
- Coverage reports
- Coverage targets
- What to prioritize

### Custom Fixtures

```
How do I create reusable test fixtures in pytest?
```

Understand:
- Fixture scopes
- Fixture dependencies
- Setup/teardown patterns
- Fixture best practices

## Examples from the Repository

### Python Examples

```bash
cd examples/python

# Run basic tests
pytest test_basic.py -v

# Run mocking examples
pytest test_mocking.py -v

# Run TDD example
pytest test_tdd_example.py -v
```

Reference these in your questions:

```
Look at examples/python/test_mocking.py -
how would I adapt this for my use case?
```

### JavaScript Examples

```bash
cd examples/javascript

# Run basic tests
npm test basic.test.js

# Run with watch mode
npm run test:watch
```

Reference in questions:

```
I saw the mocking example in examples/javascript/mocking.test.js -
can you help me apply this to my code?
```

## Tips for Best Results

### 1. Provide Context

**Good:**
```
I'm testing a user authentication function in Python using pytest.
Here's the function: [code]
How do I mock the database calls?
```

**Less effective:**
```
How do I mock stuff?
```

### 2. Share Your Code

Include the code you're testing:

```
I need to test this:

class UserService:
    def __init__(self, db):
        self.db = db

    def get_user(self, user_id):
        return self.db.query(User).filter_by(id=user_id).first()

Help me write tests with proper mocking.
```

### 3. Specify Your Framework

Be explicit about what you're using:

```
I'm using pytest with Python 3.11. How do I...
```

```
My project uses Vitest. Show me how to...
```

### 4. Ask About Specific Patterns

Reference patterns from the skill:

```
The skill mentions the AAA pattern. Can you show me how to apply it to [my code]?
```

### 5. Request Examples

Ask for concrete examples:

```
Show me a complete example of mocking datetime in pytest
```

## Common Workflows

### Writing Tests for Existing Code

1. Share the function/class you want to test
2. Ask for test structure
3. Request edge cases to cover
4. Get help with mocking dependencies

### Starting TDD on New Feature

1. Describe the feature
2. Ask for test-first approach
3. Follow Red-Green-Refactor
4. Request refactoring suggestions

### Improving Test Coverage

1. Share coverage report
2. Ask which areas to prioritize
3. Get patterns for hard-to-test code
4. Learn about test strategies

### Refactoring Tests

1. Share existing tests
2. Ask for improvements
3. Learn better patterns
4. Reduce duplication

## Integration with MCP Servers

The skill works great with MCP servers. See [integrations.md](integrations.md) for:

- Supabase integration for tracking patterns
- Playwright for E2E testing
- Firecrawl for fetching examples

## Getting More Help

### In this Repository

- **Examples**: Check `examples/` directory
- **References**: Read `unit-testing/references/` for deep dives
- **Issues**: Search GitHub issues for similar questions

### Community

- **Discussions**: Ask in GitHub Discussions
- **Issues**: Report problems or request features
- **PRs**: Contribute your own patterns

## Quick Reference

### Trigger Keywords

- testing, tests, unit tests
- TDD, test-driven
- mocking, mock, spy
- pytest, Jest, Vitest
- assertions, expect
- fixtures, setup, teardown
- coverage, test coverage

### Common Commands

```
Help me write tests for [function]
Show me mocking patterns for [language]
Explain [pattern/concept]
How do I test [scenario]?
What's the best way to [testing task]?
Review my tests: [code]
```

## Next Steps

- Explore [MCP Integrations](integrations.md)
- Check [Installation Guide](installation.md)
- Try the [Examples](../examples/)
- Read the [Contributing Guide](../CONTRIBUTING.md)
