---
name: unit-testing
description: Comprehensive guidance for writing, organizing, and maintaining unit tests, integration tests, and test-driven development (TDD) in Python and JavaScript. Use this skill when the user mentions testing, unit tests, test coverage, mocking, test frameworks, TDD, pytest, Jest, Vitest, test assertions, test patterns, or wants to improve their testing strategy. Also trigger when discussing code quality, CI/CD pipelines, or refactoring - testing is fundamental to these workflows.
---

# Unit Testing Best Practices & Patterns

A comprehensive guide for writing effective tests in Python and JavaScript, covering unit tests, integration tests, mocking strategies, and TDD workflows.

## Philosophy: Why These Patterns Matter

Testing isn't just about catching bugs - it's about **designing better systems**. Good tests:
- **Document intent**: Tests show how code should be used
- **Enable fearless refactoring**: Change internals without breaking contracts
- **Provide fast feedback**: Catch issues before they reach production
- **Guide design**: If it's hard to test, it's probably hard to use

The patterns in this skill prioritize:
1. **Readability over cleverness** - tests are documentation
2. **Independence** - tests shouldn't depend on each other
3. **Speed** - fast tests get run more often
4. **Determinism** - tests should never be flaky

## Test Structure: AAA Pattern

Every test should follow Arrange-Act-Assert (AAA):

```python
# Python example
def test_user_registration():
    # Arrange - set up test data and environment
    user_data = {"email": "test@example.com", "password": "secure123"}
    
    # Act - execute the behavior being tested
    result = register_user(user_data)
    
    # Assert - verify the outcome
    assert result.success is True
    assert result.user.email == "test@example.com"
```

```javascript
// JavaScript example
test('user registration creates account', () => {
  // Arrange
  const userData = { email: 'test@example.com', password: 'secure123' }
  
  // Act
  const result = registerUser(userData)
  
  // Assert
  expect(result.success).toBe(true)
  expect(result.user.email).toBe('test@example.com')
})
```

**Why this matters**: Clear structure makes tests self-documenting. Anyone can see what's being tested and why it might fail.

## Naming Conventions

Test names should be **specific sentences** describing behavior:

**Good naming:**
```python
# Python - descriptive function names
def test_empty_cart_shows_zero_total()
def test_expired_coupon_raises_validation_error()
def test_admin_can_delete_any_post()
```

```javascript
// JavaScript - natural language descriptions
test('empty cart shows zero total', () => {})
test('expired coupon raises validation error', () => {})
test('admin can delete any post', () => {})
```

**Avoid vague names:**
```python
# Bad - too vague
def test_cart()
def test_coupon_validation()
def test_permissions()
```

**Pattern for complex scenarios:**
```
test_[action]_when_[condition]_then_[outcome]

Examples:
- test_checkout_when_cart_empty_then_raises_error
- test_login_when_password_wrong_then_returns_unauthorized
```

## Test Organization

### Python (pytest)

```python
# tests/test_users.py
import pytest
from myapp.users import UserService

class TestUserRegistration:
    """Group related tests in classes for clarity"""
    
    def test_valid_email_creates_account(self):
        service = UserService()
        result = service.register("valid@email.com", "pass123")
        assert result.success
    
    def test_duplicate_email_raises_error(self):
        service = UserService()
        service.register("dup@email.com", "pass123")
        
        with pytest.raises(DuplicateEmailError):
            service.register("dup@email.com", "other_pass")
```

### JavaScript (Jest/Vitest)

```javascript
// tests/users.test.js
import { describe, test, expect } from 'vitest' // or 'jest'
import { UserService } from '../src/users'

describe('UserRegistration', () => {
  test('valid email creates account', () => {
    const service = new UserService()
    const result = service.register('valid@email.com', 'pass123')
    expect(result.success).toBe(true)
  })
})
```

**Directory structure:**
```
project/
├── src/  (or myapp/)
│   ├── users.py
│   └── payments.py
└── tests/
    ├── test_users.py
    ├── test_payments.py
    └── fixtures/
        └── sample_data.json
```

## Fixtures and Test Data

### Python Fixtures (pytest)

```python
import pytest

@pytest.fixture
def sample_user():
    """Reusable test data - created fresh for each test"""
    return {
        "email": "test@example.com",
        "name": "Test User",
        "role": "member"
    }

@pytest.fixture
def db_session():
    """Setup/teardown pattern"""
    session = create_test_database()
    yield session  # test runs here
    session.close()  # cleanup after test

def test_user_creation(sample_user, db_session):
    """Fixtures automatically injected"""
    user = User.create(sample_user)
    db_session.add(user)
    assert user.email == sample_user["email"]
```

