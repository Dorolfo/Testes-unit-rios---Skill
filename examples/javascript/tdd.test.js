/**
 * TDD (Test-Driven Development) example.
 *
 * This demonstrates the Red-Green-Refactor cycle by building
 * a shopping cart feature step by step.
 */

import { describe, test, expect, beforeEach } from 'vitest'

/**
 * ShoppingCart class - Built using TDD
 *
 * Development steps:
 * 1. RED: Write failing test
 * 2. GREEN: Write minimal code to pass
 * 3. REFACTOR: Improve while keeping tests green
 */
class ShoppingCart {
  constructor() {
    this._items = []
  }

  addItem(name, price, quantity = 1) {
    this._items.push({ name, price, quantity })
  }

  removeItem(name) {
    this._items = this._items.filter(item => item.name !== name)
  }

  clear() {
    this._items = []
  }

  total() {
    return this._items.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)
  }

  itemCount() {
    return this._items.reduce((count, item) => {
      return count + item.quantity
    }, 0)
  }

  getItems() {
    return [...this._items]
  }

  updateQuantity(name, newQuantity) {
    const item = this._items.find(item => item.name === name)
    if (item) {
      item.quantity = newQuantity
    }
  }

  hasItem(name) {
    return this._items.some(item => item.name === name)
  }
}

// Step 1: RED - Test for empty cart
describe('ShoppingCart - TDD Journey', () => {
  test('new cart is empty', () => {
    const cart = new ShoppingCart()
    expect(cart.total()).toBe(0)
  })

  // Step 3: RED - Test for adding items
  test('adding single item increases total', () => {
    const cart = new ShoppingCart()
    cart.addItem('Book', 10.00, 1)
    expect(cart.total()).toBe(10.00)
  })

  // Step 5: RED - Test for multiple items
  test('adding multiple items sums correctly', () => {
    const cart = new ShoppingCart()
    cart.addItem('Book', 10.00, 2)
    cart.addItem('Pen', 1.50, 3)
    expect(cart.total()).toBe(24.50)
  })

  // Step 7: RED - Test for removing items
  test('removing item decreases total', () => {
    const cart = new ShoppingCart()
    cart.addItem('Book', 10.00)
    cart.addItem('Pen', 1.50)

    cart.removeItem('Pen')

    expect(cart.total()).toBe(10.00)
  })

  // Step 9: RED - Test for clearing cart
  test('clearing cart removes all items', () => {
    const cart = new ShoppingCart()
    cart.addItem('Book', 10.00)
    cart.addItem('Pen', 1.50)

    cart.clear()

    expect(cart.total()).toBe(0)
    expect(cart.itemCount()).toBe(0)
  })
})

// Step 11: REFACTOR - Complete test suite with edge cases
describe('ShoppingCart - Complete Suite', () => {
  let cart

  beforeEach(() => {
    cart = new ShoppingCart()
  })

  describe('initialization', () => {
    test('starts with zero total', () => {
      expect(cart.total()).toBe(0)
    })

    test('starts with zero items', () => {
      expect(cart.itemCount()).toBe(0)
    })

    test('starts with empty items list', () => {
      expect(cart.getItems()).toEqual([])
    })
  })

  describe('adding items', () => {
    test('adds item with default quantity', () => {
      cart.addItem('Book', 10.00)
      expect(cart.total()).toBe(10.00)
      expect(cart.itemCount()).toBe(1)
    })

    test('adds item with custom quantity', () => {
      cart.addItem('Book', 10.00, 3)
      expect(cart.total()).toBe(30.00)
      expect(cart.itemCount()).toBe(3)
    })

    test('adds multiple different items', () => {
      cart.addItem('Book', 10.00, 2)
      cart.addItem('Pen', 1.50, 3)
      cart.addItem('Notebook', 5.00)

      expect(cart.total()).toBe(29.50)
      expect(cart.itemCount()).toBe(6)
    })

    test('handles decimal prices correctly', () => {
      cart.addItem('Item', 7.99, 3)
      expect(cart.total()).toBeCloseTo(23.97, 2)
    })
  })

  describe('removing items', () => {
    beforeEach(() => {
      cart.addItem('Book', 10.00)
      cart.addItem('Pen', 1.50)
    })

    test('removes existing item', () => {
      cart.removeItem('Pen')
      expect(cart.total()).toBe(10.00)
      expect(cart.hasItem('Pen')).toBe(false)
    })

    test('handles removing non-existent item', () => {
      cart.removeItem('NonExistent')
      expect(cart.total()).toBe(11.50)
    })

    test('removes all instances of item name', () => {
      cart.addItem('Book', 10.00)
      cart.removeItem('Book')
      expect(cart.hasItem('Book')).toBe(false)
    })
  })

  describe('updating quantities', () => {
    beforeEach(() => {
      cart.addItem('Book', 10.00, 2)
    })

    test('updates quantity of existing item', () => {
      cart.updateQuantity('Book', 5)
      expect(cart.total()).toBe(50.00)
    })

    test('handles updating non-existent item', () => {
      cart.updateQuantity('NonExistent', 5)
      expect(cart.total()).toBe(20.00)
    })

    test('setting quantity to zero', () => {
      cart.updateQuantity('Book', 0)
      expect(cart.total()).toBe(0)
      expect(cart.itemCount()).toBe(0)
    })
  })

  describe('clearing cart', () => {
    test('clears all items', () => {
      cart.addItem('Book', 10.00)
      cart.addItem('Pen', 1.50)

      cart.clear()

      expect(cart.total()).toBe(0)
      expect(cart.itemCount()).toBe(0)
      expect(cart.getItems()).toEqual([])
    })

    test('clearing empty cart does nothing', () => {
      cart.clear()
      expect(cart.total()).toBe(0)
    })
  })

  describe('item queries', () => {
    beforeEach(() => {
      cart.addItem('Book', 10.00)
      cart.addItem('Pen', 1.50)
    })

    test('checks if cart has item', () => {
      expect(cart.hasItem('Book')).toBe(true)
      expect(cart.hasItem('Pen')).toBe(true)
      expect(cart.hasItem('NonExistent')).toBe(false)
    })

    test('gets copy of items', () => {
      const items = cart.getItems()
      expect(items).toHaveLength(2)

      // Verify it's a copy, not reference
      items.push({ name: 'Test', price: 1, quantity: 1 })
      expect(cart.getItems()).toHaveLength(2)
    })
  })

  describe('edge cases', () => {
    test('handles zero price', () => {
      cart.addItem('Free Item', 0, 5)
      expect(cart.total()).toBe(0)
    })

    test('handles large quantities', () => {
      cart.addItem('Item', 1.00, 10000)
      expect(cart.total()).toBe(10000)
    })

    test('handles very small prices', () => {
      cart.addItem('Penny', 0.01, 100)
      expect(cart.total()).toBeCloseTo(1.00, 2)
    })
  })
})

// Parametrized tests for various scenarios
describe('ShoppingCart - Parametrized Tests', () => {
  test.each([
    ['Book', 10.0, 1, 10.0],
    ['Pen', 1.5, 3, 4.5],
    ['Notebook', 7.99, 2, 15.98],
    ['Free Item', 0, 5, 0],
  ])(
    'adding %s at $%f × %i = $%f',
    (name, price, quantity, expectedTotal) => {
      const cart = new ShoppingCart()
      cart.addItem(name, price, quantity)
      expect(cart.total()).toBeCloseTo(expectedTotal, 2)
    }
  )
})
