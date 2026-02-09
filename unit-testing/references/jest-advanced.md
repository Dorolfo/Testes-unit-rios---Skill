# Advanced Jest/Vitest Techniques

## Snapshot Testing

Useful for UI components and large data structures:

```javascript
test('renders correctly', () => {
  const component = render(<UserProfile name="John" email="john@example.com" />)
  expect(component).toMatchSnapshot()
})

// First run creates snapshot file
// Future runs compare against snapshot
// Update with: npm test -- -u
```

## Custom Matchers

```javascript
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },
})

test('is within range', () => {
  expect(100).toBeWithinRange(90, 110)
})
```

## Setup Files

```javascript
// vitest.setup.js or jest.setup.js
import { beforeAll, afterAll, afterEach } from 'vitest'

// Global setup
beforeAll(() => {
  // Runs once before all tests
  console.log('Starting tests...')
})

afterAll(() => {
  // Runs once after all tests
  console.log('Tests complete!')
})

afterEach(() => {
  // Clean up after each test
  vi.clearAllMocks()
})
```

## Module Mocking Patterns

```javascript
// Partial module mock
vi.mock('./utils', async () => {
  const actual = await vi.importActual('./utils')
  return {
    ...actual,
    someFunction: vi.fn()
  }
})

// Auto-mock with manual overrides
vi.mock('./api')
import { fetchUser } from './api'
fetchUser.mockResolvedValue({ id: 1, name: 'Test' })
```

## Concurrent Tests

```javascript
// Run tests in parallel (Vitest)
describe.concurrent('parallel tests', () => {
  test('test 1', async () => {
    await slowOperation()
  })
  
  test('test 2', async () => {
    await slowOperation()
  })
  // Both run concurrently
})
```

## Test Context

```javascript
// Vitest test context
import { describe, test, beforeEach } from 'vitest'

describe('with context', () => {
  beforeEach((context) => {
    context.user = { id: 1, name: 'Test' }
  })
  
  test('uses context', ({ user }) => {
    expect(user.name).toBe('Test')
  })
})
```

## Custom Test Environment

```javascript
// vitest.config.js
export default {
  test: {
    environment: 'jsdom', // or 'node', 'happy-dom'
    setupFiles: ['./vitest.setup.js']
  }
}
```

## Spy on Console

```javascript
test('logs error message', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation()
  
  functionThatLogs()
  
  expect(consoleSpy).toHaveBeenCalledWith('Error occurred')
  consoleSpy.mockRestore()
})
```

## Test Retry

```javascript
// Retry flaky tests
test('flaky test', { retry: 3 }, async () => {
  const result = await unreliableOperation()
  expect(result).toBe('success')
})
```

## Test Timeout

```javascript
test('slow operation', { timeout: 10000 }, async () => {
  await verySlowOperation()
})
```

## Coverage Thresholds

```javascript
// vitest.config.js
export default {
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      },
      exclude: [
        'src/config/**',
        '**/*.test.js'
      ]
    }
  }
}
```