**Fixture scopes for efficiency:**
```python
@pytest.fixture(scope="function")  # default - new for each test
def user_data():
    return {"email": "test@example.com"}

@pytest.fixture(scope="session")  # created once per test session
def docker_container():
    container = start_container()
    yield container
    container.stop()
```

### JavaScript Fixtures

```javascript
// fixtures/users.js
export const sampleUser = {
  email: 'test@example.com',
  name: 'Test User',
  role: 'member'
}

// Using beforeEach for setup/teardown
import { beforeEach, afterEach, test } from 'vitest'

describe('UserService', () => {
  let dbSession
  
  beforeEach(() => {
    dbSession = createTestDatabase()
  })
  
  afterEach(() => {
    dbSession.close()
  })
  
  test('creates user with valid data', () => {
    const user = new User(sampleUser)
    dbSession.add(user)
    expect(user.email).toBe(sampleUser.email)
  })
})
```

## Mocking Strategies

### When to Mock

**DO mock:**
- External APIs (HTTP requests, third-party services)
- Database calls (use in-memory DB for integration tests)
- File system operations
- Time/dates (for deterministic tests)
- Random number generators

**DON'T mock:**
- Code you own and can test directly
- Simple data structures
- Pure functions without side effects
- The thing you're actually testing

### Python Mocking (unittest.mock)

```python
from unittest.mock import Mock, patch
import pytest

# Mock external API calls
@patch('myapp.api.requests.get')
def test_fetch_user_data(mock_get):
    # Arrange - control external API response
    mock_get.return_value.json.return_value = {
        "id": 123,
        "name": "John Doe"
    }
    
    # Act
    user = fetch_user_from_api(123)
    
    # Assert
    assert user.name == "John Doe"
    mock_get.assert_called_once_with("https://api.example.com/users/123")

# Mock time for deterministic tests
@patch('myapp.utils.datetime')
def test_coupon_expiration(mock_datetime):
    mock_datetime.now.return_value = datetime(2025, 2, 9, 12, 0)
    
    coupon = Coupon(expires_at=datetime(2025, 2, 9, 11, 0))
    assert coupon.is_expired() is True
```

### JavaScript Mocking (Jest/Vitest)

```javascript
import { vi, test, expect } from 'vitest'
import { fetchUserData } from './api'
import { UserService } from './users'

// Mock entire module
vi.mock('./api', () => ({
  fetchUserData: vi.fn()
}))

test('loads user from API', async () => {
  // Arrange - control mock return value
  fetchUserData.mockResolvedValue({
    id: 123,
    name: 'John Doe'
  })
  
  // Act
  const service = new UserService()
  const user = await service.loadUser(123)
  
  // Assert
  expect(user.name).toBe('John Doe')
  expect(fetchUserData).toHaveBeenCalledWith(123)
})

// Mock timers
test('debounce delays execution', () => {
  vi.useFakeTimers()
  const callback = vi.fn()
  const debounced = debounce(callback, 1000)
  
  debounced()
  expect(callback).not.toHaveBeenCalled()
  
  vi.advanceTimersByTime(1000)
  expect(callback).toHaveBeenCalledOnce()
  
  vi.useRealTimers()
})
```

## Test-Driven Development (TDD)

TDD cycle: **Red → Green → Refactor**

**Full TDD example - Building a shopping cart:**

```python
# Step 1: RED - Test for empty cart
def test_new_cart_is_empty():
    cart = ShoppingCart()
    assert cart.total() == 0
# Run test → FAILS (ShoppingCart doesn't exist yet)

# Step 2: GREEN - Minimal implementation
class ShoppingCart:
    def total(self):
        return 0
# Run test → PASSES

# Step 3: RED - Test adding items
def test_adding_item_increases_total():
    cart = ShoppingCart()
    cart.add_item("Book", 10.00)
    assert cart.total() == 10.00
# Run test → FAILS (add_item doesn't exist)

# Step 4: GREEN - Implement add_item
class ShoppingCart:
    def __init__(self):
        self.items = []
    
    def add_item(self, name, price):
        self.items.append({"name": name, "price": price})
    
    def total(self):
        return sum(item["price"] for item in self.items)
# Run test → PASSES

# Step 5: REFACTOR - Clean up
class ShoppingCart:
    def __init__(self):
        self._items = []
    
    def add_item(self, name: str, price: float) -> None:
        self._items.append({"name": name, "price": price})
    
    def total(self) -> float:
        return sum(item["price"] for item in self._items)
# Run tests → ALL PASS
```

