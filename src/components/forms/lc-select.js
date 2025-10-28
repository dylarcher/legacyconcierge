/**
 * Select Component
 * Dropdown select with search/filter capability
 * @element lc-select
 * @attr {string} name - Select name attribute
 * @attr {string} value - Selected value
 * @attr {string} label - Label text
 * @attr {string} placeholder - Placeholder text
 * @attr {string} help - Help text below select
 * @attr {string} error - Error message (shows error state)
 * @attr {string} success - Success message (shows success state)
 * @attr {boolean} required - Mark field as required
 * @attr {boolean} disabled - Disable select
 * @attr {boolean} searchable - Enable search/filter
 * @attr {string} options - JSON array of options [{label, value, disabled}]
 * @attr {string} size - Select size (sm, base, lg)
 * @fires lc-select-change - Emitted when value changes
 * @fires lc-select-open - Emitted when dropdown opens
 * @fires lc-select-close - Emitted when dropdown closes
 * @example
 * <lc-select
 *   name="country"
 *   label="Country"
 *   placeholder="Select a country"
 *   searchable
 *   required
 *   options='[
 *     {"label": "United States", "value": "us"},
 *     {"label": "Canada", "value": "ca"},
 *     {"label": "United Kingdom", "value": "uk"}
 *   ]'
 * ></lc-select>
 */

import Component from '../base/Component.js';

class LCSelect extends Component {
  static get observedAttributes() {
    return [
      'name',
      'value',
      'label',
      'placeholder',
      'help',
      'error',
      'success',
      'required',
      'disabled',
      'searchable',
      'options',
      'size'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.selectId = `lc-select-${Math.random().toString(36).substr(2, 9)}`;
    this.isOpen = false;
    this.searchQuery = '';
    this.filteredOptions = [];
    this.focusedIndex = -1;
  }

  async render() {
    const name = this.getAttr('name', '');
    const value = this.getAttr('value', '');
    const label = this.getAttr('label');
    const placeholder = this.getAttr('placeholder', 'Select...');
    const help = this.getAttr('help');
    const error = this.getAttr('error');
    const success = this.getAttr('success');
    const required = this.getBoolAttr('required');
    const disabled = this.getBoolAttr('disabled');
    const searchable = this.getBoolAttr('searchable');
    const options = this.getJsonAttr('options', []);
    const size = this.getAttr('size', 'base');

    // Store options for filtering
    this.allOptions = options;
    this.filteredOptions = options;

    // Find selected option
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    // Determine state
    const hasError = !!error;
    const hasSuccess = !!success && !hasError;
    const state = hasError ? 'error' : hasSuccess ? 'success' : 'default';

    // Build classes
    const wrapperClasses = [
      'lc-select',
      `lc-select--${size}`,
      `lc-select--${state}`
    ];

    if (disabled) wrapperClasses.push('lc-select--disabled');
    if (this.isOpen) wrapperClasses.push('lc-select--open');
    if (searchable) wrapperClasses.push('lc-select--searchable');

    // Build HTML
    let html = '';

    // Label
    if (label) {
      html += `
        <label id="${this.selectId}-label" class="lc-select__label">
          ${this.escapeHtml(label)}
          ${required ? '<span class="lc-select__required" aria-label="required">*</span>' : ''}
        </label>
      `;
    }

    // Hidden native select for form submission
    html += `
      <select
        name="${name}"
        class="lc-select__native"
        ${required ? 'required' : ''}
        ${disabled ? 'disabled' : ''}
        aria-hidden="true"
        tabindex="-1"
      >
        ${!value ? '<option value=""></option>' : ''}
        ${options.map(opt => `
          <option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>
            ${this.escapeHtml(opt.label)}
          </option>
        `).join('')}
      </select>
    `;

    // Custom select button
    html += `
      <button
        type="button"
        id="${this.selectId}"
        class="lc-select__button"
        ${disabled ? 'disabled' : ''}
        aria-haspopup="listbox"
        aria-expanded="${this.isOpen}"
        aria-labelledby="${this.selectId}-label ${this.selectId}"
        aria-describedby="${this.selectId}-message"
        ${hasError ? 'aria-invalid="true"' : ''}
      >
        <span class="lc-select__value ${!selectedOption ? 'lc-select__value--placeholder' : ''}">
          ${this.escapeHtml(displayValue)}
        </span>
        <svg class="lc-select__icon" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </button>
    `;

    // Dropdown
    html += `
      <div class="lc-select__dropdown" id="${this.selectId}-listbox" role="listbox" aria-labelledby="${this.selectId}-label">
    `;

    // Search input (if searchable)
    if (searchable) {
      html += `
        <div class="lc-select__search">
          <input
            type="text"
            class="lc-select__search-input"
            placeholder="Search..."
            aria-label="Search options"
          >
        </div>
      `;
    }

    // Options list
    html += '<div class="lc-select__options">';
    if (this.filteredOptions.length === 0) {
      html += '<div class="lc-select__empty">No options found</div>';
    } else {
      this.filteredOptions.forEach((option, index) => {
        const isSelected = option.value === value;
        const isFocused = index === this.focusedIndex;
        html += `
          <div
            class="lc-select__option ${isSelected ? 'lc-select__option--selected' : ''} ${isFocused ? 'lc-select__option--focused' : ''} ${option.disabled ? 'lc-select__option--disabled' : ''}"
            role="option"
            aria-selected="${isSelected}"
            data-value="${option.value}"
            data-index="${index}"
            ${option.disabled ? 'aria-disabled="true"' : ''}
          >
            ${this.escapeHtml(option.label)}
            ${isSelected ? '<svg class="lc-select__check" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>' : ''}
          </div>
        `;
      });
    }
    html += '</div>'; // Close options

    html += '</div>'; // Close dropdown

    // Message (help/error/success)
    const message = error || success || help;
    if (message) {
      html += `
        <div
          id="${this.selectId}-message"
          class="lc-select__message lc-select__message--${state}"
          ${hasError ? 'role="alert"' : ''}
        >
          ${this.escapeHtml(message)}
        </div>
      `;
    }

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = wrapperClasses.join(' ');
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  setupEventListeners() {
    const button = this.$('.lc-select__button');
    const searchInput = this.$('.lc-select__search-input');

    if (!button) return;

    // Button click - toggle dropdown
    this.on(button, 'click', () => {
      if (!this.getBoolAttr('disabled')) {
        this.toggleDropdown();
      }
    });

    // Button keyboard
    this.on(button, 'keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.openDropdown();
        this.focusedIndex = 0;
        this.updateFocusedOption();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggleDropdown();
      }
    });

    // Search input
    if (searchInput) {
      this.on(searchInput, 'input', (event) => {
        this.searchQuery = event.target.value.toLowerCase();
        this.filterOptions();
      });

      this.on(searchInput, 'keydown', (event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          this.focusNextOption();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          this.focusPreviousOption();
        } else if (event.key === 'Enter') {
          event.preventDefault();
          this.selectFocusedOption();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          this.closeDropdown();
        }
      });
    }

