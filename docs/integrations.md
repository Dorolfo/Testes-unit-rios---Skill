# MCP Integrations

This skill integrates with various Claude Code MCP (Model Context Protocol) servers to provide enhanced functionality.

## Available Integrations

### 🗄️ Supabase Integration

Track testing patterns usage, store community examples, and gather feedback.

#### Features

- **Usage Analytics**: Track which testing patterns are most used
- **Community Examples**: Store and share testing examples
- **Feedback System**: Collect and analyze user feedback
- **Pattern Popularity**: See trending testing patterns

#### Setup

1. **Install Supabase MCP**:
   ```bash
   # The Supabase MCP is built into Claude Code
   # Configure it in your settings
   ```

2. **Configure Database**:
   ```sql
   -- Create tables for tracking
   CREATE TABLE skill_usage (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     pattern_name TEXT NOT NULL,
     language TEXT NOT NULL,
     timestamp TIMESTAMPTZ DEFAULT NOW(),
     context JSONB
   );

   CREATE TABLE community_examples (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     title TEXT NOT NULL,
     description TEXT,
     code TEXT NOT NULL,
     language TEXT NOT NULL,
     framework TEXT,
     upvotes INT DEFAULT 0,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE TABLE feedback (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     rating INT CHECK (rating >= 1 AND rating <= 5),
     comment TEXT,
     pattern_name TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **Usage in Claude Code**:
   ```
   # Track usage automatically when you use patterns
   "Show me pytest mocking examples"

   # Query analytics
   "What are the most popular testing patterns?"

   # Submit examples
   "Save this as a community example"
   ```

#### Example Queries

**Get Popular Patterns**:
```sql
SELECT pattern_name, language, COUNT(*) as usage_count
FROM skill_usage
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY pattern_name, language
ORDER BY usage_count DESC
LIMIT 10;
```

**Find Community Examples**:
```sql
SELECT title, description, language, upvotes
FROM community_examples
WHERE language = 'Python'
ORDER BY upvotes DESC, created_at DESC;
```

### 🎭 Playwright Integration

Integrate E2E testing examples and patterns.

#### Features

- **E2E Test Examples**: Access end-to-end testing patterns
- **Browser Automation**: Test web applications
- **Visual Testing**: Screenshot comparisons
- **Integration Patterns**: Connect unit tests to E2E tests

#### Setup

Playwright MCP is built into Claude Code.

#### Usage

```
# Get E2E testing guidance
"How do I combine unit tests with Playwright E2E tests?"

# Test web applications
"Write Playwright tests for my login page"

# Integration patterns
"Show me how to share fixtures between unit and E2E tests"
```

#### Example Integration

```python
# tests/conftest.py - Shared fixtures
import pytest
from playwright.sync_api import sync_playwright

