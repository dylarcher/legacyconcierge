# Test Writing Guide for Legacy Concierge

## Overview

This document outlines the comprehensive testing infrastructure that has been set up for the Legacy Concierge project, including unit tests for all src/ directory files using Vitest.

## Testing Infrastructure

### Setup Complete ✅

1. **Testing Framework**: Vitest v4.0.4
   - Fast, modern, ESM-native test runner
   - Happy-DOM environment for browser API simulation
   - Coverage reporting with v8
   - UI mode for interactive testing

2. **Test Configuration**: `vitest.config.js`
   - Configured for ES modules
   - Happy-DOM environment
   - Coverage thresholds: 70% lines, 70% functions, 65% branches
   - Path aliases configured (@, @components, @utilities, @tests)

3. **Test Setup**: `tests/setup.js`
   - Mock window.matchMedia
   - Mock IntersectionObserver
   - Mock ResizeObserver
   - Mock localStorage/sessionStorage
   - Auto-cleanup after each test
   - Global test helpers

4. **Test Utilities**: `tests/utils/test-helpers.js`
   - `createTestComponent()` - Mount web components
   - `waitForComponent()` - Wait for initialization
   - `cleanupComponents()` - Clean up after tests
   - `mockFetch()` - Mock fetch API
   - `waitForElement()` - Wait for DOM elements
   - `clickElement()` - Simulate clicks
   - `pressKey()` - Simulate keyboard events
   - `typeIntoInput()` - Simulate input
   - Many more utilities...

5. **Mock Implementations**: `tests/mocks/index.js`
   - Mock i18n module
   - Mock template loader
   - Mock path resolver
   - Mock theme manager
   - Mock performance utility
   - Mock accessibility utility
   - Mock fetch responses
   - MockComponent class

6. **Test Constants**: `tests/common/constants.js`
   - Sample translations
   - Component configurations
   - Form data fixtures
   - ARIA attributes
   - Keyboard key constants
   - CSS class patterns
   - Performance thresholds
   - Much more...

## Test Structure

```
tests/
├── setup.js                    # Global test setup
├── common/
│   └── constants.js           # Test constants and fixtures
├── mocks/
│   └── index.js               # Mock implementations
├── utils/
│   └── test-helpers.js        # Test utility functions
├── unit/
│   ├── utilities/
│   │   ├── path-resolver.test.js ✅ (53 tests passing)
│   │   ├── i18n.test.js
│   │   ├── template-loader.test.js
│   │   ├── theme-manager.test.js
│   │   ├── performance.test.js
│   │   └── accessibility.test.js
│   ├── components/
│   │   ├── base/
│   │   │   └── Component.test.js
│   │   ├── atomic/
│   │   │   ├── lc-button.test.js
│   │   │   ├── lc-alert.test.js
│   │   │   ├── lc-badge.test.js
│   │   │   ├── lc-card.test.js
│   │   │   ├── lc-icon.test.js
│   │   │   └── lc-image.test.js
│   │   ├── composite/
│   │   │   ├── lc-modal.test.js
│   │   │   ├── lc-tabs.test.js
│   │   │   ├── lc-accordion.test.js
│   │   │   ├── lc-dropdown.test.js
│   │   │   ├── lc-slider.test.js
│   │   │   └── lc-lightbox.test.js
│   │   ├── forms/
│   │   │   ├── lc-input.test.js
│   │   │   ├── lc-select.test.js
│   │   │   ├── lc-checkbox.test.js
│   │   │   ├── lc-radio.test.js
│   │   │   ├── lc-textarea.test.js
│   │   │   └── lc-form.test.js
│   │   ├── layouts/
│   │   │   ├── lc-container.test.js
│   │   │   ├── lc-grid.test.js
│   │   │   ├── lc-section.test.js
│   │   │   ├── lc-hero.test.js
│   │   │   └── lc-layout.test.js
│   │   └── navigation/
│   │       ├── lc-header.test.js
│   │       ├── lc-nav.test.js
│   │       ├── lc-footer.test.js
│   │       ├── lc-breadcrumb.test.js
│   │       └── lc-pagination.test.js
│   └── init.test.js
└── e2e/                        # Existing Playwright tests
    ├── accessibility.spec.js
    ├── i18n-theme.spec.js
    └── navigation.spec.js
```

