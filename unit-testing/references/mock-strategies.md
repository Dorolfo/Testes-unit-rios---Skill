# Comprehensive Mocking Strategies

## Decision Framework: To Mock or Not to Mock

### Always Mock
- **External APIs**: HTTP requests, third-party services
- **System resources**: File system, network, environment variables
- **Non-deterministic functions**: Date/time, random numbers, UUIDs
- **Slow operations**: Database queries, network calls
- **Side effects you want to verify**: Email sending, logging, analytics

### Never Mock
- **The system under test**: The actual code you're testing
- **Simple data structures**: Plain objects, arrays
- **Pure functions**: Functions without side effects
- **Your own business logic**: Test the real implementation

## Python Mocking Patterns

### Basic Patching

```python
from unittest.mock import patch, Mock

# Patch at usage location, not definition location
@patch('myapp.services.user_service.requests.post')
def test_api_call(mock_post):
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {"id": 1}
    
    result = user_service.create_user("test@example.com")
    assert result["id"] == 1
```

### Chained Mocks

```python
# For complex object chains like: db.session.query(User).filter_by(id=1).first()
mock_db = Mock()
mock_db.session.query.return_value.filter_by.return_value.first.return_value = \
    User(id=1, name="Test")
```

### Side Effects

```python
# Return different values on successive calls
mock_func = Mock(side_effect=[1, 2, 3])
assert mock_func() == 1
assert mock_func() == 2

# Raise exception
mock_func = Mock(side_effect=ValueError("Invalid"))
with pytest.raises(ValueError):
    mock_func()
```

### Spec Mocking

```python
# Mock respects the original object's interface
mock_user = Mock(spec=User)
mock_user.name = "Test"  # OK - User has name attribute
mock_user.invalid_attr = "Fail"  # Raises AttributeError
```

### Context Managers

```python
# Mock context managers (with statement)
mock_file = Mock()
mock_file.__enter__.return_value = mock_file
mock_file.read.return_value = "file content"

with patch('builtins.open', return_value=mock_file):
    with open('file.txt') as f:
        content = f.read()
        assert content == "file content"
```

### Async Mocking (Python 3.8+)

```python
from unittest.mock import AsyncMock

@pytest.mark.asyncio
async def test_async_function():
    mock_api = AsyncMock(return_value={"data": "test"})
    
    with patch('myapp.api.fetch_data', mock_api):
        result = await fetch_user_data(123)
        assert result["data"] == "test"
```

## JavaScript Mocking Patterns

### Module Mocking

```javascript
// Automatic mock
vi.mock('./api')
import { fetchUser } from './api'

test('uses mocked module', () => {
  fetchUser.mockResolvedValue({ id: 1, name: 'Test' })
  // Test code here
})

// Manual mock with factory
vi.mock('./api', () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: 1 })),
  createUser: vi.fn()
}))
```

### Partial Mocking

```javascript
// Keep some real implementations
vi.mock('./utils', async () => {
  const actual = await vi.importActual('./utils')
  return {
    ...actual,
    // Override only specific functions
    generateId: vi.fn(() => 'test-id-123')
  }
})
```

### Spies

```javascript
// Spy on existing implementation
const logSpy = vi.spyOn(console, 'log')
console.log('test')
expect(logSpy).toHaveBeenCalledWith('test')

// Spy and modify behavior
const calculateSpy = vi.spyOn(math, 'calculate')
  .mockImplementation((a, b) => a + b + 10)
```

### Mock Return Values

```javascript
const mock = vi.fn()

// Simple return
mock.mockReturnValue(42)

// Resolved promise
mock.mockResolvedValue({ data: 'test' })

// Rejected promise
mock.mockRejectedValue(new Error('API failed'))

// Different values per call
mock
  .mockReturnValueOnce(1)
  .mockReturnValueOnce(2)
  .mockReturnValue(3)
```

### Implementation Mocking

```javascript
const mock = vi.fn()

// Replace implementation
mock.mockImplementation((a, b) => a + b)

// One-time implementation
mock.mockImplementationOnce(() => 'first call')
```