@pytest.fixture(scope="session")
def browser():
    """Shared browser instance for E2E tests."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        yield browser
        browser.close()

@pytest.fixture
def page(browser):
    """New page for each test."""
    page = browser.new_page()
    yield page
    page.close()
```

```python
# tests/unit/test_auth.py - Unit tests
def test_validate_password():
    assert validate_password("secure123") is True

# tests/e2e/test_login.py - E2E tests
def test_login_flow(page):
    page.goto("http://localhost:3000/login")
    page.fill("#username", "testuser")
    page.fill("#password", "secure123")
    page.click("#login-button")
    assert "Dashboard" in page.title()
```

### 🔥 Firecrawl Integration

Fetch real-world testing examples from open source projects.

#### Features

- **Learn from OSS**: See how popular projects test
- **Pattern Discovery**: Find testing patterns in the wild
- **Best Practices**: Learn from production code
- **Framework Examples**: See framework-specific patterns

#### Setup

Firecrawl MCP is available in Claude Code.

#### Usage

```
# Find examples from GitHub
"Find pytest examples in the Flask repository"

# Learn patterns
"How does Django test database interactions?"

# Discover practices
"Show me testing patterns from FastAPI projects"
```

#### Example Searches

**Find Mocking Patterns**:
```
Search GitHub for pytest mocking patterns in top Python projects
```

**Framework Patterns**:
```
How does React Testing Library handle async tests in popular repos?
```

**Best Practices**:
```
Find test organization patterns in enterprise Python projects
```

### 🔗 Custom MCP Integrations

Create your own integrations!

#### Building a Custom Integration

```python
# my_testing_mcp/server.py
from anthropic import MCP

class TestingMCPServer:
    def __init__(self):
        self.patterns = {}

    async def get_pattern(self, name: str) -> dict:
        """Fetch a testing pattern."""
        return self.patterns.get(name)

    async def save_pattern(self, pattern: dict) -> str:
        """Save a new pattern."""
        pattern_id = generate_id()
        self.patterns[pattern_id] = pattern
        return pattern_id

# Register with MCP
server = TestingMCPServer()
mcp = MCP(server)
```

## Integration Patterns

### Combining Multiple MCPs

Use multiple MCP servers together:

```
# Use Supabase to track + Firecrawl to discover
"Find popular pytest patterns (Firecrawl) and track my usage (Supabase)"

# Use Playwright + Supabase
"Run E2E tests and save results to database"
```

### Data Flow

```
User Query
    ↓
Unit Testing Skill
    ↓
    ├─→ Supabase (track usage)
    ├─→ Firecrawl (fetch examples)
    └─→ Playwright (run tests)
    ↓
Combined Response
```

## Configuration Examples

### Claude Code Config

```json
{
  "skills": {
    "unit-testing": {
      "enabled": true,
      "integrations": {
        "supabase": {
          "enabled": true,
          "track_usage": true,
          "project_url": "https://your-project.supabase.co"
        },
        "firecrawl": {
          "enabled": true,
          "fetch_examples": true
        },
        "playwright": {
          "enabled": true
        }
      }
    }
  }
}
```

### Environment Variables

```bash
# .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
FIRECRAWL_API_KEY=your-api-key
```

## Use Cases

### 1. Learning from Real Projects

```
Using Firecrawl, show me how pytest is used in the Requests library
```

### 2. Tracking Team Patterns

```
Use Supabase to track which testing patterns our team uses most
```

### 3. Full-Stack Testing

```
Help me set up tests using:
- Unit tests for backend
- Playwright E2E for frontend
- Store results in Supabase
```

### 4. Community Contributions

```
Share my testing pattern to the community:
[Your pattern code]

Save this to Supabase for others to use
```

## Analytics Dashboard

### Querying Usage Data

```sql
-- Most popular patterns this month
SELECT
  pattern_name,
  language,
  COUNT(*) as uses,
  COUNT(DISTINCT DATE(timestamp)) as active_days
FROM skill_usage
WHERE timestamp > DATE_TRUNC('month', NOW())
GROUP BY pattern_name, language
ORDER BY uses DESC;

-- Framework distribution
SELECT
  context->>'framework' as framework,
  COUNT(*) as count
FROM skill_usage
WHERE context->>'framework' IS NOT NULL
GROUP BY framework;

-- User feedback summary
SELECT
  pattern_name,
  AVG(rating) as avg_rating,
  COUNT(*) as total_ratings
FROM feedback
GROUP BY pattern_name
HAVING COUNT(*) >= 5
ORDER BY avg_rating DESC;
```

## Privacy & Data

### What's Tracked

- Pattern usage (anonymous)
- Language and framework
- Timestamp
- General context (no personal code)

### What's NOT Tracked

- Your actual code
- Personal information
- Project details
- Sensitive data

### Opt-Out

To disable tracking:

```json
{
  "skills": {
    "unit-testing": {
      "integrations": {
        "supabase": {
          "track_usage": false
        }
      }
    }
  }
}
```

## Contributing Integrations

Have an idea for an integration?

1. **Open an issue**: Describe your integration idea
2. **Discuss design**: Work with maintainers on approach
3. **Build prototype**: Create proof of concept
4. **Submit PR**: Add documentation and examples
5. **Share with community**: Help others use it

## Troubleshooting

### Supabase Connection Issues

```bash
# Test connection
curl https://your-project.supabase.co/rest/v1/skill_usage \
  -H "apikey: your-anon-key"
```

### Playwright Issues

```bash
# Install browsers
npx playwright install

# Run in headed mode for debugging
pytest --headed
```

### Firecrawl Rate Limits

```
# Configure retry logic
FIRECRAWL_RETRY_LIMIT=3
FIRECRAWL_RETRY_DELAY=1000
```

## Next Steps

- Set up [Supabase tracking](#-supabase-integration)
- Try [Playwright E2E tests](#-playwright-integration)
- Explore [Firecrawl examples](#-firecrawl-integration)
- Build [custom integration](#-custom-mcp-integrations)

## Resources

- [MCP Documentation](https://claude.ai/mcp)
- [Supabase Docs](https://supabase.com/docs)
- [Playwright Docs](https://playwright.dev)
- [Firecrawl Docs](https://firecrawl.dev)