    // Option clicks
    const options = this.$$('.lc-select__option:not(.lc-select__option--disabled)');
    options.forEach(option => {
      this.on(option, 'click', () => {
        const value = option.dataset.value;
        this.selectOption(value);
      });

      this.on(option, 'mouseenter', () => {
        this.focusedIndex = parseInt(option.dataset.index, 10);
        this.updateFocusedOption();
      });
    });

    // Click outside to close
    this.on(document, 'click', (event) => {
      if (!this.contains(event.target)) {
        this.closeDropdown();
      }
    });

    // Keyboard navigation in dropdown
    this.on(document, 'keydown', (event) => {
      if (!this.isOpen) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focusNextOption();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focusPreviousOption();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        this.selectFocusedOption();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        this.closeDropdown();
      }
    });
  }

  /**
   * Toggle dropdown open/close
   */
  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * Open dropdown
   */
  openDropdown() {
    this.isOpen = true;
    this.$('.lc-select')?.classList.add('lc-select--open');
    const button = this.$('.lc-select__button');
    if (button) {
      button.setAttribute('aria-expanded', 'true');
    }

    // Focus search input if searchable
    const searchInput = this.$('.lc-select__search-input');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 50);
    }

    this.emit('lc-select-open', { select: this });
  }

  /**
   * Close dropdown
   */
  closeDropdown() {
    this.isOpen = false;
    this.$('.lc-select')?.classList.remove('lc-select--open');
    const button = this.$('.lc-select__button');
    if (button) {
      button.setAttribute('aria-expanded', 'false');
      button.focus();
    }

    // Clear search
    this.searchQuery = '';
    const searchInput = this.$('.lc-select__search-input');
    if (searchInput) {
      searchInput.value = '';
    }
    this.filteredOptions = this.allOptions;
    this.focusedIndex = -1;

    this.emit('lc-select-close', { select: this });
  }

  /**
   * Filter options based on search query
   */
  filterOptions() {
    if (!this.searchQuery) {
      this.filteredOptions = this.allOptions;
    } else {
      this.filteredOptions = this.allOptions.filter(option =>
        option.label.toLowerCase().includes(this.searchQuery)
      );
    }

    this.focusedIndex = this.filteredOptions.length > 0 ? 0 : -1;
    this.rerender();
  }

  /**
   * Focus next option
   */
  focusNextOption() {
    if (this.filteredOptions.length === 0) return;
    this.focusedIndex = (this.focusedIndex + 1) % this.filteredOptions.length;
    this.updateFocusedOption();
    this.scrollToFocused();
  }

  /**
   * Focus previous option
   */
  focusPreviousOption() {
    if (this.filteredOptions.length === 0) return;
    this.focusedIndex = this.focusedIndex <= 0 ? this.filteredOptions.length - 1 : this.focusedIndex - 1;
    this.updateFocusedOption();
    this.scrollToFocused();
  }

  /**
   * Update focused option class
   */
  updateFocusedOption() {
    const options = this.$$('.lc-select__option');
    options.forEach((option, index) => {
      if (index === this.focusedIndex) {
        option.classList.add('lc-select__option--focused');
      } else {
        option.classList.remove('lc-select__option--focused');
      }
    });
  }

  /**
   * Scroll to focused option
   */
  scrollToFocused() {
    const focusedOption = this.$(`.lc-select__option[data-index="${this.focusedIndex}"]`);
    if (focusedOption) {
      focusedOption.scrollIntoView({ block: 'nearest' });
    }
  }

  /**
   * Select focused option
   */
  selectFocusedOption() {
    if (this.focusedIndex >= 0 && this.focusedIndex < this.filteredOptions.length) {
      const option = this.filteredOptions[this.focusedIndex];
      if (!option.disabled) {
        this.selectOption(option.value);
      }
    }
  }

  /**
   * Select an option by value
   * @param {string} value - Option value
   */
  selectOption(value) {
    this.setValue(value);
    this.closeDropdown();

    this.emit('lc-select-change', {
      select: this,
      name: this.getAttr('name'),
      value
    });
  }

  /**
   * Get current value
   * @returns {string}
   */
  getValue() {
    return this.getAttr('value', '');
  }

  /**
   * Set value
   * @param {string} value - New value
   */
  setValue(value) {
    this.setAttribute('value', value);

    // Update native select
    const nativeSelect = this.$('.lc-select__native');
    if (nativeSelect) {
      nativeSelect.value = value;
    }
  }

  /**
   * Set error message
   * @param {string} message - Error message
   */
  setError(message) {
    this.setAttribute('error', message);
    this.removeAttribute('success');
  }

  /**
   * Set success message
   * @param {string} message - Success message
   */
  setSuccess(message) {
    this.setAttribute('success', message);
    this.removeAttribute('error');
  }

  /**
   * Clear error and success states
   */
  clearError() {
    this.removeAttribute('error');
    this.removeAttribute('success');
  }

  /**
   * Check if select is valid
   * @returns {boolean}
   */
  isValid() {
    const nativeSelect = this.$('.lc-select__native');
    return nativeSelect ? nativeSelect.validity.valid : true;
  }

  /**
   * Escape HTML
   * @param {string} str - String to escape
   * @returns {string}
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  onAttributeChanged(name, _oldValue, _newValue) {
    if (this._initialized && name !== 'value') {
      this.rerender();
    } else if (name === 'value' && this._initialized) {
      this.rerender(); // Need to update button display
    }
  }

  applyStyles() {
    if (document.getElementById('lc-select-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-select-styles';
    style.textContent = `
      .lc-select {
        display: block;
        position: relative;
        margin-bottom: var(--form-field-spacing);
      }

      .lc-select__label {
        display: block;
        font-family: var(--font-family-sans);
        font-size: var(--form-label-font-size);
        font-weight: var(--form-label-font-weight);
        color: var(--form-label-color);
        margin-bottom: var(--space-2);
      }

      .lc-select__required {
        color: var(--form-error-color);
        margin-left: var(--space-1);
      }

      .lc-select__native {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }

      .lc-select__button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        font-family: var(--font-family-sans);
        font-size: var(--form-input-font-size);
        text-align: left;
        color: var(--form-input-color);
        background: var(--form-input-bg);
        border: var(--form-input-border-width) solid var(--form-input-border-color);
        border-radius: var(--form-input-radius);
        padding: var(--form-input-padding-y) var(--form-input-padding-x);
        cursor: pointer;
        transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        min-height: 44px;
      }

      .lc-select__button:hover:not(:disabled) {
        border-color: var(--form-input-border-hover-color);
      }

      .lc-select__button:focus {
        outline: none;
        border-color: var(--form-input-border-focus-color);
        box-shadow: var(--form-input-focus-shadow);
      }

      .lc-select__button:disabled {
        background: var(--form-input-disabled-bg);
        color: var(--form-input-disabled-color);
        cursor: not-allowed;
        opacity: 0.6;
      }

      .lc-select__value {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .lc-select__value--placeholder {
        color: var(--form-input-placeholder-color);
      }

      .lc-select__icon {
        flex-shrink: 0;
        margin-left: var(--space-2);
        transition: transform var(--transition-fast);
      }

      .lc-select--open .lc-select__icon {
        transform: rotate(180deg);
      }

      /* Dropdown */
      .lc-select__dropdown {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: var(--z-dropdown);
        margin-top: var(--space-1);
        background: var(--dropdown-bg);
        border: 1px solid var(--dropdown-border);
        border-radius: var(--dropdown-radius);
        box-shadow: var(--dropdown-shadow);
        max-height: 300px;
        overflow: hidden;
      }

      .lc-select--open .lc-select__dropdown {
        display: flex;
        flex-direction: column;
      }

      /* Search */
      .lc-select__search {
        padding: var(--space-2);
        border-bottom: 1px solid var(--dropdown-border);
      }

      .lc-select__search-input {
        width: 100%;
        font-family: var(--font-family-sans);
        font-size: var(--font-size-sm);
        padding: var(--space-2);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-sm);
        outline: none;
      }

      .lc-select__search-input:focus {
        border-color: var(--interactive-default);
      }

      /* Options */
      .lc-select__options {
        overflow-y: auto;
        padding: var(--space-1) 0;
      }

      .lc-select__option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--dropdown-item-padding-y) var(--dropdown-item-padding-x);
        cursor: pointer;
        transition: background var(--transition-fast);
      }

      .lc-select__option:hover:not(.lc-select__option--disabled) {
        background: var(--dropdown-item-hover-bg);
      }

      .lc-select__option--focused {
        background: var(--dropdown-item-hover-bg);
      }

      .lc-select__option--selected {
        font-weight: var(--font-weight-semibold);
        color: var(--interactive-default);
      }

      .lc-select__option--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .lc-select__check {
        flex-shrink: 0;
        margin-left: var(--space-2);
      }

      .lc-select__empty {
        padding: var(--space-4);
        text-align: center;
        color: var(--text-muted);
        font-size: var(--font-size-sm);
      }

      /* Sizes */
      .lc-select--sm .lc-select__button {
        padding: var(--form-input-padding-y-sm) var(--form-input-padding-x-sm);
        font-size: var(--font-size-sm);
        min-height: 36px;
      }

      .lc-select--lg .lc-select__button {
        padding: var(--form-input-padding-y-lg) var(--form-input-padding-x-lg);
        font-size: var(--font-size-lg);
        min-height: 52px;
      }

      /* States */
      .lc-select--error .lc-select__button {
        border-color: var(--form-error-color);
      }

      .lc-select--success .lc-select__button {
        border-color: var(--form-success-color);
      }

      /* Message */
      .lc-select__message {
        display: block;
        font-size: var(--font-size-sm);
        margin-top: var(--space-2);
        line-height: 1.4;
      }

      .lc-select__message--default {
        color: var(--text-secondary);
      }

      .lc-select__message--error {
        color: var(--form-error-color);
      }

      .lc-select__message--success {
        color: var(--form-success-color);
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-select__button,
        .lc-select__icon,
        .lc-select__option {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-select', LCSelect);
export default LCSelect;
