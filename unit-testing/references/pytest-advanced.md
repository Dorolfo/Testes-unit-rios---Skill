# Advanced pytest Techniques

## Custom Markers

Mark tests for selective execution:

```python
import pytest

# Define markers in pytest.ini or pyproject.toml
# [tool.pytest.ini_options]
# markers = [
#     "slow: marks tests as slow",
#     "integration: integration tests",
# ]

@pytest.mark.slow
def test_heavy_computation():
    # This test takes a while
    pass

@pytest.mark.integration
def test_database_integration():
    # This needs a database
    pass

# Run only fast tests
# pytest -m "not slow"

# Run only integration tests
# pytest -m integration
```

## Fixture Factories

Create fixtures that return factory functions:

```python
@pytest.fixture
def user_factory():
    """Factory for creating test users"""
    created_users = []
    
    def _create_user(**kwargs):
        defaults = {
            "email": f"user{len(created_users)}@test.com",
            "name": "Test User",
            "role": "member"
        }
        user_data = {**defaults, **kwargs}
        user = User(**user_data)
        created_users.append(user)
        return user
    
    yield _create_user
    
    # Cleanup
    for user in created_users:
        user.delete()

def test_multiple_users(user_factory):
    admin = user_factory(role="admin")
    member = user_factory(role="member")
    assert admin.has_permission("delete")
    assert not member.has_permission("delete")
```

## Parametrize with IDs

Add descriptive IDs to parametrized tests:

```python
@pytest.mark.parametrize(
    "input,expected",
    [
        ("valid@email.com", True),
        ("invalid", False),
        ("", False),
    ],
    ids=["valid_email", "missing_domain", "empty_string"]
)
def test_email_validation(input, expected):
    assert is_valid(input) == expected
```

## Fixture Composition

Fixtures can depend on other fixtures:

```python
@pytest.fixture
def database():
    db = create_test_database()
    yield db
    db.close()

@pytest.fixture
def user(database):
    user = User.create("test@example.com")
    database.add(user)
    yield user
    user.delete()

@pytest.fixture
def logged_in_session(user):
    session = create_session(user)
    yield session
    session.logout()

def test_user_profile(logged_in_session):
    # Has database, user, and session all set up
    profile = logged_in_session.get_profile()
    assert profile.email == "test@example.com"
```

## Monkeypatching

Dynamically modify objects and modules:

```python
def test_environment_variable(monkeypatch):
    monkeypatch.setenv("API_KEY", "test_key_123")
    assert os.getenv("API_KEY") == "test_key_123"

def test_system_exit(monkeypatch):
    def mock_exit(code):
        raise SystemExit(code)
    
    monkeypatch.setattr(sys, "exit", mock_exit)
    with pytest.raises(SystemExit):
        sys.exit(1)
```

## Capsys - Capturing Output

```python
def test_print_output(capsys):
    print("Hello, World!")
    captured = capsys.readouterr()
    assert "Hello" in captured.out

def test_logging(caplog):
    logger.warning("This is a warning")
    assert "warning" in caplog.text
```

## Temporary Directories

```python
def test_file_operations(tmp_path):
    # tmp_path is a pathlib.Path object
    test_file = tmp_path / "test.txt"
    test_file.write_text("test content")
    
    result = process_file(test_file)
    assert result == "processed"
    # tmp_path is automatically cleaned up
```

## Warnings

```python
def test_deprecated_function():
    with pytest.warns(DeprecationWarning):
        deprecated_function()
```

## Approx for Float Comparisons

```python
def test_float_calculation():
    result = calculate_pi()
    assert result == pytest.approx(3.14159, abs=0.001)
```

## Custom Assertions

```python
def assert_user_valid(user):
    __tracebackhide__ = True  # Hide this function from traceback
    assert user.email, "User must have email"
    assert "@" in user.email, "Email must contain @"
    assert user.name, "User must have name"

def test_user_creation():
    user = create_user("test@example.com", "Test User")
    assert_user_valid(user)
```
