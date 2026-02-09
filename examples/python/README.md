# Python Testing Examples

This directory contains practical examples of unit testing with pytest.

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Running Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest test_basic.py

# Run with coverage
pytest --cov=. --cov-report=html

# Run and stop on first failure
pytest -x
```

## Examples Included

### test_basic.py
- Basic AAA pattern examples
- Simple assertions
- Parametrized tests
- Fixtures usage

### test_mocking.py
- Mocking external API calls
- Mocking time/dates
- Mock verification
- Side effects

### test_tdd_example.py
- Complete TDD workflow
- Red-Green-Refactor cycle
- Shopping cart example
- Edge case testing

## Learning Path

1. Start with `test_basic.py` to learn fundamentals
2. Move to `test_mocking.py` for dependency management
3. Study `test_tdd_example.py` for TDD workflow
