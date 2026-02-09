# JavaScript Testing Examples

This directory contains practical examples of unit testing with Vitest (compatible with Jest).

## Setup

```bash
# Install dependencies
npm install

# Or with yarn
yarn install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Examples Included

### basic.test.js
- Basic AAA pattern examples
- Simple assertions with `expect()`
- Parametrized tests with `test.each()`
- Setup/teardown with `beforeEach()`
- Async testing

### mocking.test.js
- Mocking functions with `vi.fn()`
- Mocking API calls
- Spy functions with `vi.spyOn()`
- Timer mocking with `vi.useFakeTimers()`
- Date mocking
- Module mocking
- Mock return values and implementations

### tdd.test.js
- Complete TDD workflow
- Red-Green-Refactor cycle
- Shopping cart example
- Comprehensive test suite
- Edge case testing

## Learning Path

1. Start with `basic.test.js` to learn fundamentals
2. Move to `mocking.test.js` for mocking patterns
3. Study `tdd.test.js` for TDD workflow

## Testing Patterns

### AAA Pattern
```javascript
test('description', () => {
  // Arrange
  const input = setupData()

  // Act
  const result = functionUnderTest(input)

  // Assert
  expect(result).toBe(expected)
})
```

### Parametrized Tests
```javascript
test.each([
  [input1, expected1],
  [input2, expected2],
])('test %s', (input, expected) => {
  expect(fn(input)).toBe(expected)
})
```

### Mocking
```javascript
const mockFn = vi.fn()
mockFn.mockReturnValue('value')
expect(mockFn).toHaveBeenCalled()
```

## Vitest vs Jest

These examples use Vitest, but the API is compatible with Jest. Just replace:
- `import { test, expect } from 'vitest'` → `import { test, expect } from '@jest/globals'`
- `vi.fn()` → `jest.fn()`
- `vi.spyOn()` → `jest.spyOn()`