### Constructor Mocking

```javascript
vi.mock('./User', () => {
  return {
    User: vi.fn().mockImplementation((name) => {
      return {
        name,
        save: vi.fn().mockResolvedValue(true)
      }
    })
  }
})
```

## Advanced Patterns

### Dependency Injection Pattern

Instead of mocking, inject dependencies:

```python
# Python
class UserService:
    def __init__(self, api_client=None):
        self.api = api_client or RealAPIClient()
    
    def fetch_user(self, id):
        return self.api.get(f"/users/{id}")

# Testing is easy
def test_fetch_user():
    mock_api = Mock()
    mock_api.get.return_value = {"id": 1, "name": "Test"}
    
    service = UserService(api_client=mock_api)
    result = service.fetch_user(1)
    assert result["name"] == "Test"
```

```javascript
// JavaScript
class UserService {
  constructor(apiClient = new RealAPIClient()) {
    this.api = apiClient
  }
  
  async fetchUser(id) {
    return this.api.get(`/users/${id}`)
  }
}

// Testing is easy
test('fetches user', async () => {
  const mockApi = {
    get: vi.fn().mockResolvedValue({ id: 1, name: 'Test' })
  }
  
  const service = new UserService(mockApi)
  const result = await service.fetchUser(1)
  expect(result.name).toBe('Test')
})
```

### Fake Objects

Create lightweight real implementations for testing:

```python
class FakeDatabase:
    """In-memory database for testing"""
    def __init__(self):
        self.users = {}
    
    def add_user(self, user):
        self.users[user.id] = user
    
    def get_user(self, id):
        return self.users.get(id)
    
    def clear(self):
        self.users.clear()

# Use in tests
def test_user_operations():
    db = FakeDatabase()
    user = User(id=1, name="Test")
    db.add_user(user)
    
    retrieved = db.get_user(1)
    assert retrieved.name == "Test"
```

### Stub Pattern

Provide predetermined responses:

```javascript
class StubPaymentGateway {
  process(amount) {
    // Always succeeds in tests
    return {
      success: true,
      transactionId: 'test-txn-123',
      amount
    }
  }
}

test('processes payment', () => {
  const gateway = new StubPaymentGateway()
  const order = new Order(gateway)
  
  const result = order.checkout(100)
  expect(result.success).toBe(true)
})
```

## Common Pitfalls

### Over-Mocking

```python
# BAD - mocking too much
def test_calculate_total(mocker):
    mocker.patch('myapp.utils.add')
    mocker.patch('myapp.utils.multiply')
    # How do we know the real calculation works?

# GOOD - test real implementation
def test_calculate_total():
    result = calculate_total([10, 20, 30])
    assert result == 60
```

### Mocking at Wrong Level

```python
# BAD - patching at definition
@patch('requests.post')  # Wrong!
def test_api_call(mock_post):
    # This might not work as expected
    pass

# GOOD - patch at usage location
@patch('myapp.services.user_service.requests.post')  # Correct!
def test_api_call(mock_post):
    # Now it works
    pass
```

### Not Verifying Mock Interactions

```python
# BAD - mock is set up but never verified
def test_sends_email(mock_email):
    mock_email.send.return_value = True
    user_service.register_user("test@example.com")
    # Did it actually call send?

# GOOD - verify the interaction
def test_sends_email(mock_email):
    mock_email.send.return_value = True
    user_service.register_user("test@example.com")
    mock_email.send.assert_called_once_with(
        to="test@example.com",
        subject="Welcome!"
    )
```

## When to Use Each Approach

| Scenario | Approach |
|----------|----------|
| External API calls | Mock with responses |
| Database queries | Fake in-memory DB or mock |
| File operations | Mock or temp directory |
| Time/dates | Mock datetime |
| Random values | Mock random generator |
| Email sending | Mock and verify called |
| Complex dependencies | Dependency injection |
| Simple calculations | No mocking - test real code |
