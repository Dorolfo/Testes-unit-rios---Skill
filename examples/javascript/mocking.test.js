/**
 * Mocking examples using Vitest.
 *
 * These examples demonstrate:
 * - Mocking functions
 * - Mocking modules
 * - Mocking API calls
 * - Verifying mock calls
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'

// Example service that makes external calls
class UserService {
  constructor(apiClient) {
    this.apiClient = apiClient
  }

  async fetchUser(userId) {
    const response = await this.apiClient.get(`/users/${userId}`)
    return response.data
  }

  async createUser(userData) {
    const response = await this.apiClient.post('/users', userData)
    return response.data
  }
}

describe('UserService - Mocking API Calls', () => {
  test('fetches user with mocked API', async () => {
    // Arrange - create mock API client
    const mockApiClient = {
      get: vi.fn().mockResolvedValue({
        data: {
          id: 123,
          name: 'John Doe',
          email: 'john@example.com'
        }
      })
    }

    const service = new UserService(mockApiClient)

    // Act
    const user = await service.fetchUser(123)

    // Assert
    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
    expect(mockApiClient.get).toHaveBeenCalledWith('/users/123')
    expect(mockApiClient.get).toHaveBeenCalledTimes(1)
  })

  test('handles API errors', async () => {
    // Arrange - mock API to reject
    const mockApiClient = {
      get: vi.fn().mockRejectedValue(new Error('Network error'))
    }

    const service = new UserService(mockApiClient)

    // Act & Assert
    await expect(service.fetchUser(123)).rejects.toThrow('Network error')
  })

  test('creates user with mocked POST', async () => {
    // Arrange
    const userData = { name: 'Jane Doe', email: 'jane@example.com' }
    const mockApiClient = {
      post: vi.fn().mockResolvedValue({
        data: {
          id: 456,
          ...userData
        }
      })
    }

    const service = new UserService(mockApiClient)

    // Act
    const result = await service.createUser(userData)

    // Assert
    expect(result.id).toBe(456)
    expect(result.name).toBe('Jane Doe')
    expect(mockApiClient.post).toHaveBeenCalledWith('/users', userData)
  })
})

// Mocking with spy functions
describe('Function Spies', () => {
  test('tracks function calls', () => {
    const mockCallback = vi.fn()

    mockCallback('hello')
    mockCallback('world')

    expect(mockCallback).toHaveBeenCalledTimes(2)
    expect(mockCallback).toHaveBeenCalledWith('hello')
    expect(mockCallback).toHaveBeenCalledWith('world')
    expect(mockCallback).toHaveBeenNthCalledWith(1, 'hello')
    expect(mockCallback).toHaveBeenNthCalledWith(2, 'world')
  })

  test('spy on object methods', () => {
    const calculator = {
      add: (a, b) => a + b
    }

    const addSpy = vi.spyOn(calculator, 'add')

    calculator.add(2, 3)
    calculator.add(5, 7)

    expect(addSpy).toHaveBeenCalledTimes(2)
    expect(addSpy).toHaveBeenCalledWith(2, 3)
    expect(addSpy).toHaveBeenLastCalledWith(5, 7)
  })
})

// Mocking return values
describe('Mock Return Values', () => {
  test('mock different return values', () => {
    const mockFn = vi.fn()
      .mockReturnValueOnce('first')
      .mockReturnValueOnce('second')
      .mockReturnValue('default')

    expect(mockFn()).toBe('first')
    expect(mockFn()).toBe('second')
    expect(mockFn()).toBe('default')
    expect(mockFn()).toBe('default')
  })

  test('mock async return values', async () => {
    const mockAsync = vi.fn()
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second')

    expect(await mockAsync()).toBe('first')
    expect(await mockAsync()).toBe('second')
  })
})

// Mocking timers
describe('Timer Mocking', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  test('debounce function delays execution', () => {
    const callback = vi.fn()

    function debounce(fn, delay) {
      let timeoutId
      return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
      }
    }

    const debouncedFn = debounce(callback, 1000)

    debouncedFn()
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(500)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(500)
    expect(callback).toHaveBeenCalledOnce()

    vi.useRealTimers()
  })

  test('throttle limits execution rate', () => {
    const callback = vi.fn()

    function throttle(fn, delay) {
      let lastCall = 0
      return (...args) => {
        const now = Date.now()
        if (now - lastCall >= delay) {
          lastCall = now
          fn(...args)
        }
      }
    }

    const throttledFn = throttle(callback, 1000)

    throttledFn()
    expect(callback).toHaveBeenCalledTimes(1)

    throttledFn()
    expect(callback).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1000)
    throttledFn()
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })
})

// Mocking Date
describe('Date Mocking', () => {
  test('mock current date', () => {
    const mockDate = new Date('2026-02-09T12:00:00.000Z')
    vi.setSystemTime(mockDate)

    const now = new Date()
    expect(now.toISOString()).toBe('2026-02-09T12:00:00.000Z')

    vi.useRealTimers()
  })
})

// Mocking modules
// api.js
export const api = {
  fetchData: async (url) => {
    const response = await fetch(url)
    return response.json()
  }
}

// Mock the entire module
vi.mock('./api', () => ({
  api: {
    fetchData: vi.fn()
  }
}))

describe('Module Mocking', () => {
  test('mocks entire module', async () => {
    // This would normally import from './api'
    const mockApi = {
      fetchData: vi.fn().mockResolvedValue({ data: 'mocked' })
    }

    const result = await mockApi.fetchData('/test')

    expect(result).toEqual({ data: 'mocked' })
    expect(mockApi.fetchData).toHaveBeenCalledWith('/test')
  })
})

// Partial mocking
describe('Partial Mocking', () => {
  test('mock only specific methods', () => {
    const logger = {
      info: (msg) => console.log(`INFO: ${msg}`),
      error: (msg) => console.error(`ERROR: ${msg}`),
      debug: (msg) => console.debug(`DEBUG: ${msg}`)
    }

    // Mock only error and debug, keep info real
    logger.error = vi.fn()
    logger.debug = vi.fn()

    logger.info('This is real')
    logger.error('This is mocked')
    logger.debug('This is also mocked')

    expect(logger.error).toHaveBeenCalledWith('This is mocked')
    expect(logger.debug).toHaveBeenCalledWith('This is also mocked')
  })
})

// Mock implementation
describe('Mock Implementation', () => {
  test('provides custom implementation', () => {
    const mockFn = vi.fn().mockImplementation((a, b) => {
      return a * b
    })

    expect(mockFn(2, 3)).toBe(6)
    expect(mockFn(5, 4)).toBe(20)
  })

  test('mock implementation once', () => {
    const mockFn = vi.fn()
      .mockImplementationOnce(() => 'first')
      .mockImplementationOnce(() => 'second')
      .mockImplementation(() => 'default')

    expect(mockFn()).toBe('first')
    expect(mockFn()).toBe('second')
    expect(mockFn()).toBe('default')
  })
})