## NPM Scripts

### Unit Tests

- `npm run test:unit` - Run all unit tests once
- `npm run test:unit:watch` - Run tests in watch mode
- `npm run test:unit:ui` - Open Vitest UI
- `npm run test:unit:coverage` - Run with coverage report

### E2E Tests

- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Open Playwright UI
- `npm run test:e2e:debug` - Debug E2E tests
- `npm run test:e2e:headed` - Run E2E in headed mode

### All Tests

- `npm test` - Run both unit and E2E tests
- `npm run ci` - Run validation + unit + E2E (for CI/CD)

## Test Template

Here's a standard test template to follow:

```javascript
/**
 * [Module Name] Tests
 * Description of what's being tested
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ModuleUnderTest } from '../../../src/path/to/module.js';
import { createTestComponent, cleanupComponents } from '../../utils/test-helpers.js';
import { MOCK_TRANSLATIONS } from '../../common/constants.js';

describe('ModuleName', () => {
  let instance;

  beforeEach(() => {
    // Setup before each test
    instance = new ModuleUnderTest();
  });

  afterEach(() => {
    // Cleanup after each test
    cleanupComponents();
  });

  describe('Feature Group 1', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = instance.method(input);

      // Assert
      expect(result).toBe('expected');
    });

    it('should handle edge cases', () => {
      expect(() => instance.method(null)).toThrow();
    });
  });

  describe('Feature Group 2', () => {
    it('should work with async operations', async () => {
      const result = await instance.asyncMethod();
      expect(result).toBeDefined();
    });
  });
});
```

## Writing Component Tests

### For Web Components

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestComponent, waitForComponent } from '../../utils/test-helpers.js';

describe('LCButton Component', () => {
  let button;

  beforeEach(async () => {
    // Create and mount component
    button = createTestComponent('lc-button', {
      variant: 'primary',
      size: 'lg',
    }, 'Click Me');

    // Wait for component initialization
    await waitForComponent(button);
  });

  describe('Rendering', () => {
    it('should render with correct classes', () => {
      const buttonEl = button.querySelector('.lc-button');
      expect(buttonEl).toBeDefined();
      expect(buttonEl.classList.contains('lc-button--primary')).toBe(true);
    });
  });

  describe('Behavior', () => {
    it('should emit event on click', async () => {
      const spy = vi.fn();
      button.addEventListener('lc-button-click', spy);

      button.querySelector('.lc-button').click();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      expect(button.getAttribute('role')).toBe('button');
    });
  });
});
```

## Testing Utilities

### Common Testing Patterns

```javascript
// Wait for async operations
await waitFor(() => element.textContent === 'Expected', 1000);

// Simulate user interactions
clickElement(button);
pressKey(input, 'Enter');
typeIntoInput(input, 'test value');

// Wait for events
const event = await waitForEvent(component, 'custom-event', 1000);

// Mock fetch
const mockFetch = mockFetchForUrl('/api/data', { data: 'test' });
global.fetch = mockFetch;

// Check visibility
expect(isVisible(element)).toBe(true);

