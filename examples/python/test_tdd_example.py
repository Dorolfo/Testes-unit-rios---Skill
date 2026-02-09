"""
TDD (Test-Driven Development) example.

This demonstrates the Red-Green-Refactor cycle by building
a simple shopping cart feature step by step.

Steps:
1. RED: Write a failing test
2. GREEN: Write minimal code to make it pass
3. REFACTOR: Improve the code while keeping tests green
"""

import pytest


# Step 1: RED - Write first test (will fail)
def test_new_cart_is_empty():
    """A new shopping cart should have zero total."""
    cart = ShoppingCart()
    assert cart.total() == 0


# Step 2: GREEN - Minimal implementation
class ShoppingCart:
    """Shopping cart with items."""

    def __init__(self):
        self._items = []

    def total(self) -> float:
        """Calculate total price of all items."""
        return sum(item["price"] * item["quantity"] for item in self._items)


# Step 3: RED - Add test for adding items
def test_add_single_item():
    """Adding an item should increase the total."""
    cart = ShoppingCart()
    cart.add_item("Book", 10.00, quantity=1)
    assert cart.total() == 10.00


# Step 4: GREEN - Implement add_item
class ShoppingCart:
    """Shopping cart with items."""

    def __init__(self):
        self._items = []

    def add_item(self, name: str, price: float, quantity: int = 1) -> None:
        """Add an item to the cart."""
        self._items.append({
            "name": name,
            "price": price,
            "quantity": quantity
        })

    def total(self) -> float:
        """Calculate total price of all items."""
        return sum(item["price"] * item["quantity"] for item in self._items)


# Step 5: RED - Add test for multiple items
def test_add_multiple_items():
    """Adding multiple items should sum correctly."""
    cart = ShoppingCart()
    cart.add_item("Book", 10.00, quantity=2)
    cart.add_item("Pen", 1.50, quantity=3)
    assert cart.total() == 24.50


# Step 6: Already works! Our implementation handles this.


# Step 7: RED - Add test for removing items
def test_remove_item():
    """Removing an item should decrease the total."""
    cart = ShoppingCart()
    cart.add_item("Book", 10.00, quantity=1)
    cart.add_item("Pen", 1.50, quantity=1)

    cart.remove_item("Pen")

    assert cart.total() == 10.00


# Step 8: GREEN - Implement remove_item
class ShoppingCart:
    """Shopping cart with items."""

    def __init__(self):
        self._items = []

    def add_item(self, name: str, price: float, quantity: int = 1) -> None:
        """Add an item to the cart."""
        self._items.append({
            "name": name,
            "price": price,
            "quantity": quantity
        })

    def remove_item(self, name: str) -> None:
        """Remove an item from the cart by name."""
        self._items = [item for item in self._items if item["name"] != name]

    def total(self) -> float:
        """Calculate total price of all items."""
        return sum(item["price"] * item["quantity"] for item in self._items)

    def item_count(self) -> int:
        """Get total number of items in cart."""
        return sum(item["quantity"] for item in self._items)


# Step 9: RED - Add test for clearing cart
def test_clear_cart():
    """Clearing cart should remove all items."""
    cart = ShoppingCart()
    cart.add_item("Book", 10.00)
    cart.add_item("Pen", 1.50)

    cart.clear()

    assert cart.total() == 0
    assert cart.item_count() == 0


# Step 10: GREEN - Implement clear
class ShoppingCart:
    """Shopping cart with items."""

    def __init__(self):
        self._items = []

    def add_item(self, name: str, price: float, quantity: int = 1) -> None:
        """Add an item to the cart."""
        self._items.append({
            "name": name,
            "price": price,
            "quantity": quantity
        })

    def remove_item(self, name: str) -> None:
        """Remove an item from the cart by name."""
        self._items = [item for item in self._items if item["name"] != name]

    def clear(self) -> None:
        """Remove all items from cart."""
        self._items = []

    def total(self) -> float:
        """Calculate total price of all items."""
        return sum(item["price"] * item["quantity"] for item in self._items)

    def item_count(self) -> int:
        """Get total number of items in cart."""
        return sum(item["quantity"] for item in self._items)

    def get_items(self) -> list:
        """Get all items in cart."""
        return self._items.copy()


# Step 11: REFACTOR - Add more tests for edge cases
class TestShoppingCartComplete:
    """Complete test suite for ShoppingCart."""

    @pytest.fixture
    def cart(self):
        """Provide a fresh shopping cart for each test."""
        return ShoppingCart()

    def test_empty_cart_has_zero_total(self, cart):
        """New cart should be empty."""
        assert cart.total() == 0
        assert cart.item_count() == 0

    def test_add_item_with_default_quantity(self, cart):
        """Adding item without quantity should default to 1."""
        cart.add_item("Book", 10.00)
        assert cart.total() == 10.00
        assert cart.item_count() == 1

    def test_add_item_with_custom_quantity(self, cart):
        """Adding item with quantity should multiply price."""
        cart.add_item("Book", 10.00, quantity=3)
        assert cart.total() == 30.00
        assert cart.item_count() == 3

    def test_add_multiple_different_items(self, cart):
        """Adding different items should sum correctly."""
        cart.add_item("Book", 10.00, quantity=2)
        cart.add_item("Pen", 1.50, quantity=3)
        cart.add_item("Notebook", 5.00, quantity=1)
        assert cart.total() == 29.50

    def test_remove_existing_item(self, cart):
        """Removing an item should work correctly."""
        cart.add_item("Book", 10.00)
        cart.add_item("Pen", 1.50)
        cart.remove_item("Pen")
        assert cart.total() == 10.00

    def test_remove_nonexistent_item_does_nothing(self, cart):
        """Removing non-existent item shouldn't crash."""
        cart.add_item("Book", 10.00)
        cart.remove_item("NonExistent")
        assert cart.total() == 10.00

    def test_clear_removes_all_items(self, cart):
        """Clear should empty the cart."""
        cart.add_item("Book", 10.00)
        cart.add_item("Pen", 1.50)
        cart.clear()
        assert cart.total() == 0
        assert len(cart.get_items()) == 0

    @pytest.mark.parametrize("price,quantity,expected", [
        (10.0, 1, 10.0),
        (10.0, 5, 50.0),
        (7.99, 3, 23.97),
    ])
    def test_price_calculations(self, cart, price, quantity, expected):
        """Test various price and quantity combinations."""
        cart.add_item("Item", price, quantity=quantity)
        assert cart.total() == pytest.approx(expected, rel=1e-2)
