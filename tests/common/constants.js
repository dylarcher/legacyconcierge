/**
 * Test Constants
 * Common test data, fixtures, and constants used across test files
 */

/**
 * Sample translation data for testing i18n
 */
export const MOCK_TRANSLATIONS = {
  en: {
    common: {
      'button.submit': 'Submit',
      'button.cancel': 'Cancel',
      'button.save': 'Save',
      'button.delete': 'Delete',
      'button.edit': 'Edit',
      'form.required': 'This field is required',
      'form.invalid': 'Invalid input',
      'form.email.invalid': 'Please enter a valid email address',
      'form.phone.invalid': 'Please enter a valid phone number',
      'error.generic': 'An error occurred. Please try again.',
      'success.saved': 'Successfully saved!',
      'loading': 'Loading...',
      'meta.title': 'Legacy Concierge',
      'meta.description': 'Comprehensive healthcare services',
    },
    home: {
      'hero.title': 'Welcome to Legacy Concierge',
      'hero.subtitle': 'Comprehensive Healthcare Services',
      'cta.primary': 'Get Started',
      'cta.secondary': 'Learn More',
    },
    services: {
      'title': 'Our Services',
      'subtitle': 'Comprehensive care tailored to your needs',
      'service.postOp.title': 'Post-Operative Recovery',
      'service.chronic.title': 'Chronic Condition Management',
    },
  },
  es: {
    common: {
      'button.submit': 'Enviar',
      'button.cancel': 'Cancelar',
      'button.save': 'Guardar',
      'form.required': 'Este campo es obligatorio',
      'form.invalid': 'Entrada inválida',
    },
  },
};

/**
 * Component attribute configurations for testing
 */
export const COMPONENT_CONFIGS = {
  button: {
    variants: ['primary', 'secondary', 'outline', 'ghost'],
    sizes: ['sm', 'base', 'lg'],
    types: ['button', 'submit', 'reset'],
  },
  alert: {
    variants: ['info', 'success', 'warning', 'error'],
    dismissible: [true, false],
  },
  modal: {
    sizes: ['sm', 'md', 'lg', 'xl', 'full'],
  },
  input: {
    types: ['text', 'email', 'password', 'tel', 'number', 'url', 'search'],
  },
};

/**
 * Sample form data for testing
 */
export const SAMPLE_FORM_DATA = {
  contact: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    message: 'Hello, I would like to inquire about your services.',
  },
  invalid: {
    email: 'invalid-email',
    phone: '123',
    name: '',
  },
};

/**
 * Sample component HTML templates
 */
export const SAMPLE_TEMPLATES = {
  button: `
    <button class="lc-button lc-button--primary">
      <span class="lc-button__content">Click Me</span>
    </button>
  `,
  card: `
    <div class="lc-card">
      <div class="lc-card__header">
        <h3 class="lc-card__title">Card Title</h3>
      </div>
      <div class="lc-card__body">
        <p>Card content goes here</p>
      </div>
      <div class="lc-card__footer">
        <button>Action</button>
      </div>
    </div>
  `,
  modal: `
    <div class="lc-modal" role="dialog" aria-modal="true">
      <div class="lc-modal__backdrop"></div>
      <div class="lc-modal__container">
        <div class="lc-modal__header">
          <h2 class="lc-modal__title">Modal Title</h2>
          <button class="lc-modal__close" aria-label="Close modal">×</button>
        </div>
        <div class="lc-modal__body">
          <p>Modal content</p>
        </div>
        <div class="lc-modal__footer">
          <button>Cancel</button>
          <button>Confirm</button>
        </div>
      </div>
    </div>
  `,
};

/**
 * ARIA attribute test data
 */
export const ARIA_ATTRIBUTES = {
  button: {
    required: ['aria-label'],
    optional: ['aria-describedby', 'aria-pressed', 'aria-expanded'],
  },
  modal: {
    required: ['role', 'aria-modal', 'aria-labelledby'],
    optional: ['aria-describedby'],
  },
  input: {
    required: ['aria-label', 'aria-required'],
    optional: ['aria-invalid', 'aria-describedby', 'aria-errormessage'],
  },
  navigation: {
    required: ['role', 'aria-label'],
    optional: ['aria-current'],
  },
};

/**
 * Keyboard event key codes
 */
export const KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
};

/**
 * CSS class name patterns
 */
export const CSS_CLASSES = {
  button: {
    base: 'lc-button',
    variants: {
      primary: 'lc-button--primary',
      secondary: 'lc-button--secondary',
      outline: 'lc-button--outline',
      ghost: 'lc-button--ghost',
    },
    sizes: {
      sm: 'lc-button--sm',
      base: 'lc-button--base',
      lg: 'lc-button--lg',
    },
    states: {
      disabled: 'lc-button--disabled',
      loading: 'lc-button--loading',
      active: 'lc-button--active',
    },
  },
};

/**
 * Test timeouts (in milliseconds)
 */
export const TIMEOUTS = {
  SHORT: 100,
  MEDIUM: 500,
  LONG: 1000,
  ANIMATION: 300,
  DEBOUNCE: 250,
};

/**
 * Mock API responses
 */
export const MOCK_API_RESPONSES = {
  success: {
    status: 'success',
    message: 'Operation completed successfully',
    data: {},
  },
  error: {
    status: 'error',
    message: 'An error occurred',
    errors: [],
  },
  validationError: {
    status: 'error',
    message: 'Validation failed',
    errors: [
      { field: 'email', message: 'Invalid email address' },
      { field: 'phone', message: 'Invalid phone number' },
    ],
  },
};

/**
 * Viewport sizes for responsive testing
 */
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
  wide: { width: 1920, height: 1080 },
};

/**
 * Test user agents
 */
export const USER_AGENTS = {
  chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
  safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
};

/**
 * Accessibility testing selectors
 */
export const A11Y_SELECTORS = {
  focusable: 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  headings: 'h1, h2, h3, h4, h5, h6',
  landmarks: '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"], main, nav, header, footer, aside',
  interactive: 'a, button, input, select, textarea, [role="button"], [role="link"], [tabindex]',
};

/**
 * Performance thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  renderTime: 100, // ms
  responseTime: 50, // ms
  memoryLimit: 10 * 1024 * 1024, // 10MB
};

/**
 * Common test paths
 */
export const TEST_PATHS = {
  templates: '/src/components/templates',
  i18n: '/src/i18n',
  assets: '/src/assets',
  components: '/src/components',
  utilities: '/src/utilities',
};

/**
 * Default component props for testing
 */
export const DEFAULT_PROPS = {
  button: {
    variant: 'primary',
    size: 'base',
    type: 'button',
    disabled: false,
  },
  input: {
    type: 'text',
    required: false,
    disabled: false,
    placeholder: '',
    value: '',
  },
  modal: {
    size: 'md',
    dismissible: true,
    backdrop: true,
  },
};

export default {
  MOCK_TRANSLATIONS,
  COMPONENT_CONFIGS,
  SAMPLE_FORM_DATA,
  SAMPLE_TEMPLATES,
  ARIA_ATTRIBUTES,
  KEYS,
  CSS_CLASSES,
  TIMEOUTS,
  MOCK_API_RESPONSES,
  VIEWPORTS,
  USER_AGENTS,
  A11Y_SELECTORS,
  PERFORMANCE_THRESHOLDS,
  TEST_PATHS,
  DEFAULT_PROPS,
};