// Assert ARIA
assertAria(element, 'label', 'Expected Label');
assertAttribute(element, 'data-state', 'active');
```

## Coverage Goals

- **Utilities**: 80%+ coverage
- **Components**: 70%+ coverage
- **Overall**: 70%+ lines, 70%+ functions, 65%+ branches

## Running Tests

### Development Workflow

1. **Watch mode during development**:

   ```bash
   npm run test:unit:watch
   ```

2. **Run specific test file**:

   ```bash
   npx vitest tests/unit/utilities/path-resolver.test.js
   ```

3. **Generate coverage report**:

   ```bash
   npm run test:unit:coverage
   ```

   Coverage report will be in `coverage/index.html`

4. **Use UI mode for interactive testing**:

   ```bash
   npm run test:unit:ui
   ```

### CI/CD

The CI script runs:

1. Code validation (format, lint, type-check)
2. Unit tests
3. E2E tests

```bash
npm run ci
```

## Next Steps

### Remaining Tests to Write

1. **Utilities** (Priority: High)
   - [ ] i18n.test.js
   - [ ] template-loader.test.js
   - [ ] theme-manager.test.js
   - [ ] performance.test.js
   - [ ] accessibility.test.js

2. **Base Component** (Priority: High)
   - [ ] Component.test.js

3. **Atomic Components** (Priority: Medium)
   - [ ] lc-button.test.js
   - [ ] lc-alert.test.js
   - [ ] lc-badge.test.js
   - [ ] lc-card.test.js
   - [ ] lc-icon.test.js
   - [ ] lc-image.test.js

4. **Composite Components** (Priority: Medium)
   - [ ] lc-modal.test.js
   - [ ] lc-tabs.test.js
   - [ ] lc-accordion.test.js
   - [ ] lc-dropdown.test.js
   - [ ] lc-slider.test.js
   - [ ] lc-lightbox.test.js

5. **Form Components** (Priority: Medium)
   - [ ] lc-input.test.js
   - [ ] lc-select.test.js
   - [ ] lc-checkbox.test.js
   - [ ] lc-radio.test.js
   - [ ] lc-textarea.test.js
   - [ ] lc-form.test.js

6. **Layout & Navigation** (Priority: Low)
   - [ ] Layout components tests
   - [ ] Navigation components tests

7. **Init** (Priority: Low)
   - [ ] init.test.js

## Example: path-resolver.test.js ✅

The path-resolver test serves as a comprehensive example of proper test structure:

- ✅ 53 tests covering all functionality
- ✅ Environment detection tests
- ✅ Path resolution tests
- ✅ Edge case handling
- ✅ Integration tests
- ✅ Helper functions for mocking

Use this as a reference when writing other tests.

## Best Practices

1. **Test Organization**
   - Group related tests with `describe()`
   - Use clear, descriptive test names
   - Follow AAA pattern: Arrange, Act, Assert

2. **Test Independence**
   - Each test should be independent
   - Use `beforeEach` for setup
   - Use `afterEach` for cleanup
   - Don't rely on test execution order

3. **Mocking**
   - Mock external dependencies
   - Use vi.fn() for function spies
   - Reset mocks in afterEach
   - Mock at the right level

4. **Assertions**
   - Use specific matchers
   - Test one thing per test
   - Include edge cases
   - Test error conditions

5. **Async Testing**
   - Use async/await
   - Use waitFor helpers
   - Set appropriate timeouts
   - Test loading states

## Common Issues and Solutions

### Issue: localStorage not available

**Solution**: Already configured in `tests/setup.js`

### Issue: Web Components not registering

**Solution**: Use `createTestComponent()` helper

### Issue: Tests timing out

**Solution**: Increase timeout or check for async operations

### Issue: Mock not working

**Solution**: Ensure mock is set up before import

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Testing Library Documentation](https://testing-library.com)
- [Web Components Testing Guide](https://open-wc.org/guides/developing-components/testing/)

## Progress Tracking

- [x] Testing infrastructure setup
- [x] Vitest configuration
- [x] Test utilities
- [x] Mock implementations
- [x] Test constants
- [x] Package.json scripts
- [x] path-resolver tests (53 tests passing)
- [ ] Remaining utility tests
- [ ] Component tests
- [ ] Component tests
- [ ] Init tests
- [ ] 70%+ coverage achieved
