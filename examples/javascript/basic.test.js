/**
 * Basic unit testing examples using Vitest.
 *
 * These examples demonstrate:
 * - AAA pattern (Arrange-Act-Assert)
 * - Simple assertions
 * - Test organization
 * - Descriptive test names
 */

import { describe, test, expect, beforeEach } from 'vitest'

// Simple calculator class to test
class Calculator {
  add(a, b) {
    return a + b
  }

  subtract(a, b) {
    return a - b
  }

  multiply(a, b) {
    return a * b
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error('Cannot divide by zero')
    }
    return a / b
  }
}

describe('Calculator - Basic Tests', () => {
  test('adds two positive numbers', () => {
    // Arrange
    const calc = new Calculator()

    // Act
    const result = calc.add(2, 3)

    // Assert
    expect(result).toBe(5)
  })

  test('adds negative numbers', () => {
    // Arrange
    const calc = new Calculator()

    // Act
    const result = calc.add(-2, -3)

    // Assert
    expect(result).toBe(-5)
  })

  test('subtracts numbers correctly', () => {
    const calc = new Calculator()
    const result = calc.subtract(10, 4)
    expect(result).toBe(6)
  })

  test('multiplies by zero returns zero', () => {
    const calc = new Calculator()
    const result = calc.multiply(5, 0)
    expect(result).toBe(0)
  })

  test('divides two numbers', () => {
    const calc = new Calculator()
    const result = calc.divide(10, 2)
    expect(result).toBe(5)
  })

  test('throws error when dividing by zero', () => {
    const calc = new Calculator()
    expect(() => calc.divide(10, 0)).toThrow('Cannot divide by zero')
  })
})

// Parametrized tests using test.each
describe('Calculator - Parametrized Tests', () => {
  test.each([
    [1, 1, 2],
    [2, 3, 5],
    [0, 0, 0],
    [-1, 1, 0],
    [100, 200, 300],
  ])('adds %i + %i to equal %i', (a, b, expected) => {
    const calc = new Calculator()
    expect(calc.add(a, b)).toBe(expected)
  })

  test.each([
    [10, 5, 5],
    [0, 5, -5],
    [-5, -5, 0],
    [100, 1, 99],
  ])('subtracts %i - %i to equal %i', (a, b, expected) => {
    const calc = new Calculator()
    expect(calc.subtract(a, b)).toBe(expected)
  })
})

// Using beforeEach for setup
describe('Calculator - Using Setup', () => {
  let calculator

  beforeEach(() => {
    // This runs before each test
    calculator = new Calculator()
  })

  test('performs addition using setup calculator', () => {
    expect(calculator.add(5, 5)).toBe(10)
  })

  test('performs multiplication using setup calculator', () => {
    expect(calculator.multiply(3, 4)).toBe(12)
  })
})

// Testing objects and arrays
class ShoppingList {
  constructor() {
    this.items = []
  }

  addItem(item) {
    this.items.push(item)
  }

  removeItem(item) {
    this.items = this.items.filter(i => i !== item)
  }

  getItems() {
    return [...this.items]
  }

  clear() {
    this.items = []
  }
}

describe('ShoppingList', () => {
  test('starts with empty list', () => {
    const list = new ShoppingList()
    expect(list.getItems()).toEqual([])
  })

  test('adds items to list', () => {
    const list = new ShoppingList()
    list.addItem('Milk')
    list.addItem('Bread')

    expect(list.getItems()).toContain('Milk')
    expect(list.getItems()).toContain('Bread')
    expect(list.getItems()).toHaveLength(2)
  })

  test('removes items from list', () => {
    const list = new ShoppingList()
    list.addItem('Milk')
    list.addItem('Bread')
    list.removeItem('Milk')

    expect(list.getItems()).not.toContain('Milk')
    expect(list.getItems()).toContain('Bread')
  })

  test('clears all items', () => {
    const list = new ShoppingList()
    list.addItem('Milk')
    list.addItem('Bread')
    list.clear()

    expect(list.getItems()).toEqual([])
  })
})

// Async testing
class UserAPI {
  async fetchUser(id) {
    // Simulating API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id, name: `User ${id}` })
      }, 100)
    })
  }
}

describe('UserAPI - Async Tests', () => {
  test('fetches user data asynchronously', async () => {
    const api = new UserAPI()
    const user = await api.fetchUser(123)

    expect(user).toEqual({
      id: 123,
      name: 'User 123'
    })
  })
})