**TDD Benefits:**
- Forces you to think about API before implementation
- Ensures every line of code has a test
- Prevents over-engineering
- Provides immediate feedback on design decisions

## Integration Tests

Integration tests verify that multiple components work together. They're slower but catch issues unit tests miss.

### Python Integration Test Example

```python
# tests/integration/test_user_flow.py
import pytest
from myapp import create_app
from myapp.database import db

@pytest.fixture
def client(app):
    """Test client for making requests"""
    return app.test_client()

class TestUserRegistrationFlow:
    """End-to-end test of registration process"""
    
    def test_complete_registration_flow(self, client):
        # Step 1: Register new user
        response = client.post('/api/register', json={
            'email': 'newuser@example.com',
            'password': 'secure_password_123'
        })
        assert response.status_code == 201
        
        # Step 2: Verify user can log in
        response = client.post('/api/login', json={
            'email': 'newuser@example.com',
            'password': 'secure_password_123'
        })
        assert response.status_code == 200
        assert 'token' in response.get_json()
```

**Integration vs Unit Tests:**
- **Unit**: Fast, isolated, test single functions/classes
- **Integration**: Slower, test multiple components together
- **Ratio**: Aim for ~80% unit, ~20% integration (test pyramid)

## Parametrized Tests

Run same test with different inputs:

### Python (pytest)

```python
import pytest

@pytest.mark.parametrize("input,expected", [
    ("hello@example.com", True),
    ("invalid.email", False),
    ("test@domain.co.uk", True),
    ("@nodomain.com", False),
])
def test_email_validation(input, expected):
    assert is_valid_email(input) == expected
```

### JavaScript

```javascript
test.each([
  ['hello@example.com', true],
  ['invalid.email', false],
  ['test@domain.co.uk', true],
  ['@nodomain.com', false],
])('validates email: %s → %s', (input, expected) => {
  expect(isValidEmail(input)).toBe(expected)
})
```

## Test Coverage

Coverage measures which code lines are executed during tests.

### Python Coverage

```bash
# Install
pip install pytest-cov

# Run with coverage report
pytest --cov=myapp tests/

# Generate HTML report
pytest --cov=myapp --cov-report=html tests/

# Check minimum coverage threshold
pytest --cov=myapp --cov-fail-under=80 tests/
```

### JavaScript Coverage

```bash
# Run with coverage
npm test -- --coverage

# Or with jest
jest --coverage
```

**Coverage targets:**
- Critical business logic: >90%
- Utils and helpers: >80%
- UI components: >70%

## Common Anti-Patterns to Avoid

### 1. Testing Implementation Details

```python
# BAD - tests internal method names
def test_user_service():
    service = UserService()
    service._internal_validate()  # Testing private method

# GOOD - tests behavior
def test_user_service():
    service = UserService()
    result = service.create_user("test@example.com")
    assert result.success is True
```

### 2. Test Interdependence

```python
# BAD - tests depend on each other
class TestUserCRUD:
    user_id = None
    
    def test_create_user(self):
        user = create_user()
        TestUserCRUD.user_id = user.id  # Shared state

# GOOD - each test is independent
class TestUserCRUD:
    def test_create_user(self):
        user = create_user()
        assert user.id is not None
    
    def test_update_user(self):
        user = create_user()  # Fresh for this test
        result = update_user(user.id, ...)
        assert result.success
```

### 3. Over-Mocking

```python
# BAD - mocking everything
def test_order_total(mocker):
    mocker.patch('myapp.models.Product')
    mocker.patch('myapp.services.PriceCalculator')
    # Can't tell if real code works!

# GOOD - only mock external dependencies
def test_order_total(mocker):
    mocker.patch('myapp.external.tax_api.get_tax_rate', return_value=0.08)
    order = Order([Product("Book", 10)])
    assert order.total() == 10.80
```

## Running Tests

### Python (pytest)

```bash
pytest                     # Run all tests
pytest -v                  # Verbose
pytest --cov=myapp        # With coverage
pytest -k "pattern"       # Filter by name
pytest -x                 # Stop on first fail
```

### JavaScript (Vitest/Jest)

```bash
npm test                  # Run all tests
npm test -- --watch      # Watch mode
npm test -- --coverage   # With coverage
```

## Additional Resources

For framework-specific deep dives and advanced patterns, see the references directory:
- Read `references/pytest-advanced.md` for advanced pytest techniques
- Read `references/jest-advanced.md` for Jest/Vitest specific patterns  
- Read `references/mock-strategies.md` for comprehensive mocking guide
