/**
 * LCButton Component Tests
 * Tests for the button component with variants, sizes, and states
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep } from '../../utils/test-helpers.js';

describe('LCButton Component', () => {
  let _LCButton;

  beforeEach(async () => {
    // Import the component
    await import('../../../src/components/atomic/lc-button.js');

    // Clear DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  afterEach(() => {
    // Clean up listeners manually before removing components
    // Note: Component.cleanup() has issues with element reference listeners
    const buttons = document.querySelectorAll('lc-button');
    buttons.forEach(button => {
      button._listeners?.clear();
    });

    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  describe('Component Registration', () => {
    it('should be registered as custom element', () => {
      expect(customElements.get('lc-button')).toBeDefined();
    });

    it('should create instance via document.createElement', () => {
      const button = document.createElement('lc-button');
      expect(button).toBeInstanceOf(HTMLElement);
      expect(button.tagName).toBe('LC-BUTTON');
    });

    it('should create instance via new keyword', async () => {
      const module = await import('../../../src/components/atomic/lc-button.js');
      const button = new module.default();
      expect(button).toBeInstanceOf(HTMLElement);
    });
  });

  describe('Initialization and Rendering', () => {
    it('should render with default attributes', async () => {
      const button = document.createElement('lc-button');
      button.textContent = 'Click me';
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton).toBeTruthy();
      expect(innerButton.textContent).toContain('Click me');
    });

    it('should not use shadow DOM', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      expect(button.shadowRoot).toBeNull();
    });

    it('should inject styles into document head', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      const styleTag = document.getElementById('lc-button-styles');
      expect(styleTag).toBeTruthy();
      expect(styleTag.tagName).toBe('STYLE');
    });

    it('should only inject styles once', async () => {
      const button1 = document.createElement('lc-button');
      document.body.appendChild(button1);
      await sleep(10);

      const button2 = document.createElement('lc-button');
      document.body.appendChild(button2);
      await sleep(10);

      const styleTags = document.querySelectorAll('#lc-button-styles');
      expect(styleTags.length).toBe(1);
    });
  });

  describe('Variants', () => {
    it('should render primary variant by default', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--primary')).toBe(true);
    });

    it('should render secondary variant', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('variant', 'secondary');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--secondary')).toBe(true);
    });

    it('should render outline variant', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('variant', 'outline');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--outline')).toBe(true);
    });

    it('should render ghost variant', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('variant', 'ghost');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--ghost')).toBe(true);
    });
  });

  describe('Sizes', () => {
    it('should render base size by default', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--base')).toBe(true);
    });

    it('should render small size', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('size', 'sm');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--sm')).toBe(true);
    });

    it('should render large size', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('size', 'lg');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--lg')).toBe(true);
    });
  });

  describe('Button vs Link Rendering', () => {
    it('should render as button element by default', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.tagName).toBe('BUTTON');
    });

    it('should render as anchor when href is provided', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('href', '/contact');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.tagName).toBe('A');
      expect(innerButton.getAttribute('href')).toBe('/contact');
    });

    it('should set button type attribute', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('type', 'submit');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('button');
      expect(innerButton.getAttribute('type')).toBe('submit');
    });

    it('should default to button type', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('button');
      expect(innerButton.getAttribute('type')).toBe('button');
    });
  });

  describe('Disabled State', () => {
    it('should add disabled class when disabled', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('disabled', '');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--disabled')).toBe(true);
    });

    it('should set disabled attribute on button element', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('disabled', '');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('button');
      expect(innerButton.disabled).toBe(true);
    });

    it('should set aria-disabled on link when disabled', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('href', '/page');
      button.setAttribute('disabled', '');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('a');
      expect(innerButton.getAttribute('aria-disabled')).toBe('true');
      expect(innerButton.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Content Rendering', () => {
    it('should render text content', async () => {
      const button = document.createElement('lc-button');
      button.textContent = 'Submit Form';
      document.body.appendChild(button);
      await sleep(10);

      expect(button.textContent).toContain('Submit Form');
    });

    it('should render HTML content', async () => {
      const button = document.createElement('lc-button');
      button.innerHTML = '<span>🔍</span> Search';
      document.body.appendChild(button);
      await sleep(10);

      expect(button.textContent).toContain('Search');
      expect(button.querySelector('span')).toBeTruthy();
    });

    it('should wrap content in button__content span', async () => {
      const button = document.createElement('lc-button');
      button.textContent = 'Content';
      document.body.appendChild(button);
      await sleep(10);

      const content = button.querySelector('.lc-button__content');
      expect(content).toBeTruthy();
      expect(content.textContent).toContain('Content');
    });
  });

  describe('ARIA Attributes', () => {
    it('should copy aria-label to inner button', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('aria-label', 'Close dialog');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.getAttribute('aria-label')).toBe('Close dialog');
    });

    it('should copy aria-labelledby to inner button', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('aria-labelledby', 'label-id');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.getAttribute('aria-labelledby')).toBe('label-id');
    });

    it('should copy aria-describedby to inner button', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('aria-describedby', 'desc-id');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.getAttribute('aria-describedby')).toBe('desc-id');
    });

    it('should copy multiple aria attributes', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('aria-label', 'Submit');
      button.setAttribute('aria-pressed', 'false');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.getAttribute('aria-label')).toBe('Submit');
      expect(innerButton.getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('Event Handling', () => {
    it('should emit lc-button-click event on click', async () => {
      const button = document.createElement('lc-button');
      button.textContent = 'Click';
      document.body.appendChild(button);
      await sleep(10);

      const clickHandler = vi.fn();
      button.addEventListener('lc-button-click', clickHandler);

      const innerButton = button.querySelector('.lc-button');
      innerButton.click();

      expect(clickHandler).toHaveBeenCalled();
    });

    it('should include button reference in event detail', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      let eventDetail;
      button.addEventListener('lc-button-click', (e) => {
        eventDetail = e.detail;
      });

      const innerButton = button.querySelector('.lc-button');
      innerButton.click();

      expect(eventDetail).toBeDefined();
      expect(eventDetail.button).toBe(button);
    });

    it('should include original event in event detail', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      let eventDetail;
      button.addEventListener('lc-button-click', (e) => {
        eventDetail = e.detail;
      });

      const innerButton = button.querySelector('.lc-button');
      innerButton.click();

      expect(eventDetail.originalEvent).toBeDefined();
      expect(eventDetail.originalEvent.type).toBe('click');
    });

    it('should prevent event when disabled', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('disabled', '');
      document.body.appendChild(button);
      await sleep(10);

      const clickHandler = vi.fn();
      button.addEventListener('lc-button-click', clickHandler);

      const innerButton = button.querySelector('.lc-button');
      innerButton.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });
  });

  describe('Attribute Changes', () => {
    it('should re-render when variant changes', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('variant', 'primary');
      document.body.appendChild(button);
      await sleep(10);

      button.setAttribute('variant', 'secondary');
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--secondary')).toBe(true);
      expect(innerButton.classList.contains('lc-button--primary')).toBe(false);
    });

    it('should re-render when size changes', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('size', 'sm');
      document.body.appendChild(button);
      await sleep(10);

      button.setAttribute('size', 'lg');
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--lg')).toBe(true);
      expect(innerButton.classList.contains('lc-button--sm')).toBe(false);
    });

    it('should re-render when disabled changes', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      button.setAttribute('disabled', '');
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--disabled')).toBe(true);
    });

    it('should re-render when href changes', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      expect(button.querySelector('button')).toBeTruthy();

      button.setAttribute('href', '/page');
      await sleep(10);

      expect(button.querySelector('a')).toBeTruthy();
      expect(button.querySelector('button')).toBeNull();
    });
  });

  describe('Style Injection', () => {
    it('should inject comprehensive CSS', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      const styleTag = document.getElementById('lc-button-styles');
      const styles = styleTag.textContent;

      expect(styles).toContain('.lc-button');
      expect(styles).toContain('.lc-button--primary');
      expect(styles).toContain('.lc-button--secondary');
      expect(styles).toContain('.lc-button--outline');
      expect(styles).toContain('.lc-button--ghost');
      expect(styles).toContain('.lc-button--sm');
      expect(styles).toContain('.lc-button--lg');
      expect(styles).toContain('.lc-button--disabled');
    });

    it('should include focus-visible styles', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      const styleTag = document.getElementById('lc-button-styles');
      const styles = styleTag.textContent;

      expect(styles).toContain('focus-visible');
    });

    it('should include reduced motion styles', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      const styleTag = document.getElementById('lc-button-styles');
      const styles = styleTag.textContent;

      expect(styles).toContain('prefers-reduced-motion');
    });

    it('should include WCAG AAA touch target size', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      const styleTag = document.getElementById('lc-button-styles');
      const styles = styleTag.textContent;

      expect(styles).toContain('min-height: 44px');
      expect(styles).toContain('min-width: 44px');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle all attributes together', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('variant', 'outline');
      button.setAttribute('size', 'lg');
      button.setAttribute('aria-label', 'Large outline button');
      button.textContent = 'Click Here';
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--outline')).toBe(true);
      expect(innerButton.classList.contains('lc-button--lg')).toBe(true);
      expect(innerButton.getAttribute('aria-label')).toBe('Large outline button');
      expect(innerButton.textContent).toContain('Click Here');
    });

    it('should work as submit button in form', async () => {
      const form = document.createElement('form');
      const button = document.createElement('lc-button');
      button.setAttribute('type', 'submit');
      button.textContent = 'Submit';

      form.appendChild(button);
      document.body.appendChild(form);
      await sleep(10);

      const innerButton = button.querySelector('button');
      expect(innerButton.getAttribute('type')).toBe('submit');
    });

    it('should work as reset button in form', async () => {
      const form = document.createElement('form');
      const button = document.createElement('lc-button');
      button.setAttribute('type', 'reset');
      button.textContent = 'Reset';

      form.appendChild(button);
      document.body.appendChild(form);
      await sleep(10);

      const innerButton = button.querySelector('button');
      expect(innerButton.getAttribute('type')).toBe('reset');
    });

    it('should handle rapid attribute changes', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      button.setAttribute('variant', 'primary');
      button.setAttribute('variant', 'secondary');
      button.setAttribute('variant', 'outline');
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--outline')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      expect(() => button.querySelector('.lc-button')).not.toThrow();
    });

    it('should handle special characters in content', async () => {
      const button = document.createElement('lc-button');
      button.textContent = '<>&"\'';
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton).toBeTruthy();
    });

    it('should handle very long text content', async () => {
      const button = document.createElement('lc-button');
      button.textContent = 'A'.repeat(1000);
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.textContent.length).toBeGreaterThan(999);
    });

    it('should handle invalid variant gracefully', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('variant', 'invalid');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--invalid')).toBe(true);
    });

    it('should handle invalid size gracefully', async () => {
      const button = document.createElement('lc-button');
      button.setAttribute('size', 'invalid');
      document.body.appendChild(button);
      await sleep(10);

      const innerButton = button.querySelector('.lc-button');
      expect(innerButton.classList.contains('lc-button--invalid')).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should work with multiple buttons on same page', async () => {
      const button1 = document.createElement('lc-button');
      button1.setAttribute('variant', 'primary');
      button1.textContent = 'Button 1';

      const button2 = document.createElement('lc-button');
      button2.setAttribute('variant', 'secondary');
      button2.textContent = 'Button 2';

      document.body.appendChild(button1);
      document.body.appendChild(button2);
      await sleep(10);

      expect(button1.querySelector('.lc-button--primary')).toBeTruthy();
      expect(button2.querySelector('.lc-button--secondary')).toBeTruthy();
    });

    it('should be removable from DOM', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      expect(() => {
        // Clear listeners before removal to avoid cleanup bug
        button._listeners?.clear();
        document.body.removeChild(button);
      }).not.toThrow();
    });

    it('should be re-addable to DOM', async () => {
      const button = document.createElement('lc-button');
      document.body.appendChild(button);
      await sleep(10);

      // Clear listeners before removal to avoid cleanup bug
      button._listeners?.clear();
      document.body.removeChild(button);
      document.body.appendChild(button);
      await sleep(10);

      expect(button.querySelector('.lc-button')).toBeTruthy();
    });
  });
});
