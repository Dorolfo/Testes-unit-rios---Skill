"""
Basic unit testing examples using pytest.

These examples demonstrate:
- AAA pattern (Arrange-Act-Assert)
- Simple assertions
- Test organization
- Descriptive test names
"""

import pytest


# Simple calculator class to test
class Calculator:
    """A simple calculator for demonstration purposes."""

    def add(self, a: float, b: float) -> float:
        """Add two numbers."""
        return a + b

    def subtract(self, a: float, b: float) -> float:
        """Subtract b from a."""
        return a - b

    def multiply(self, a: float, b: float) -> float:
        """Multiply two numbers."""
        return a * b

    def divide(self, a: float, b: float) -> float:
        """Divide a by b."""
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b


class TestCalculatorBasic:
    """Basic calculator tests following AAA pattern."""

    def test_add_positive_numbers(self):
        """Test adding two positive numbers."""
        # Arrange
        calc = Calculator()

        # Act
        result = calc.add(2, 3)

        # Assert
        assert result == 5

    def test_add_negative_numbers(self):
        """Test adding negative numbers."""
        # Arrange
        calc = Calculator()

        # Act
        result = calc.add(-2, -3)

        # Assert
        assert result == -5

    def test_subtract_returns_correct_result(self):
        """Test subtraction with positive numbers."""
        calc = Calculator()
        result = calc.subtract(10, 4)
        assert result == 6

    def test_multiply_by_zero_returns_zero(self):
        """Test multiplication by zero."""
        calc = Calculator()
        result = calc.multiply(5, 0)
        assert result == 0

    def test_divide_normal_numbers(self):
        """Test division of two numbers."""
        calc = Calculator()
        result = calc.divide(10, 2)
        assert result == 5.0

    def test_divide_by_zero_raises_error(self):
        """Test that dividing by zero raises ValueError."""
        calc = Calculator()

        with pytest.raises(ValueError, match="Cannot divide by zero"):
            calc.divide(10, 0)


# Parametrized tests
class TestCalculatorParametrized:
    """Parametrized tests for testing multiple inputs efficiently."""

    @pytest.mark.parametrize("a,b,expected", [
        (1, 1, 2),
        (2, 3, 5),
        (0, 0, 0),
        (-1, 1, 0),
        (100, 200, 300),
    ])
    def test_addition_multiple_cases(self, a, b, expected):
        """Test addition with multiple input combinations."""
        calc = Calculator()
        assert calc.add(a, b) == expected

    @pytest.mark.parametrize("a,b,expected", [
        (10, 5, 5),
        (0, 5, -5),
        (-5, -5, 0),
        (100, 1, 99),
    ])
    def test_subtraction_multiple_cases(self, a, b, expected):
        """Test subtraction with multiple inputs."""
        calc = Calculator()
        assert calc.subtract(a, b) == expected


# Fixtures example
@pytest.fixture
def calculator():
    """Fixture that provides a Calculator instance."""
    return Calculator()


def test_using_fixture(calculator):
    """Test using a fixture for setup."""
    # Calculator is already arranged via fixture
    result = calculator.add(5, 5)
    assert result == 10


@pytest.fixture
def complex_calculator():
    """Fixture that provides a configured calculator."""
    calc = Calculator()
    # Could add more setup here
    yield calc
    # Teardown code would go here


def test_using_complex_fixture(complex_calculator):
    """Test using fixture with setup/teardown."""
    result = complex_calculator.multiply(3, 4)
    assert result == 12
